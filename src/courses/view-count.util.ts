/** Piso inicial de visualizaciones para que el catálogo no se vea vacío. */
export function randomInitialViewCount(): number {
    return 20 + Math.floor(Math.random() * 131);
}
