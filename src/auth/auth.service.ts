import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(
        email: string,
        password: string,
    ): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);

        if (!user || !user.isActive) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    login(user: User): AuthResponseDto {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role.name,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
                isActive: user.isActive,
            },
        };
    }

    toAuthUser(user: User) {
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role.name,
            isActive: user.isActive,
        };
    }
}
