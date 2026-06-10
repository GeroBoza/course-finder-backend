import { ApiProperty } from '@nestjs/swagger';

export class ViewCountResponseDto {
    @ApiProperty({ example: 42 })
    viewCount: number;
}
