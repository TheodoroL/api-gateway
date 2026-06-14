import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: { email: string; password: string }) {
    return await this.authService.login(loginDto);
  }
  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async register(
    @Body()
    registerDto: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
    },
  ) {
    return await this.authService.register(registerDto);
  }
}
