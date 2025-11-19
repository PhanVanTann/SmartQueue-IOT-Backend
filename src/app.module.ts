import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { ArduinoModule } from './arduino/arduino.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
      }),
    }),
    UserModule,
    AuthModule,
    QueueModule,
    ArduinoModule,
  ],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}