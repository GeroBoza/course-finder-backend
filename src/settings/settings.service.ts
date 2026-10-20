import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

export const CHATGPT_IMPORT_PROMPT_KEY = 'chatgpt_import_prompt';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Setting)
        private readonly settingsRepository: Repository<Setting>,
    ) {}

    async getChatgptImportPrompt(): Promise<{
        prompt: string | null;
        isDefault: boolean;
    }> {
        const setting = await this.settingsRepository.findOne({
            where: { key: CHATGPT_IMPORT_PROMPT_KEY },
        });

        if (!setting) {
            return { prompt: null, isDefault: true };
        }

        return { prompt: setting.value, isDefault: false };
    }

    async updateChatgptImportPrompt(prompt: string): Promise<{
        prompt: string;
        isDefault: boolean;
    }> {
        await this.settingsRepository.save({
            key: CHATGPT_IMPORT_PROMPT_KEY,
            value: prompt,
        });

        return { prompt, isDefault: false };
    }

    async resetChatgptImportPrompt(): Promise<{
        prompt: string | null;
        isDefault: boolean;
    }> {
        await this.settingsRepository.delete({ key: CHATGPT_IMPORT_PROMPT_KEY });
        return { prompt: null, isDefault: true };
    }
}
