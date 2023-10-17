import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TeachersService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.teacher.findMany()
    }
}
