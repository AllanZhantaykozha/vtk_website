import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';
import { TeacherCreateDto } from './dto/teacher.dto';
import { Teacher } from '@prisma/client';
import { RefreshToken } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  // Создание админа

  async createAdmin() {
    const adminIsExists = await this.prisma.admin.findMany();

    const hashPassword = await hash(this.configService.get('ADMIN_PASSWORD'));

    if (adminIsExists) return;

    const admin = await this.prisma.admin.create({
      data: {
        login: this.configService.get('ADMIN_LOGIN'),
        password: hashPassword,
      },
    });

    const tokens = await this.issueTokens(admin.id);

    return {
      ...tokens,
    };
  }

  // Создание учителя

  async createTeacher(dto: TeacherCreateDto) {
    const isExist = await this.prisma.teacher.findUnique({
      where: { fullName: dto.fullName },
    });

    if (isExist) throw new BadRequestException('This teacher already exist');

    const teacher = await this.prisma.teacher.create({
      data: { ...dto, password: await hash(dto.password) },
    });

    const tokens = await this.issueTokens(teacher.id);

    return [teacher.fullName, { ...tokens }];
  }

  // Вход в профиль админа

  async loginAdmin(dto: AuthDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { login: dto.login },
    });

    if (!admin) throw new UnauthorizedException('Invalid login or password');

    const isValid = await verify(admin.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Invalid login or password');

    const tokens = await this.issueTokens(admin.id);

    return {
      ...tokens,
    };
  }

  // Вход в профиль учителя

  async loginTeacher(dto: TeacherCreateDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { fullName: dto.fullName },
    });

    if (!teacher) throw new UnauthorizedException('Invalid login or password');

    const isValidPassword = await verify(teacher.password, dto.password);

    if (!isValidPassword)
      throw new UnauthorizedException('Invalid login or password');

    const tokens = await this.issueTokens(teacher.id);

    return [{...teacher}, {...tokens}];
  }

  // Получение новых токенов

  async getNewTokens(refreshToken: RefreshToken) {
    const result = await this.jwt.verifyAsync(refreshToken.refreshToken)

    if(!result) throw new UnauthorizedException('Token is not valid')

    const teacher = await this.prisma.teacher.findUnique({where: {id: result.id}})

    const tokens = await this.issueTokens(teacher.id)

    return [{...teacher}, {...tokens}];
  }

  // Функция для создание токенов

  private async issueTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
