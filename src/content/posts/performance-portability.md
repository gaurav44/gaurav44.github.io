---
title: "From Threads to Kernels: Building a Tiny Portability Layer in C++"
description: "Separating memory, execution, ownership, and kernel interfaces across OpenMP and CUDA."
pubDatetime: 2026-05-21T00:00:00Z
tags:
  - cpp
  - cuda
  - openmp
  - hpc
  - performance-portability
---

Separating memory, execution, ownership, and kernel interfaces across OpenMP and CUDA

Performance portability sounds simple when reduced to a slogan: write an algorithm once and run it on different hardware.

The implementation is where that simplicity disappears.

A CPU and a GPU do not merely execute the same loop differently. They can use different memory, different allocation APIs, different compilation paths, and different synchronization rules. An object that is perfectly ordinary in host C++ may not even be legal to pass into a CUDA kernel.

I wanted to understand those boundaries rather than hide them behind a mature library, so I built Veyra, a small C++20 performance-portability library inspired by the core ideas in Kokkos.

Veyra is intentionally narrow. It supports:

- host allocations backed by `std::vector`
- CUDA device allocations backed by `cudaMalloc`
- OpenMP and CUDA execution
- one-dimensional `parallel_for`
- explicit host/device copies
- move-only owning views
- lightweight accessors that can be passed into kernels

It is not intended to replace Kokkos, SYCL or any other performance portable libraries out there. The point is that the entire design is small enough to inspect, question, and understand.

## The first useful distinction: memory is not execution

The most comon mental model is close to

CPU data goes with CPU execution, and GPU data goes with GPU execution.

That works for small examples, but it mixes two separate concerns

1. Where does the data live?
2. Where does the work execute?

Veyra represents these as separate types:

```cpp
struct HostSpace {};
struct CudaSpace {};
struct HostExecutionSpace {};
struct CudaExecutionSpace {};
```

A memory space describes storage. An execution space describes dispatch.

That distinction becomes visible in the main container type:

```cpp
veyra::View<float, veyra::HostSpace> host("host", size);
veyra::View<float, veyra::CudaSpace> device("device", size);
```

The template parameter is not decorative metadata. It selects a different implementation. A host view stores a `std::vector<T>`, while a CUDA view owns a raw device pointer allocated with `cudaMalloc`.

Using types also lets unsupported combinations fail during compilation instead of being discovered through a runtime enum or virtual dispatch path.

This was the first major lesson from this exercise

portability becomes easier to reason about when location and execution are independent parts of the type-level design.

## Owning container: poor kernel argument

The next problem appeared when I tried to make a view usable in both ordinary C++ code and CUDA kernels.

An owning host-side object carries more state than a kernel needs. In Veyra, a view can contain a label, a `std::vector` or allocation-lifetime logic. Passing that entire object into a device kernel would couple memory ownership to element access and introduce state that is not device-friendly.

The kernel only needs two things:

- a pointer
- an extent

That led to `ViewAccessor`

```cpp
template <typename T>
class ViewAccessor
{
public:
   __host__ __device__
   constexpr T& operator()(std::size_t index) const noexcept
   {
     return data_[index];
   }

   __host__ __device__
   constexpr std::size_t size() const noexcept
   {
     return size_;
   }

private:
     T* data_;
     std::size_t size_;
};
```

The owning `View` manages location and lifetime. The non-owning `ViewAccessor` is copied into a function object and passed to a kernel.

This split is small, but it is probably the most important design decision from a performance pov

```text
View<T, Space> -> owns storage and manages lifetime
ViewAccessor<T> -> exposes storage inside a kernel
```

It also provides natural const correctness. Calling `accessor()` on a const view produces `ViewAccessor<const T>`, so a read-only input remains read-only inside the portable kernel.

The tradeoff is explicit: an accessor does not keep its parent alive. If the view is destroyed, its accessors are invalid. That is acceptable here because the synchronous API keeps lifetimes straightforward.

## Making ownership explicit

Both host and CUDA views in Veyra are move-only:

```cpp
View(const View&) = delete;
View& operator=(const View&) = delete;
```

