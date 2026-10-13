/**
 * Tabla clave-valor para settings del admin (prompt de importación, etc.).
 *
 * Uso: mysql -u <usuario> -p <base> < scripts/create-settings-table.sql
 */

CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(100) NOT NULL,
    `value` TEXT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
