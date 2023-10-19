import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthService } from 'src/auth/auth.service';
import { TeacherCreateDto } from 'src/auth/dto/teacher.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IsAdmin } from 'src/auth/decorators/admin.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService, private readonly authService: AuthService) {}

  @Auth()
  @UsePipes(new ValidationPipe())
  @Post('create-teacher')
  @HttpCode(200)
  async createTeacher(@IsAdmin() @Body() dto: TeacherCreateDto) {
    return this.authService.createTeacher(dto)
  }
}