The CUDA specialization implements move construction by transferring the raw pointer and clearing the source:

```cpp
View(View&& other) noexcept
 : label_(std::move(other.label_)),
   data_(std::exchange(other.data_, nullptr)),
   size_(std::exchange(other.size_, 0)) {}
```

This prevents accidental duplicate ownership and double calls to `cudaFree`. It also avoids pretending that copying an owning view is cheap.

This differs from Kokkos, where views generally have shallow-copy, reference-counted semantics. I chose move-only ownership because Veyra is a hobby project/implementation: allocation lifetime stays visible, and the number of mechanisms remains small.

That choice is not universally better. It is simply a deliberate tradeoff between convenience and transparency.

## Data movement should be visible

Once host and device memory are separate, data movement has to become part of the API.

Veyra provides four `deep_copy` overloads:

- Host -> Host
- Host -> CUDA
- CUDA -> Host
- CUDA -> CUDA

A typical flow looks like this:

```cpp
veyra::deep_copy(device, host);
// Execute work on the GPU.
veyra::deep_copy(result, device);
```

Host copies use `std::copy_n`. Copies involving device memory use `cudaMemcpy` with the corresponding transfer direction. Every overload checks that source and destination extents match before copying.

I deliberately avoided automatic migration or unified memory. Explicit copies make the cost model visible. When reading an algorithm, I can identify exactly where data crosses the host/device boundary.

That visibility matters because a portable kernel does not automatically imply a portable or efficient data-movement strategy.

## One parallel_for two backends

The execution abstraction is a pair of overloaded functions.

For the host backend, `parallel_for` is an OpenMP loop:

```cpp
template <typename Function>
void parallel_for(
 HostExecutionSpace,
 std::size_t count,
 Function function)
 {
#pragma omp parallel for
   for (std::size_t index = 0; index < count; ++index)
   {
     function(index);
   }
}
```

For the CUDA backend, the function launches a generic kernel:

```cpp
template <typename Function>
__global__ void parallel_for_kernel(
 std::size_t count,
 Function function)
 {
   const std::size_t index =
   blockIdx.x * blockDim.x + threadIdx.x;
   if (index < count)
   {
     function(index);
   }
 }
```

The CUDA overload computes a one-dimensional launch configuration, launches that kernel, checks the launch result, and synchronizes.

The backend is selected through the execution-space argument:

```cpp
veyra::parallel_for(
 veyra::HostExecutionSpace{},
 count,
 function);

veyra::parallel_for(
 veyra::CudaExecutionSpace{},
 count,
 function);
```

There is no inheritance hierarchy and no runtime backend switch. Ordinary C++ overload resolution selects the implementation.

## Proving that the algorithm is actually portable

Wrapping OpenMP and CUDA independently would not be enough. The meaningful test was whether the same algorithm body could execute through both backends.

I used SAXPY first:

```cpp
struct Saxpy {
 veyra::ViewAccessor<const float> x;
 veyra::ViewAccessor<float> y;
 float a;

__host__ __device__
 void operator()(std::size_t index) const
 {
   y(index) = a * x(index) + y(index);
 }

};
```

The algorithm is parameterized by execution and memory spaces:

```cpp
template <
 veyra::ExecutionSpace Exec,
 veyra::MemorySpace Space>
void saxpy(
 Exec exec,
 const veyra::View<float, Space>& x,
 veyra::View<float, Space>& y,
 float a)
{
 veyra::parallel_for(
 exec,
 x.size(),
 Saxpy{x.accessor(), y.accessor(), a});
}
```

The calls differ only in the selected spaces:

```cpp
saxpy(
 veyra::HostExecutionSpace{},
 x_host,
 y_host,
 a);

saxpy(
 veyra::CudaExecutionSpace{},
 x_device,
 y_device,
 a);
```

I then implemented a three-point stencil with boundary handling and three weights. It uses a stateful function object and demonstrates that the design is not limited to a trivial assignment.

Both examples execute on OpenMP and CUDA, copy the GPU result back, and compare every output element.

