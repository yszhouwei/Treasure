import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST') || '47.97.106.181',
  port: configService.get('DB_PORT') || 3306,
  username: configService.get('DB_USERNAME') || 'treasurex',
  password: configService.get('DB_PASSWORD') || 'R5ZFBkyWF5JNdWFa',
  database: configService.get('DB_DATABASE') || 'treasurex',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  charset: 'utf8mb4',
  timezone: '+08:00',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

