export class ImportRowErrorDto {
    fila: number;
    motivo: string;
}

export class ImportResultDto {
    importados: number;
    omitidos: number;
    errores: ImportRowErrorDto[];
}
