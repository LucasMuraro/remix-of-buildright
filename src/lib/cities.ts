export const CITIES = [
  { slug: "sao-paulo", name: "São Paulo", state: "SP", emoji: "🌆" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", state: "RJ", emoji: "🌊" },
  { slug: "belo-horizonte", name: "Belo Horizonte", state: "MG", emoji: "⛰️" },
  { slug: "porto-alegre", name: "Porto Alegre", state: "RS", emoji: "🧉" },
  { slug: "curitiba", name: "Curitiba", state: "PR", emoji: "🌲" },
] as const;

export const GENRES = [
  "Sertanejo",
  "Eletrônico",
  "Funk",
  "Pagode",
  "Rock",
  "Indie",
  "Hip Hop",
  "Forró",
  "Open Bar",
  "Bar",
] as const;

export type Genre = typeof GENRES[number];
