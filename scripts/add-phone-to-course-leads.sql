/**
 * Agrega la columna `phone` a `course_leads`, donde se guarda el teléfono
 * que la persona completa en el formulario de "Iniciar inscripción".
 *
 * Correr ANTES de deployar el código: la entidad CourseLead ya declara `phone`,
 * así que TypeORM la incluye en sus SELECT y las consultas a la tabla fallarían
 * si la columna todavía no existe.
 *
 * Uso: mysql -u <usuario> -p <base> < scripts/add-phone-to-course-leads.sql
 */

-- Verificar si ya fue aplicado (MySQL no soporta ADD COLUMN IF NOT EXISTS).
-- Si esto devuelve una fila, la columna ya existe y no hay nada que hacer.
SHOW COLUMNS FROM course_leads LIKE 'phone';

ALTER TABLE course_leads
    ADD COLUMN phone VARCHAR(30) NULL AFTER email;
