import { NestFactory } from '@nestjs/core';
import { AppModule } from "../app.module";
import { FixturesService } from "./fixtures.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fixturesService = app.get(FixturesService);

  try {
    await fixturesService.run();
    console.log('Fixtures loaded successfully.');
  } catch (error) {
    console.error('Error while loading fixtures:', error);
  } finally {
    await app.close();
  }
}

bootstrap().catch(console.error);
