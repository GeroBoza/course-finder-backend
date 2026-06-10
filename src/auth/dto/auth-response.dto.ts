import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    isActive: boolean;
}

export class AuthResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty({ type: AuthUserDto })
    user: AuthUserDto;
}
