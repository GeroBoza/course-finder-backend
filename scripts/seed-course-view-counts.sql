/**
 * Asigna un número inicial aleatorio de visualizaciones (20–150) a los cursos
 * que todavía tienen view_count = 0, para que el sitio no se vea vacío.
 *
 * Las visitas reales siguen incrementando desde este piso.
 *
 * Uso: mysql -u <usuario> -p <base> < scripts/seed-course-view-counts.sql
 */

UPDATE courses
SET view_count = 20 + FLOOR(RAND() * 131)
WHERE view_count = 0;
