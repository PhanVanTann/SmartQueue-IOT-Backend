import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const frontendOrigin = configService.get<string>('FRONTEND_ORIGIN', 'http://localhost:5173');

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      const allowed = frontendOrigin.split(/[,\s]+/).filter(Boolean);
      if (allowed.includes('*') || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked for origin: ' + origin));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    maxAge: 600,
  });

  await app.listen(port);
  console.log(`Application is running on: http://127.0.0.1:${port}`);
  console.log(`Allowed CORS origins: ${frontendOrigin}`);
}
bootstrap();
