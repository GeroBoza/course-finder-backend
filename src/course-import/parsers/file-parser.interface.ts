export interface ParsedCourseRow {
    name: string;
    description?: string;
    organization: string;
    enrollmentUrl: string;
    academicYear?: string;
    startDate?: string;
    endDate?: string;
    categories?: string;
    active?: string;
}

export interface IFileParser {
    /** Returns true if this parser can handle the given file mime type or extension */
    canHandle(mimetype: string, extension: string): boolean;
    /** Parses the file buffer and returns the extracted course rows */
    parse(buffer: Buffer): Promise<ParsedCourseRow[]>;
}
