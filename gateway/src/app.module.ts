import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PROTO_FOLDER_PATH } from 'nestjs-grpc-demo-common-lib/dist/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Microservice,
  ProtoPackage,
} from 'nestjs-grpc-demo-common-lib/dist/enums';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentVariables, validate } from './environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: Microservice.AUTHENTICATION,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService<EnvironmentVariables>) => {
            return {
              transport: Transport.GRPC,
              options: {
                url: config.get('MS_AUTHENTICATION_URL'),
                package: ProtoPackage.AUTHENTICATION,
                protoPath: join(PROTO_FOLDER_PATH, 'authentication.proto'),
              },
            };
          },
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
