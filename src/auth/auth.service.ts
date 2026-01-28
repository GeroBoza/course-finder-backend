import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    // Estructura base para autenticación
    // Se implementará JWT más adelante
    async validateUser(email: string, password: string): Promise<any> {
        // Placeholder para implementación futura
        return null;
    }
}
