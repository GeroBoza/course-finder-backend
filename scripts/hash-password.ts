/**
 * Utilidad para generar un hash bcrypt de una contraseña.
 * Uso: npx ts-node scripts/hash-password.ts miPassword
 */
import * as bcrypt from 'bcrypt';

const password = process.argv[2];

if (!password) {
    console.error('Uso: npx ts-node scripts/hash-password.ts <password>');
    process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
    console.log(hash);
});
