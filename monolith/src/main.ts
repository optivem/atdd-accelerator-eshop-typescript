import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './api/filters';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
  
  // Apply global exception filter
  app.useGlobalFilters(new ValidationExceptionFilter());
  
  const port = parseInt(process.env.PORT || '8080', 10);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

// some comment