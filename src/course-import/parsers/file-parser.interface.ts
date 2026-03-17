export interface ParsedCourseRow {
    nombre: string;
    descripcion?: string;
    organizacion: string;
    urlInscripcion: string;
    anioAcademico?: string;
    fechaInicio?: string;
    fechaFin?: string;
    categorias?: string;
    activo?: string;
}

export interface IFileParser {
    /** Returns true if this parser can handle the given file mime type or extension */
    canHandle(mimetype: string, extension: string): boolean;
    /** Parses the file buffer and returns the extracted course rows */
    parse(buffer: Buffer): Promise<ParsedCourseRow[]>;
}
