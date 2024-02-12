import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  Microservice,
  ProtoPackage,
} from 'nestjs-grpc-demo-common-lib/dist/enums';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
                protoPath: join(
                  __dirname,
                  '..',
                  'node_modules',
                  'nestjs-grpc-demo-common-lib',
                  'proto',
                  'authentication.proto',
                ),
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
