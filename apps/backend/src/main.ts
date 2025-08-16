import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 3001;
  const host = configService.get('HOST') || 'localhost';

app.enableCors({
  origin: [ process.env.FRONTEND_URL ,'http://localhost:3000'],
  credentials: true,
});

  await app.listen(port,'0.0.0.0');
  console.log(`🚀 Server is running on http://0.0.0.0:${port}`);
}
bootstrap();

