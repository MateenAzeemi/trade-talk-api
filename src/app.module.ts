import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { MailerService } from './mailer/mailer.service';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env variables
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL, // Use Railway's DB URL
      entities: [User],
      synchronize: true, // Set to false in production
    }),
    UsersModule,
    AuthModule,
    CalendarModule,
  ],
  providers: [MailerService],
})
export class AppModule {}
