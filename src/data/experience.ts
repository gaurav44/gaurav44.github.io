export type Experience = {
  company: string;
  role: string;
  period: string;
  product?: string;
  summary: string;
  context?: string;
  impacts?: {
    label: string;
    value: string;
    description: string;
    icon?:
      | "speed"
      | "backend"
      | "distributed"
      | "diagnostics"
      | "cmake"
      | "coupling";
  }[];
  highlights: string[];
  tags: string[];
  visual?: {
    label: string;
    kind: "dem-pipeline" | "cfd-stack";
    caption: string;
  };
  image?: {
    src: string;
    alt: string;
  };
  referenceHref?: string;
};

export const softwareExperience: Experience[] = [
  {
    company: "DCS Computing GmbH",
    role: "HPC Software Developer",
    product: "Aspherix Simulation Software",
    period: "Jan. 2025 - July 2026",
    summary:
      "Shipped GPU algorithms, backend portability, meshing, and distributed debugging work for DEM particle simulation software.",
    context:
      "Aspherix is a DEM particle simulation codebase for industrial bulk-material simulations.",
    impacts: [
      {
        label: "Acceleration",
        value: "20x",
        description: "Faster broad-phase neighbor-list generation",
        icon: "speed",
      },
      {
        label: "Multi-backend",
        value: "CUDA / HIP",
        description:
          "GPU and CPU backend support through Kokkos/HIP and OpenMP",
        icon: "backend",
      },
      {
        label: "Distributed",
        value: "MPI",
        description: "Debugging and production simulation support",
        icon: "distributed",
      },
    ],
    highlights: [
      "Ported particle-mesh force calculation to GPU",
      "20x faster broad-phase neighbor-list generation",
      "Extended CUDA, HIP, and OpenMP backend support, including AMD GPU enablement through Kokkos/HIP",
      "Debugged MPI and GPU simulation failures with Python-GDB integration and tmpi",
      "Refactored convex decomposition meshing code, integrated CoACD, and added GoogleTest coverage",
    ],
    tags: ["C++", "CUDA", "HIP", "OpenMP", "MPI", "Kokkos"],
    visual: {
      label: "Particle Simulation Pipeline",
      kind: "dem-pipeline",
      caption:
        "Particles mapped to mesh forces, compute backends, and MPI nodes.",
    },
    referenceHref: "/references/dcs.pdf",
  },
  {
    company: "Altair Engineering GmbH",
    role: "Working Student",
    product: "nanoFluidX GPU Simulation Software Team",
    period: "June 2022 - June 2024",
    summary:
      "Built tooling, test workflows, build-system support, and solver integration work around GPU-accelerated particle-based CFD software.",
    context:
      "nanoFluidX is GPU-accelerated CFD simulation software for particle-based fluid dynamics.",
    impacts: [
      {
        label: "Diagnostics",
        value: "C++ / Python",
        description: "C++ multi-GPU tools and Python automated test workflows",
        icon: "diagnostics",
      },
      {
        label: "Infrastructure",
        value: "CMake",
        description: "Cross-platform Linux and Windows builds",
        icon: "cmake",
      },
      {
        label: "Multiphysics",
        value: "Coupling",
        description:
          "nanoFluidX and MotionSolve integration with Kratos/CoSimIO",
        icon: "coupling",
      },
    ],
    highlights: [
      "Built C++ diagnostic tools for multi-GPU systems and Python automated test workflows",
      "Maintained Linux and Windows CMake builds for CUDA/C++ simulation software",
      "Delivered multiphysics coupling between nanoFluidX and MotionSolve using Kratos/CoSimIO",
    ],
    tags: ["C++", "CUDA", "CMake", "Python", "Multi-GPU"],
    visual: {
      label: "CFD Software Stack",
      kind: "cfd-stack",
      caption:
        "Particle CFD solver, CUDA/C++ layer, build infrastructure, and coupling.",
    },
    referenceHref: "/references/altair.pdf",
  },
];

export const engineeringExperience: Experience[] = [
  {
    company: "3D Engineering Automation LLP",
    role: "Intern",
    period: "Sept. 2020 - May 2021",
    summary:
      "Set up CFD simulations and post-processing workflows for mixing-tank studies.",
    highlights: [
      "Performed grid-dependence studies for CFD simulations of mixing tanks",
      "Calculated mixing time in Ansys Fluent and streamlined post-processing with macros",
    ],
    tags: ["CFD", "Ansys Fluent", "Post-processing"],
    referenceHref: "/references/3dengg.pdf",
  },
  {
    company: "Michelin India Technology Centre",
    role: "R&D Engineer",
    period: "Dec. 2019 - Sept. 2020",
    summary:
      "Used finite element simulation to support tire performance tuning.",
    highlights: [
      "Performed tuning for wear, endurance, rolling resistance, grip, and noise using finite element analysis",
    ],
    tags: ["FEA", "Simulation", "R&D"],
    referenceHref: "/references/michelin.pdf",
  },
  {
    company: "Samson Controls Pvt. Ltd.",
    role: "Project Intern",
    period: "Aug. 2018 - March 2019",
    summary:
      "Designed and built a mechanical prototype for a manufacturing productivity problem.",
    highlights: [
      "Worked on mitigating a productivity-related manufacturing problem",
      "Designed and manufactured a drilling-machine prototype with adjustable 35 mm to 70 mm spindle distance",
    ],
    tags: ["Mechanical Design", "Manufacturing", "Prototyping"],
    referenceHref: "/references/samson_controls.pdf",
  },
];
