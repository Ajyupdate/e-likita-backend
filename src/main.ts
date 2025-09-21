import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(compression());
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('e-Likita API')
    .setDescription('API documentation for the e-Likita medical consultation platform')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Get port from environment (Render sets this automatically)
  const port = process.env.PORT ?? 3000;
  
  // CRITICAL FIX: Bind to 0.0.0.0 instead of localhost
  // This allows external connections from Render's load balancer
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 e-Likita API is running on port ${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/docs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch(err => {
  console.error('❌ Error starting the application:', err);
  process.exit(1);
});