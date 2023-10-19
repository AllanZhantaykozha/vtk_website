import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CurrentTeacher } from 'src/auth/decorators/teacher.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProfileUpdateDto } from './profileUpdate.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @HttpCode(200)
  async getAll() {
    return this.teachersService.findAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('update')
  @Auth()
  async updateProfile(
    @Body() dto: ProfileUpdateDto,
    @CurrentTeacher('id') id: number,
  ) {
    return this.teachersService.profileUpdate(dto, id);
  }
}
