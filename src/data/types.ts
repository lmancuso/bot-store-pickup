export type Category =
  | "pizza"
  | "empanadas"
  | "hamburguesas"
  | "sushi"
  | "helado";

export const CATEGORIES: readonly Category[] = [
  "pizza",
  "empanadas",
  "hamburguesas",
  "sushi",
  "helado",
] as const;

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceArs: number;
};

export type Vendor = {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  address: string;
  /** Horario legible para mostrar en el chat / confirmación */
  hours: string;
  /** Si el local está abierto ahora (mock) */
  isOpen: boolean;
  menu: MenuItem[];
};
