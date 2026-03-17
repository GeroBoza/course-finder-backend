import { Injectable } from '@nestjs/common';
import { IFileParser, ParsedCourseRow } from './file-parser.interface';

/**
 * Stub parser for .docx files — not yet implemented.
 * Add the implementation here when .docx support is required.
 * Install 'mammoth' and parse the table structure from the HTML output.
 */
@Injectable()
export class DocxParserService implements IFileParser {
    canHandle(mimetype: string, extension: string): boolean {
        return (
            mimetype ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            extension === '.docx'
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async parse(_buffer: Buffer): Promise<ParsedCourseRow[]> {
        throw new Error(
            'El soporte para archivos .docx aún no está implementado. Usá el formato .xlsx.',
        );
    }
}
