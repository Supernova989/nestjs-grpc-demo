import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables>);
  const PORT = configService.get<number>('PORT');
  await app.listen(PORT, () => {
    console.log(`App gateway is running on port ${PORT}`);
  });
}
bootstrap();
