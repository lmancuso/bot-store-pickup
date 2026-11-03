"use client";

import dynamic from "next/dynamic";
import type { StoreMapProps } from "./StoreMap";

export const StoreMapDynamic = dynamic(() => import("./StoreMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm text-zinc-500"
      role="status"
    >
      Cargando mapa…
    </div>
  ),
});

export type { StoreMapProps };
