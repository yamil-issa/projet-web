import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard'
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
