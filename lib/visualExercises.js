const baseExercises = [
  {
    slug: "checker",
    title: "Checker",
    phases: [
      { type: "checker", mode: "center", density: 2, scale: 0.34 },
      { type: "checker", mode: "center", density: 4, scale: 0.4 },
      { type: "checker", mode: "full", density: 8, scale: 0.46 },
    ],
  },
  {
    slug: "stripes",
    title: "Stripes",
    phases: [
      { type: "stripes", mode: "center", density: 3, scale: 0.22 },
      { type: "stripes", mode: "center", density: 6, scale: 0.48 },
      { type: "stripes", mode: "full", density: 10, scale: 0.92 },
    ],
  },
  {
    slug: "circle",
    title: "Circle",
    phases: [
      { type: "circle", mode: "center", count: 4, scale: 0.36 },
      { type: "circle", mode: "full", count: 6, scale: 0.54 },
      { type: "circle", mode: "full", count: 8, scale: 0.68 },
    ],
  },
  {
    slug: "rings",
    title: "Rings",
    phases: [
      { type: "rings", mode: "center", count: 2, scale: 0.24 },
      { type: "rings", mode: "center", count: 4, scale: 0.5 },
      { type: "rings", mode: "full", count: 8, scale: 0.92 },
    ],
  },
  {
    slug: "dot-grid",
    title: "Dots",
    phases: [
      { type: "dots", mode: "center", density: 2, scale: 0.22 },
      { type: "dots", mode: "center", density: 4, scale: 0.46 },
      { type: "dots", mode: "full", density: 8, scale: 0.9 },
    ],
  },
  {
    slug: "spiral",
    title: "Spiral",
    phases: [
      { type: "spiral", mode: "center", scale: 0.18 },
      { type: "spiral", mode: "center", scale: 0.55 },
      { type: "spiral", mode: "full", scale: 1.05 },
    ],
  },
  {
    slug: "sunburst",
    title: "Sunburst",
    phases: [
      { type: "sunburst", mode: "center", rays: 12, scale: 0.2 },
      { type: "sunburst", mode: "center", rays: 24, scale: 0.48 },
      { type: "sunburst", mode: "full", rays: 40, scale: 0.95 },
    ],
  },
  {
    slug: "diamond-grid",
    title: "Diamond Grid",
    phases: [
      { type: "diamondGrid", mode: "full", density: 2, scale: 1 },
      { type: "diamondGrid", mode: "full", density: 4, scale: 1 },
      { type: "diamondGrid", mode: "full", density: 8, scale: 1 },
    ],
  },
  {
    slug: "diamond",
    title: "Diamond",
    phases: [
      { type: "diamond", mode: "center", count: 3, scale: 0.24 },
      { type: "diamond", mode: "center", count: 6, scale: 0.5 },
      { type: "diamond", mode: "full", count: 10, scale: 0.92 },
    ],
  },
  {
    slug: "star",
    title: "Star",
    phases: [
      { type: "star", mode: "center", count: 3, scale: 0.26 },
      { type: "star", mode: "center", count: 5, scale: 0.52 },
      { type: "star", mode: "full", count: 9, scale: 0.92 },
    ],
  },
  {
    slug: "snowflake",
    title: "Snowflake",
    phases: [
      { type: "snowflake", mode: "full", density: 7, scale: 0.7 },
      { type: "snowflake", mode: "full", density: 7, scale: 0.85 },
      { type: "snowflake", mode: "full", density: 7, scale: 1 },
    ],
  },
  {
    slug: "triangles",
    title: "Triangle",
    phases: [
      { type: "triangles", mode: "full", density: 2, scale: 0.7 },
      { type: "triangles", mode: "full", density: 4, scale: 0.85 },
      { type: "triangles", mode: "full", density: 8, scale: 1 },
    ],
  },
  {
    slug: "paw",
    title: "Paw",
    phases: [
      { type: "paw", mode: "center", count: 2, scale: 0.28 },
      { type: "paw", mode: "center", count: 4, scale: 0.54 },
      { type: "paw", mode: "full", count: 7, scale: 0.92 },
    ],
  },
  {
    slug: "cross",
    title: "Cross",
    phases: [
      { type: "cross", mode: "center", count: 3, scale: 0.24 },
      { type: "cross", mode: "center", count: 8, scale: 0.5 },
      { type: "cross", mode: "full", count: 18, scale: 0.92 },
    ],
  },
];

function createVariant(exercise, variant) {
  return {
    ...exercise,
    slug: variant === "color" ? `${exercise.slug}-color` : exercise.slug,
    title: variant === "color" ? `${exercise.title} Color` : `${exercise.title} B&W`,
    variant,
    paletteMode: variant === "color" ? "color" : "mono",
  };
}

export const visualExercises = [
  ...baseExercises.map((exercise) => createVariant(exercise, "mono")),
  ...baseExercises.map((exercise) => createVariant(exercise, "color")),
];
