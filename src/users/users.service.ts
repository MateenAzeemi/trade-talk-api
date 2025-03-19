import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from './users.entity';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly mailerService: MailerService,
    ) { }

    async createUser(email: string, password: string): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiration time (5 minutes from now)
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);

        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
            verificationCode,
            verificationCodeExpiresAt: expirationTime,
        });

        await this.usersRepository.save(user);
        await this.mailerService.sendVerificationEmail(email, verificationCode);

        return user;
    }

    async sendVerificationCode(email: string): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);

        user.verificationCode = verificationCode;
        user.verificationCodeExpiresAt = expirationTime;
        await this.usersRepository.save(user);

        await this.mailerService.sendVerificationEmail(email, verificationCode);
    }

    async verifyUser(email: string, verificationCode: string): Promise<string> {
        if (!verificationCode) {
            throw new BadRequestException('Verification code is required');
        }

        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user || user.verificationCode !== verificationCode) {
            throw new BadRequestException('Invalid verification code');
        }

        if (!user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
            throw new BadRequestException('Verification code expired');
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpiresAt = null;
        await this.usersRepository.save(user);

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, 'eyJhbGciOiJIUzI1NiIsInR5cCKJKJDkpXVCJ9.eyJzdWIiOiIxODgxNzJCViwibmFtZSI6IkFiZHVsIE11cWVldCIsImlhdCI6NDI1MDF9.HU18UOWWa12-CUR8AGxGJmsGi0zw-9PIUDSpXUYLLctes', { expiresIn: '1h' });

        return token;
    }

    async login(email: string, password: string): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.sendVerificationCode(email);
    }
}
