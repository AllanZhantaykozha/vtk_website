import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private configService: ConfigService) {}

    async createAdmin() {
        const adminIsExists = await this.prisma.admin.findMany()

        const hashPassword = await hash(this.configService.get("PASSWORD_PASSPORT"))

        console.log(this.configService.get("PASSWORD_PASSPORT"));
        

        if (!adminIsExists) {
            const admin = await this.prisma.admin.create({
                data: {
                    login: this.configService.get("ADMIN_LOGIN"),
                    password: hashPassword
                }
            })

            const tokens = await this.issueTokens(admin.id)

            return {
                ...tokens
            }
        }
    }

    async loginAdmin(dto: AuthDto) {
        const login = this.configService.get("ADMIN_LOGIN")

        const admin = await this.prisma.admin.findUnique({
            where: { login: dto.login }
        })

        const isValid = await verify(admin.password, dto.password)

        if (!isValid) throw new UnauthorizedException('Invalid login or password')

        const tokens = await this.issueTokens(admin.id)

        return {
            ...tokens
        }
    }

    // async login() {}

    private async issueTokens(adminId: number) {
        const data = { id: adminId }

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        })

        return { accessToken, refreshToken }
    }
}
