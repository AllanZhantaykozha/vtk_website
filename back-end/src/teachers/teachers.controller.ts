import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async getAll() {
    return this.teachersService.findAll()
  }
}
