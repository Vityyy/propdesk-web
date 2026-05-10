// PropertySkeleton.tsx
import * as React from "react";

// A small generic Skeleton block used across the UI. Sidebar expects a
// `Skeleton` named export, so we provide a simple div that accepts the
// usual div props (className, style, data- attributes) and applies a
// pulsing background by default.
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  const base = "bg-[rgba(255,255,255,0.06)] animate-pulse";
  return <div className={`${base} ${className ?? ""}`} {...props} />;
}

export function PropertySkeleton() {
  return (
    // El borde y fondo imitan tu tarjeta actual
    <div className="w-full rounded-xl border border-[rgba(255,255,255,0.16)] bg-black overflow-hidden flex flex-col h-[300px] animate-pulse">
      {/* Área de la imagen (mitad superior) */}
      <div className="h-1/2 w-full bg-[rgba(255,255,255,0.05)]"></div>

      {/* Área de la información (mitad inferior) */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-3">
          {/* Título de la propiedad */}
          <div className="h-5 w-3/4 bg-[rgba(255,255,255,0.1)] rounded"></div>
          {/* Calle/Dirección */}
          <div className="h-3 w-1/2 bg-[rgba(255,255,255,0.05)] rounded"></div>
        </div>

        <div className="mt-4">
          {/* Etiqueta "Monthly Revenue" */}
          <div className="h-2 w-1/3 bg-[rgba(255,255,255,0.05)] rounded mb-2"></div>
          {/* Precio */}
          <div className="h-6 w-1/4 bg-[rgba(255,255,255,0.1)] rounded"></div>
        </div>
      </div>
    </div>
  );
}