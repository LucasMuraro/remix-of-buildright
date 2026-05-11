export interface City {
  slug: string;
  name: string;
  state: string;
  emoji: string;
  isCapital?: boolean;
}

// ~30 cidades: todas as capitais + grandes cidades (>500k hab) + destinos turísticos relevantes pra balada
export const CITIES: City[] = [
  // Sudeste
  { slug: "sao-paulo", name: "São Paulo", state: "SP", emoji: "🌆", isCapital: true },
  { slug: "campinas", name: "Campinas", state: "SP", emoji: "🎓" },
  { slug: "santos", name: "Santos", state: "SP", emoji: "⚓" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", state: "RJ", emoji: "🌊", isCapital: true },
  { slug: "niteroi", name: "Niterói", state: "RJ", emoji: "🌉" },
  { slug: "belo-horizonte", name: "Belo Horizonte", state: "MG", emoji: "⛰️", isCapital: true },
  { slug: "uberlandia", name: "Uberlândia", state: "MG", emoji: "🌾" },
  { slug: "vitoria", name: "Vitória", state: "ES", emoji: "🏝️", isCapital: true },

  // Sul
  { slug: "porto-alegre", name: "Porto Alegre", state: "RS", emoji: "🧉", isCapital: true },
  { slug: "curitiba", name: "Curitiba", state: "PR", emoji: "🌲", isCapital: true },
  { slug: "londrina", name: "Londrina", state: "PR", emoji: "☕" },
  { slug: "florianopolis", name: "Florianópolis", state: "SC", emoji: "🏖️", isCapital: true },
  { slug: "joinville", name: "Joinville", state: "SC", emoji: "🏭" },
  { slug: "balneario-camboriu", name: "Balneário Camboriú", state: "SC", emoji: "🌴" },

  // Nordeste
  { slug: "salvador", name: "Salvador", state: "BA", emoji: "🥁", isCapital: true },
  { slug: "recife", name: "Recife", state: "PE", emoji: "🦀", isCapital: true },
  { slug: "fortaleza", name: "Fortaleza", state: "CE", emoji: "🌞", isCapital: true },
  { slug: "natal", name: "Natal", state: "RN", emoji: "🐚", isCapital: true },
  { slug: "joao-pessoa", name: "João Pessoa", state: "PB", emoji: "🌅", isCapital: true },
  { slug: "maceio", name: "Maceió", state: "AL", emoji: "🥥", isCapital: true },
  { slug: "aracaju", name: "Aracaju", state: "SE", emoji: "🦐", isCapital: true },
  { slug: "sao-luis", name: "São Luís", state: "MA", emoji: "🎭", isCapital: true },
  { slug: "teresina", name: "Teresina", state: "PI", emoji: "🌵", isCapital: true },

  // Centro-Oeste
  { slug: "brasilia", name: "Brasília", state: "DF", emoji: "🏛️", isCapital: true },
  { slug: "goiania", name: "Goiânia", state: "GO", emoji: "🤠", isCapital: true },
  { slug: "campo-grande", name: "Campo Grande", state: "MS", emoji: "🐎", isCapital: true },
  { slug: "cuiaba", name: "Cuiabá", state: "MT", emoji: "🌽", isCapital: true },

  // Norte
  { slug: "manaus", name: "Manaus", state: "AM", emoji: "🌳", isCapital: true },
  { slug: "belem", name: "Belém", state: "PA", emoji: "🐟", isCapital: true },
  { slug: "porto-velho", name: "Porto Velho", state: "RO", emoji: "🛶", isCapital: true },
];

export const CAPITALS = CITIES.filter((c) => c.isCapital);

export type StateGroup = { state: string; cities: City[] };

export const CITIES_BY_STATE: StateGroup[] = Object.values(
  CITIES.reduce<Record<string, StateGroup>>((acc, c) => {
    if (!acc[c.state]) acc[c.state] = { state: c.state, cities: [] };
    acc[c.state].cities.push(c);
    return acc;
  }, {})
).sort((a, b) => a.state.localeCompare(b.state));

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
