import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProfileUpdateDto } from './profileUpdate.dto';
import { hash } from 'argon2';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.teacher.findMany();
  }

  async profileUpdate(dto: ProfileUpdateDto, id: number) {
    const newPassword = await hash(dto.password);

    return this.prisma.teacher.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        description: dto.description,
        cellNumber: dto.cellNumber,
        group: dto.group,
        profilePhoto: dto.profilePhoto,
        photos: dto.photos,
        password: newPassword,
        jobName: dto.jobName
      },
    });
  }
}
