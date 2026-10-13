/**
 * Agrega la columna `is_featured` a `courses` para marcar cursos destacados
 * que se muestran en el carousel del home.
 *
 * Correr ANTES de deployar el código: la entidad Course declara `isFeatured`.
 *
 * Uso: mysql -u <usuario> -p <base> < scripts/add-is-featured-to-courses.sql
 */

SHOW COLUMNS FROM courses LIKE 'is_featured';

ALTER TABLE courses
    ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 AFTER is_active;