This is where the abstractions started to feel real. The portable unit is not the allocation code or launch syntax. It is the function object that expresses the computation.

## Portability still has a compilation boundary

One subtle point is that portable source code still needs the correct compiler.

The SAXPY and stencil examples use a cpp extension, but CMake explicitly compiles them as CUDA translation units:

```cmake
set_source_files_properties(
 examples/portable_saxpy.cpp
 examples/portable_stencil.cpp
 PROPERTIES LANGUAGE CUDA)
```

The same function object can be instantiated for host and device, but device code still has to pass through NVCC. A portable abstraction does not remove the backend toolchain; it creates a common programming interface above it.

The build also sets `CMAKE_CUDA_ARCHITECTURES` which must match a target supported by both the installed CUDA toolkit and the actual GPU. This is an easy source of confusing build failures: newer architectures require newer toolkits, while old architectures may have been removed from current toolkits.

## Synchronous by design

Veyra currently synchronizes after every CUDA `parallel_for` and `deep_copy` uses synchronous `cudaMemcpy`

In a production runtime, one would prefer an asynchronous launch of workload as well asynchronous copies per execution space. The synchronous copies/execution was used to keep things simple for this hobby project.

Synchronous execution gives the project simple guarantees:

- when `parallel_for` returns, the work is complete
- launch and execution errors are reported immediately
- accessors remain valid for the duration of the operation
- examples do not need streams, events, or fences

The cost is lost overlap between computation and data movement. A future version would need execution instances or streams plus an explicit fence operation. Adding those features would also force a more careful lifetime model.

## Testing the boundaries

The Unit Test suite covers both host and CUDA behavior.

Beyond ordinary element access, I added tests for:

- zero-sized allocations;
- const accessors;
- move construction and move assignment;
- host-to-host, host-to-device, device-to-host, and device-to-device copies;
- rejected copies when extents differ;
- zero-iteration kernel launches;
- every index being executed; and
- the same stateful function object producing matching host and CUDA results.

The ownership tests matter because resource bugs often hide in move operations, not in the first allocation. The extent-mismatch tests matter because a thin abstraction should still reject obviously unsafe operations.

The project also centralizes CUDA error conversion:

```cpp
inline void check_cuda(
 cudaError_t result,
 const char* operation)
 {
   if (result != cudaSuccess)
   {
     throw std::runtime_error(
     std::string{operation} + ": " +
     cudaGetErrorString(result));
   }
 }
```

This keeps failures attached to the operation that caused them instead of letting CUDA errors surface later with little context.

## What I deliberately did not build

Veyra has no multidimensional layouts, reductions, scans, streams, managed memory, bounds checking, or reference-counted views. Its execution policy is only a one-dimensional index range.

Those omissions are part of the experiment.

It is easy to describe a portability library as a collection of wrappers. Building even this small subset showed me that the difficult part is defining the contracts between components:

- Who owns an allocation?
- Which objects are legal kernel arguments?
- When does work complete?
- Where is data allowed to live?
- How is data movement represented?
- Which mistakes should fail at compile time?
- Which failures need runtime diagnostics?

Larger libraries answer these questions with substantially more machinery because they support more hardware, memory models, layouts, and execution patterns. Veyra makes a few of the same questions visible without attempting the same breadth.

## What I learned

The main outcome was not a faster SAXPY or stencil. It was a clearer model of performance-portable software.

Four ideas did most of the work:

1. Memory space and execution space are different abstractions.
2. Owning containers and kernel-facing handles should be different types.
3. Data movement should be explicit when memory spaces are distinct.
4. The portable part is the computation, while allocation, dispatch, and compilation remain backend-specific.

Once those boundaries were in place, the implementation became surprisingly small. OpenMP and CUDA could share an algorithm without pretending that their runtime models were identical.

That is the value I found in building Veyra: not recreating a mature performance-portability ecosystem, but reducing it until the essential design decisions became impossible to miss.

Veyra is an hobby C++20 project. The source includes host and CUDA views, explicit deep copies, OpenMP/CUDA `parallel_for` portable SAXPY and stencil examples, and test coverage for the core ownership and execution paths.
