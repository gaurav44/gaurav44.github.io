export type Project = {
  title: string;
  period?: string;
  category: "software" | "mechanical";
  description: string;
  highlights: string[];
  tags: string[];
  href?: string;
  reportHref?: string;
  selected?: boolean;
};

export const projects: Project[] = [
  {
    title: "GPU-accelerated Rayleigh-Bénard Convection Simulation",
    period: "Sept. 2024 – Nov. 2024",
    category: "software",
    description:
      "Developed a C++/CUDA finite-difference solver for Rayleigh-Bénard convection.",
    highlights: [
      "Developed a C++/CUDA finite-difference solver for Rayleigh-Bénard convection",
      "Implemented Red/Black SOR for multithreaded stencil operations on a 2D grid",
      "Added unit testing with GoogleTest and CI/CD on a self-hosted runner using GitHub Actions",
    ],
    tags: ["C++", "CUDA", "GoogleTest", "GitHub Actions"],
    href: "https://github.com/gaurav44/Rayleigh_Benard_Convection_CUDA",
    selected: true,
  },
  {
    title: "Performance-portable CFD with Kokkos",
    period: "Dec. 2023 – June 2024",
    category: "software",
    description:
      "Ported an adaptive mesh refinement CFD code to a hardware-agnostic framework using Kokkos.",
    highlights: [
      "Ported an adaptive mesh refinement CFD code to a hardware-agnostic framework using Kokkos",
      "Benchmarked single-phase simulations on NVIDIA GPUs and OpenMP CPUs",
      "Achieved up to 3x speedup on selected cases on an NVIDIA A1000 GPU versus a 16-core CPU",
    ],
    tags: ["C++", "Kokkos", "CUDA", "OpenMP"],
    href: "https://gitlab.lrz.de/nanoshock/ALPACA",
    reportHref: "/reports/MSc.ThesisGauravGokhale.pdf",
    selected: true,
  },
  {
    title: "Abalone Game",
    period: "June 2023 – July 2023",
    category: "software",
    description:
      "Developed a C++ implementation of the Abalone board game with a parallelized search algorithm.",
    highlights: [
      "Developed a C++ implementation of Abalone with parallelized minimax and alpha-beta pruning",
    ],
    tags: ["C++", "Algorithms", "Parallel Search"],
  },
  {
    title: "CFD Lab",
    period: "May 2022 – July 2022",
    category: "software",
    description:
      "Developed an object-oriented 2D CFD solver in C++ for incompressible Navier-Stokes equations.",
    highlights: [
      "Developed an object-oriented 2D CFD solver in C++ to solve incompressible Navier-Stokes equations using finite differences",
      "Parallelized the solver for distributed-memory systems using MPI",
      "Simulated and validated standard cases including 2D channel flow, lid-driven cavity, and Rayleigh-Bénard convection",
      "Extended the solver to support free-surface flows using the Marker-and-Cell method, including dam-break and tank-sloshing cases",
    ],
    tags: ["C++", "CFD", "MPI", "Numerical Methods"],
    href: "https://github.com/gaurav44/CFD-lab/tree/MAC",
    // reportHref: "/reports/cfd-lab.pdf",
  },
  {
    title: "Turbulent Flow on HPC Systems",
    period: "Nov. 2022 – Feb. 2023",
    category: "software",
    description:
      "Implemented and validated turbulence models for 3D flows, then evaluated scaling on an HPC system.",
    highlights: [
      "Implemented and validated algebraic and k-epsilon turbulence models for 3D flows",
      "Parallelized the implementation with MPI",
      "Conducted strong and weak scaling on the CoolMUC-2 supercomputer",
    ],
    tags: ["HPC", "MPI", "Turbulence", "CFD"],
    href: "https://github.com/gaurav44/Turbulence-Flow-on-HPC-Systems-Lab/tree/k_e",
    reportHref: "/reports/k_epsilion.pdf",
    selected: true,
  },
  {
    title: "ODE Solver in C++",
    period: "Oct. 2021 – Jan. 2022",
    category: "software",
    description:
      "Object-oriented C++ library for solving initial-value ODE problems with multiple time-integration schemes.",
    highlights: [
      "Implemented Explicit Euler, RK2, RK4, and Implicit Euler methods",
      "Used Eigen for vector and matrix-based state storage",
      "Validated solver behavior with GoogleTest-based numerical tests",
    ],
    tags: ["C++", "Eigen", "GoogleTest", "Numerical Methods"],
    href: "https://github.com/gaurav44/ODE_Solver/tree/sprint_3",
  },
  {
    title: "COVID-19 Data Visualization GUI Application",
    period: "Oct. 2021",
    category: "software",
    description:
      "Created a GUI app for visualizing COVID-19 case and death data by country and state.",
    highlights: [
      "Created a GUI app to visualize cumulative and daily COVID-19 cases and deaths by country and state",
    ],
    tags: ["MATLAB", "GUI", "Data Visualization"],
    href: "https://github.com/gaurav44/Matlab-App-for-COVID-19-data-visualization",
  },
  {
    title: "CFD Analysis of H-Darrieus Type Vertical Axis Wind Turbine",
    period: "July 2019 – Nov. 2019",
    category: "mechanical",
    description:
      "Analyzed a vertical-axis wind turbine using OpenFOAM and presented the work at ICMMSE 2020.",
    highlights: [
      "Explored OpenFOAM utilities including pimpleFOAM, dynamicMeshDict, and Arbitrary Mesh Interface",
      "Plotted coefficient of power versus tip-speed-ratio characteristics",
      "Presented the work at ICMMSE 2020 and won the best paper award for the technical session",
    ],
    tags: ["OpenFOAM", "CFD", "Wind Turbine"],
  },
  {
    title: "Development of Cooling System of Formula Student Car",
    period: "July 2017 – July 2018",
    category: "mechanical",
    description:
      "Designed and analyzed the cooling system for a Formula Student car.",
    highlights: [
      "Performed design calculations for the car cooling system",
      "Performed CFD analysis to optimize side jackets, radiator size, and radiator position",
      "Automated radiator fan control using Arduino UNO",
    ],
    tags: ["CFD", "Mechanical Design", "Arduino"],
  },
  {
    title: "Kinematic Simulation of Variable Compression Engine in MATLAB",
    period: "July 2017 – July 2018",
    category: "mechanical",
    description:
      "Simulated the kinematics of a variable-compression-ratio engine mechanism in MATLAB.",
    highlights: [
      "Studied the mechanism and advantages of variable-compression-ratio engines in automobiles",
      "Performed kinematic simulation of a multi-link mechanism in MATLAB",
      "Analyzed the relationship between compression ratio and connecting-link angle",
    ],
    tags: ["MATLAB", "Kinematics", "Automotive"],
    reportHref: "/reports/seminarreport1.pdf",
  },
  {
    title: "Seminar Work on PETSc",
    category: "software",
    description:
      "Studied PETSc for scalable scientific computing and solver infrastructure.",
    highlights: [
      "Studied PETSc as infrastructure for scalable scientific computing",
      "Focused on solver abstractions and high-performance numerical software workflows",
    ],
    tags: ["PETSc", "Scientific Computing", "Solvers"],
    reportHref: "/reports/ModernTrendsinHPC_PETSc.pdf",
  },
];

export const selectedWork = projects.filter(project => project.selected);
