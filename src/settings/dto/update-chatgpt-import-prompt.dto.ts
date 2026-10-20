import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChatgptImportPromptDto {
    @ApiProperty({ description: 'Texto del prompt de investigación' })
    @IsString()
    @IsNotEmpty()
    prompt: string;
}
