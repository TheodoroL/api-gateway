/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { gatewayConfigService } from '../../config/gateway.config';

export interface UserSession {
  valid: boolean;
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    status: string;
  } | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  validateJwtToken(token: string): Promise<boolean> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateSessionToken(sessionToken: string): Promise<UserSession> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<UserSession>(
          `${gatewayConfigService.users.url}/sessions/validate/${sessionToken}`,
          {
            timeout: gatewayConfigService.users.timeout,
          },
        ),
      );
      return data;
    } catch {
      throw new UnauthorizedException('Invalid session token');
    }
  }
  async login(loginDto: { email: string; password: string }) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${gatewayConfigService.users.url}/auth/login`,
          loginDto,
          { timeout: gatewayConfigService.users.timeout },
        ),
      );

      return data;
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${gatewayConfigService.users.url}/auth/register`,
          registerDto,
          { timeout: gatewayConfigService.users.timeout },
        ),
      );

      return data;
    } catch {
      throw new UnauthorizedException('Failed to register');
    }
  }
}
