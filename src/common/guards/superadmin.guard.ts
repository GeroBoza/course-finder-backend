import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        // Simulación: verificar si el usuario es superadmin (ID = 1)
        // En una implementación real, esto vendría del token JWT o sesión
        const userId = request.user?.id || request.headers['x-user-id'];

        // Hardcoded: solo el usuario con ID = 1 es superadmin
        if (userId && parseInt(userId) === 1) {
            return true;
        }

        throw new ForbiddenException(
            'Solo los superadministradores pueden realizar esta acción',
        );
    }
}
