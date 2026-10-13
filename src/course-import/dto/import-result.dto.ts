export class ImportRowErrorDto {
    fila: number;
    motivo: string;
}

export class MissingOrganizationDto {
    nombre: string;
    filas: number[];
    cursos: string[];
}

export class ImportResultDto {
    importados: number;
    omitidos: number;
    errores: ImportRowErrorDto[];
    organizacionesFaltantes: MissingOrganizationDto[];
    organizacionesCreadas: number;
}
