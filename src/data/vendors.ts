import type { Category, Vendor } from "./types";

/** Obelisco, CABA — punto de referencia del MVP */
export const DEFAULT_USER_LOCATION = {
  lat: -34.6037,
  lng: -58.3816,
  label: "Obelisco, CABA",
} as const;

/**
 * 5 categorías × 3 vendedores ficticios cerca del Obelisco.
 * Nombres inventados en español rioplatense, sin marcas reales.
 */
export const vendors: Vendor[] = [
  // —— Pizza ——
  {
    id: "pizza-don-tomas",
    name: "Don Tomás",
    category: "pizza",
    lat: -34.6021,
    lng: -58.3798,
    address: "Av. Corrientes 1245, CABA",
    hours: "Lun–Dom 12:00–23:30",
    isOpen: true,
    menu: [
      {
        id: "pizza-don-tomas-muzzarella",
        name: "Muzzarella clásica",
        description: "Salsa de tomate, muzzarella y orégano",
        priceArs: 9800,
      },
      {
        id: "pizza-don-tomas-napolitana",
        name: "Napolitana",
        description: "Muzzarella, tomate fresco y ajo",
        priceArs: 11200,
      },
      {
        id: "pizza-don-tomas-fugazzetta",
        name: "Fugazzetta",
        description: "Cebolla, muzzarella y aceitunas",
        priceArs: 12500,
      },
    ],
  },
  {
    id: "pizza-nona-palermo",
    name: "La Nona de Palermo",
    category: "pizza",
    lat: -34.5895,
    lng: -58.3972,
    address: "Honduras 4820, Palermo",
    hours: "Mar–Dom 13:00–00:00",
    isOpen: true,
    menu: [
      {
        id: "pizza-nona-cuatro",
        name: "Cuatro quesos",
        description: "Muzzarella, provolone, roquefort y parmesano",
        priceArs: 13800,
      },
      {
        id: "pizza-nona-calabresa",
        name: "Calabresa",
        description: "Muzzarella y longaniza ahumada",
        priceArs: 12900,
      },
      {
        id: "pizza-nona-rucula",
        name: "Rúcula y jamón crudo",
        description: "Base blanca, rúcula y crudo",
        priceArs: 14900,
      },
    ],
  },
  {
    id: "pizza-hornito-sur",
    name: "Hornito Sur",
    category: "pizza",
    lat: -34.6188,
    lng: -58.3735,
    address: "Estados Unidos 820, San Telmo",
    hours: "Jue–Dom 18:00–01:00",
    isOpen: false,
    menu: [
      {
        id: "pizza-hornito-media",
        name: "Media masa a la piedra",
        description: "Muzzarella y salsa casera",
        priceArs: 8900,
      },
      {
        id: "pizza-hornito-provolone",
        name: "Provolone al horno",
        description: "Provolone, morrón y orégano",
        priceArs: 11800,
      },
      {
        id: "pizza-hornito-anana",
        name: "Ananá y jamón",
        description: "Muzzarella, jamón cocido y ananá",
        priceArs: 12100,
      },
    ],
  },

  // —— Empanadas ——
  {
    id: "emp-centro",
    name: "Empanadas del Centro",
    category: "empanadas",
    lat: -34.6049,
    lng: -58.3828,
    address: "Lavalle 980, Microcentro",
    hours: "Lun–Vie 11:00–21:00",
    isOpen: true,
    menu: [
      {
        id: "emp-centro-carne",
        name: "Carne suave",
        description: "Carne cortada a cuchillo, huevo y aceituna",
        priceArs: 2200,
      },
      {
        id: "emp-centro-jyq",
        name: "Jamón y queso",
        description: "Jamón cocido y muzzarella",
        priceArs: 2100,
      },
      {
        id: "emp-centro-humita",
        name: "Humita",
        description: "Choclo cremoso y queso",
        priceArs: 2300,
      },
    ],
  },
  {
    id: "emp-casa-criolla",
    name: "Casa Criolla",
    category: "empanadas",
    lat: -34.5998,
    lng: -58.3921,
    address: "Callao 650, Recoleta",
    hours: "Lun–Sáb 12:00–22:30",
    isOpen: true,
    menu: [
      {
        id: "emp-criolla-saltena",
        name: "Salteña picante",
        description: "Carne, papa, huevo y ají",
        priceArs: 2400,
      },
      {
        id: "emp-criolla-capresse",
        name: "Capresse",
        description: "Tomate, albahaca y muzzarella",
        priceArs: 2200,
      },
      {
        id: "emp-criolla-pollo",
        name: "Pollo al verdeo",
        description: "Pollo, cebolla de verdeo y queso",
        priceArs: 2300,
      },
    ],
  },
  {
    id: "emp-rincon-salteno",
    name: "El Rincón Salteño",
    category: "empanadas",
    lat: -34.6102,
    lng: -58.3884,
    address: "Belgrano 1350, Monserrat",
    hours: "Mar–Dom 12:00–23:00",
    isOpen: true,
    menu: [
      {
        id: "emp-rincon-carne-cuchillo",
        name: "Carne a cuchillo",
        description: "Receta salteña clásica",
        priceArs: 2500,
      },
      {
        id: "emp-rincon-queso-cebolla",
        name: "Queso y cebolla",
        description: "Muzzarella y cebolla caramelizada",
        priceArs: 2200,
      },
      {
        id: "emp-rincon-verdura",
        name: "Verdura",
        description: "Acelga, ricota y nuez moscada",
        priceArs: 2100,
      },
    ],
  },

  // —— Hamburguesas ——
  {
    id: "bur-smash-bajo",
    name: "Smash del Bajo",
    category: "hamburguesas",
    lat: -34.6012,
    lng: -58.3705,
    address: "Reconquista 450, Retiro",
    hours: "Lun–Dom 12:00–00:30",
    isOpen: true,
    menu: [
      {
        id: "bur-smash-simple",
        name: "Smash simple",
        description: "Doble smash, cheddar y salsa de la casa",
        priceArs: 11500,
      },
      {
        id: "bur-smash-bacon",
        name: "Smash con panceta",
        description: "Smash, cheddar, panceta crocante",
        priceArs: 13200,
      },
      {
        id: "bur-smash-papas",
        name: "Papas fritas",
        description: "Porción generosa con sal de mar",
        priceArs: 4800,
      },
    ],
  },
  {
    id: "bur-parrilla-urbana",
    name: "La Parrilla Urbana",
    category: "hamburguesas",
    lat: -34.6075,
    lng: -58.3958,
    address: "Av. Córdoba 2100, Balvanera",
    hours: "Mié–Dom 19:00–01:00",
    isOpen: true,
    menu: [
      {
        id: "bur-parrilla-clasica",
        name: "Clásica a la parrilla",
        description: "Medallón 180 g, lechuga, tomate y cheddar",
        priceArs: 12800,
      },
      {
        id: "bur-parrilla-blue",
        name: "Blue cheese",
        description: "Medallón, roquefort y cebolla morada",
        priceArs: 14100,
      },
      {
        id: "bur-parrilla-veggie",
        name: "Medallón de lentejas",
        description: "Lentejas, avena y aderezo tahini",
        priceArs: 11900,
      },
    ],
  },
  {
    id: "bur-barrio-norte",
    name: "Burger Barrio Norte",
    category: "hamburguesas",
    lat: -34.5955,
    lng: -58.3988,
    address: "Santa Fe 2680, Barrio Norte",
    hours: "Lun–Sáb 12:30–23:00",
    isOpen: false,
    menu: [
      {
        id: "bur-bn-doble",
        name: "Doble cheddar",
        description: "Dos medallones y cheddar derretido",
        priceArs: 13500,
      },
      {
        id: "bur-bn-pollo",
        name: "Pollo crocante",
        description: "Pechuga empanada, coleslaw y mayo",
        priceArs: 12200,
      },
      {
        id: "bur-bn-aros",
        name: "Aros de cebolla",
        description: "Porción para compartir",
        priceArs: 5200,
      },
    ],
  },

  // —— Sushi ——
  {
    id: "sushi-nikko",
    name: "Nikko CABA",
    category: "sushi",
    lat: -34.5989,
    lng: -58.3812,
    address: "Paraguay 1120, Retiro",
    hours: "Mar–Dom 12:00–23:00",
    isOpen: true,
    menu: [
      {
        id: "sushi-nikko-salmon",
        name: "Roll de salmón (8 u.)",
        description: "Salmón, palta y phila",
        priceArs: 9800,
      },
      {
        id: "sushi-nikko-combo",
        name: "Combo New York",
        description: "12 piezas mixtas",
        priceArs: 14500,
      },
      {
        id: "sushi-nikko-gyozas",
        name: "Gyozas de cerdo (6 u.)",
        description: "Al vapor con salsa de soja",
        priceArs: 7200,
      },
    ],
  },
  {
    id: "sushi-sakura",
    name: "Sakura Puerto",
    category: "sushi",
    lat: -34.6118,
    lng: -58.3642,
    address: "Alicia Moreau de Justo 470, Puerto Madero",
    hours: "Lun–Dom 12:30–00:00",
    isOpen: true,
    menu: [
      {
        id: "sushi-sakura-dragon",
        name: "Dragon roll",
        description: "Langostino, palta y unagi sauce",
        priceArs: 12800,
      },
      {
        id: "sushi-sakura-nigiri",
        name: "Nigiri mix (6 u.)",
        description: "Salmón, atún y pez manteca",
        priceArs: 11000,
      },
      {
        id: "sushi-sakura-edamame",
        name: "Edamame",
        description: "Con sal marina",
        priceArs: 4500,
      },
    ],
  },
  {
    id: "sushi-arroz-mar",
    name: "Arroz y Mar",
    category: "sushi",
    lat: -34.6068,
    lng: -58.4035,
    address: "Av. Rivadavia 2450, Balvanera",
    hours: "Mié–Dom 19:00–23:30",
    isOpen: true,
    menu: [
      {
        id: "sushi-arroz-veggie",
        name: "Roll vegetariano",
        description: "Pepino, zanahoria y palta",
        priceArs: 7800,
      },
      {
        id: "sushi-arroz-hot",
        name: "Hot philadelphia",
        description: "Roll rebozado con phila y salmón",
        priceArs: 10500,
      },
      {
        id: "sushi-arroz-sopa",
        name: "Sopa miso",
        description: "Con tofu y verdeo",
        priceArs: 3900,
      },
    ],
  },

  // —— Helado ——
  {
    id: "hel-obelisco",
    name: "Heladería del Obelisco",
    category: "helado",
    lat: -34.6032,
    lng: -58.3801,
    address: "Av. 9 de Julio 1000, CABA",
    hours: "Lun–Dom 11:00–23:00",
    isOpen: true,
    menu: [
      {
        id: "hel-obelisco-1kg",
        name: "Kilo mixto (4 gustos)",
        description: "Elegí hasta 4 sabores de la carta",
        priceArs: 9800,
      },
      {
        id: "hel-obelisco-cucurucho",
        name: "Cucurucho doble",
        description: "Dos bochas a elección",
        priceArs: 4200,
      },
      {
        id: "hel-obelisco-vaso",
        name: "Vaso 1/4 kg",
        description: "Hasta 2 gustos",
        priceArs: 5500,
      },
    ],
  },
  {
    id: "hel-dulce-posta",
    name: "Dulce Posta",
    category: "helado",
    lat: -34.5918,
    lng: -58.3855,
    address: "Arenales 890, Retiro",
    hours: "Mar–Dom 12:00–22:00",
    isOpen: true,
    menu: [
      {
        id: "hel-posta-ddl",
        name: "Dulce de leche granizado",
        description: "1/4 kg o cucurucho",
        priceArs: 5800,
      },
      {
        id: "hel-posta-frutilla",
        name: "Frutilla a la crema",
        description: "Temporada, 1/4 kg",
        priceArs: 5600,
      },
      {
        id: "hel-posta-sambayon",
        name: "Sambayón al Marsala",
        description: "1/4 kg",
        priceArs: 6200,
      },
    ],
  },
  {
    id: "hel-frio-porteno",
    name: "Frío Porteño",
    category: "helado",
    lat: -34.6155,
    lng: -58.3789,
    address: "Chile 560, San Telmo",
    hours: "Jue–Dom 14:00–23:00",
    isOpen: false,
    menu: [
      {
        id: "hel-frio-chocolate",
        name: "Chocolate amargo",
        description: "70% cacao, 1/4 kg",
        priceArs: 5900,
      },
      {
        id: "hel-frio-limon",
        name: "Limón al natural",
        description: "Sorbete, 1/4 kg",
        priceArs: 5200,
      },
      {
        id: "hel-frio-combo",
        name: "Combo familiar 1 kg",
        description: "Hasta 4 gustos + cucharitas",
        priceArs: 10500,
      },
    ],
  },
];

export function vendorsByCategory(category: Category): Vendor[] {
  return vendors.filter((v) => v.category === category);
}

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}
