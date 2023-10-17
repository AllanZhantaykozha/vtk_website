import { Module } from '@nestjs/common';
import { TeachersModule } from './teachers/teachers.module';
import { PrismaService } from './prisma.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './config/jwt.strategy';

@Module({
  imports: [ConfigModule.forRoot(),TeachersModule, AdminModule, AuthModule],
  controllers: [],
  providers: [PrismaService, JwtStrategy],
})
export class AppModule {}
