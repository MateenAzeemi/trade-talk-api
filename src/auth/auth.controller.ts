import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Redirect User to Google Login
  @Get('google')
  @Redirect()
  async redirectToGoogle() {
    return { url: this.authService.getGoogleAuthURL() };
  }

  // Handle Google OAuth Callback
  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokens = await this.authService.getGoogleTokens(code);
      return res.json({ tokens });
    } catch (error) {
      return res.status(500).json({ message: 'Google Auth failed', error });
    }
  }
}
