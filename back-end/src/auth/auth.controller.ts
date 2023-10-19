import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { TeacherCreateDto } from './dto/teacher.dto';
import { RefreshToken } from './dto/refreshToken.dto';
import { CurrentTeacher } from './decorators/teacher.decorator';
import { IsAdmin } from './decorators/admin.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/admin')
  async loginAdmin(@Body() dto: AuthDto) {
    return this.authService.loginAdmin(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/teacher')
  async loginTeacher(@Body() dto: TeacherCreateDto) {
    return this.authService.loginTeacher(dto)
  }

  @HttpCode(200)
  @Post('get-new-tokens')
  async getNewTokens(@Body() refreshToken: RefreshToken) {
    return this.authService.getNewTokens(refreshToken)
  }
}
 