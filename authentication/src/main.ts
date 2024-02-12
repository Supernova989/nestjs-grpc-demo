import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';
import { join } from 'path';
import { ProtoPackage } from 'nestjs-grpc-demo-common-lib/dist/enums';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ProtoPackage.AUTHENTICATION,
        protoPath: join(
          __dirname,
          '..',
          'node_modules',
          'nestjs-grpc-demo-common-lib',
          'proto',
          'authentication.proto',
        ),
      },
    },
  );

  await app.listen();
}

bootstrap();
