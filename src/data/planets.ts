import type { PlanetProfile } from "../types/editor";

export const PLANETS: PlanetProfile[] = [
  {
    id: "mercury",
    name: "Mercury",
    kicker: "Sun-scorched",
    texture: "/assets/planets/mercury.jpg",
    preview: "/assets/planets/previews/mercury.webp",
    accent: "#c9b79e",
    atmosphere: "#d8c9b6",
    roughness: 1,
    relief: 0.09,
    polarScale: 0.9986,
    axialTilt: 0.03,
    rotationSpeed: 0.018
  },
  {
    id: "venus",
    name: "Venus",
    kicker: "Cloud-wrapped",
    texture: "/assets/planets/venus-surface.jpg",
    preview: "/assets/planets/previews/venus.webp",
    cloudTexture: "/assets/planets/venus-clouds.jpg",
    accent: "#e5b56d",
    atmosphere: "#f3ba63",
    roughness: 0.88,
    relief: 0.025,
    polarScale: 1,
    axialTilt: 0.08,
    rotationSpeed: -0.012
  },
  {
    id: "earth",
    name: "Earth",
    kicker: "Ocean world",
    texture: "/assets/planets/earth.jpg",
    preview: "/assets/planets/previews/earth.webp",
    cloudTexture: "/assets/planets/earth-clouds.jpg",
    accent: "#6db9df",
    atmosphere: "#5da9ff",
    roughness: 0.72,
    relief: 0.055,
    polarScale: 0.9967,
    axialTilt: 0.409,
    rotationSpeed: 0.048
  },
  {
    id: "mars",
    name: "Mars",
    kicker: "Rust & dust",
    texture: "/assets/planets/mars.jpg",
    preview: "/assets/planets/previews/mars.webp",
    accent: "#df8051",
    atmosphere: "#e47b4d",
    roughness: 0.94,
    relief: 0.075,
    polarScale: 0.9941,
    axialTilt: 0.439,
    rotationSpeed: 0.052
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kicker: "Storm giant",
    texture: "/assets/planets/jupiter.jpg",
    preview: "/assets/planets/previews/jupiter.webp",
    accent: "#e3b985",
    atmosphere: "#d89a67",
    roughness: 0.82,
    relief: 0.012,
    polarScale: 0.9351,
    axialTilt: 0.054,
    rotationSpeed: 0.085
  },
  {
    id: "saturn",
    name: "Saturn",
    kicker: "Ringed giant",
    texture: "/assets/planets/saturn.jpg",
    preview: "/assets/planets/previews/saturn.webp",
    ringTexture: "/assets/planets/saturn-ring.png",
    accent: "#e7cf91",
    atmosphere: "#d9bd7d",
    roughness: 0.84,
    relief: 0.01,
    polarScale: 0.902,
    axialTilt: 0.466,
    rotationSpeed: 0.078
  },
  {
    id: "uranus",
    name: "Uranus",
    kicker: "Ice giant",
    texture: "/assets/planets/uranus.jpg",
    preview: "/assets/planets/previews/uranus.webp",
    accent: "#9ddce2",
    atmosphere: "#85e2ea",
    roughness: 0.8,
    relief: 0.008,
    polarScale: 0.9771,
    axialTilt: 1.706,
    rotationSpeed: -0.058
  },
  {
    id: "neptune",
    name: "Neptune",
    kicker: "Wind world",
    texture: "/assets/planets/neptune.jpg",
    preview: "/assets/planets/previews/neptune.webp",
    accent: "#78aebb",
    atmosphere: "#75b2bf",
    roughness: 0.78,
    relief: 0.012,
    polarScale: 0.9829,
    axialTilt: 0.494,
    rotationSpeed: 0.064
  },
  {
    id: "moon",
    name: "Moon",
    kicker: "Airless satellite",
    texture: "/assets/planets/moon.jpg",
    preview: "/assets/planets/previews/moon.webp",
    accent: "#d7d3c8",
    atmosphere: "#c7d5e4",
    roughness: 1,
    relief: 0.1,
    polarScale: 0.9988,
    axialTilt: 0.117,
    rotationSpeed: 0.014
  }
];

export const PLANET_BY_ID = Object.fromEntries(
  PLANETS.map((planet) => [planet.id, planet])
) as Record<PlanetProfile["id"], PlanetProfile>;
