import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { MailerService } from './mailer/mailer.service';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'tradetalk',
      entities: [User],
      synchronize: true, 
    }),
    UsersModule,
    AuthModule,
    CalendarModule,
  ],
  providers: [MailerService],
})
export class AppModule {}
