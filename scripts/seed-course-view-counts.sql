/**
 * Asigna un número inicial aleatorio de visualizaciones (40–180) a los cursos
 * que todavía tienen view_count = 0, para que el sitio no se vea vacío.
 *
 * Las visitas reales siguen incrementando desde este piso.
 *
 * Uso: mysql -u <usuario> -p <base> < scripts/seed-course-view-counts.sql
 */

UPDATE courses
SET view_count = 40 + FLOOR(RAND() * 141)
WHERE view_count = 0;
