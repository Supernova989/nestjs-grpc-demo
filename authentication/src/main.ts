import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProtoPackage } from 'nestjs-grpc-demo-common-lib/dist/enums';
import { PROTO_FOLDER_PATH } from 'nestjs-grpc-demo-common-lib/dist/constants';
import { AuthenticationModule } from './authentication.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:3001',
        package: ProtoPackage.AUTHENTICATION,
        protoPath: join(PROTO_FOLDER_PATH, 'authentication.proto'),
      },
    },
  );

  await app.listen();
}

bootstrap();
