import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

const ADMIN_ROLES = ['superadmin', 'admin'];

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    @ApiResponse({ status: 403, description: 'Sin permisos de administrador' })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const roleName = user.role.name.toLowerCase();

        if (!ADMIN_ROLES.includes(roleName)) {
            throw new ForbiddenException(
                'No tenés permisos para acceder al panel de administración',
            );
        }

        return this.authService.login(user);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener usuario autenticado desde el token' })
    @ApiResponse({
        status: 200,
        description: 'Usuario autenticado',
        type: AuthUserDto,
    })
    @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
    async me(@CurrentUser() user: User): Promise<AuthUserDto> {
        return this.authService.toAuthUser(user);
    }
}
