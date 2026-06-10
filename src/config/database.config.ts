import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function parsePort(value: string): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        throw new Error('DB_PORT debe ser un número válido');
    }
    return parsed;
}

export const getDatabaseConfig = (
    configService: ConfigService,
): TypeOrmModuleOptions => {
    const isProduction = configService.get<string>('NODE_ENV') === 'production';

    return {
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: parsePort(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: !isProduction,
        autoLoadEntities: true,
    };
};
