import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { User } from '../../users/user.entity';

const ADMIN_ROLES = ['superadmin', 'admin'];

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user as User;

        if (!user?.role?.name) {
            throw new ForbiddenException('No autenticado');
        }

        const roleName = user.role.name.toLowerCase();

        if (!ADMIN_ROLES.includes(roleName)) {
            throw new ForbiddenException(
                'Solo los administradores pueden realizar esta acción',
            );
        }

        return true;
    }
}
