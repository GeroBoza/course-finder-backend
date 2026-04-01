import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { IFileParser, ParsedCourseRow } from './file-parser.interface';

/**
 * Expected column headers in the Excel file (row 1).
 * Column names are normalized (trimmed + lowercased) before matching.
 *
 * Template columns:
 * | Nombre | Descripcion | Organizacion | URL Inscripcion | Anio Academico | Fecha Inicio | Fecha Fin | Categorias | Activo |
 */
const COLUMN_MAP: Record<string, keyof ParsedCourseRow> = {
    nombre: 'nombre',
    descripcion: 'descripcion',
    descripción: 'descripcion',
    organizacion: 'organizacion',
    organización: 'organizacion',
    'url inscripcion': 'urlInscripcion',
    'url inscripción': 'urlInscripcion',
    urlinscripcion: 'urlInscripcion',
    'anio academico': 'anioAcademico',
    'año academico': 'anioAcademico',
    'año académico': 'anioAcademico',
    anioacademico: 'anioAcademico',
    'fecha inicio': 'fechaInicio',
    fechainicio: 'fechaInicio',
    'fecha fin': 'fechaFin',
    fechafin: 'fechaFin',
    categorias: 'categorias',
    categorías: 'categorias',
    activo: 'activo',
};

@Injectable()
export class XlsxParserService implements IFileParser {
    canHandle(mimetype: string, extension: string): boolean {
        return (
            mimetype ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            mimetype === 'application/vnd.ms-excel' ||
            extension === '.xlsx' ||
            extension === '.xls'
        );
    }

    async parse(buffer: Buffer): Promise<ParsedCourseRow[]> {
        const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to array of arrays to have full control over headers
        const rawRows: string[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
        });

        if (rawRows.length < 2) return [];

        // Map header row to field keys
        const headerRow = rawRows[0].map((h) =>
            String(h ?? '').trim().toLowerCase(),
        );
        const fieldKeys: (keyof ParsedCourseRow | null)[] = headerRow.map(
            (h) => COLUMN_MAP[h] ?? null,
        );

        const rows: ParsedCourseRow[] = [];

        for (let i = 1; i < rawRows.length; i++) {
            const rawRow = rawRows[i];

            // Skip completely empty rows
            const hasContent = rawRow.some((cell) => String(cell ?? '').trim() !== '');
            if (!hasContent) continue;

            const row: Partial<ParsedCourseRow> = {};
            fieldKeys.forEach((key, colIndex) => {
                if (!key) return;
                const value = rawRow[colIndex];
                row[key] = this.normalizeCell(value);
            });

            rows.push(row as ParsedCourseRow);
        }

        return rows;
    }

    private normalizeCell(value: unknown): string {
        if (value === null || value === undefined) return '';
        if (value instanceof Date) {
            // Format as DD/MM/YYYY
            const d = value.getDate().toString().padStart(2, '0');
            const m = (value.getMonth() + 1).toString().padStart(2, '0');
            const y = value.getFullYear();
            return `${d}/${m}/${y}`;
        }
        return String(value).trim();
    }
}
