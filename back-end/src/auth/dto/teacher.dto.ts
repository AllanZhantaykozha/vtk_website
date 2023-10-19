import { IsOptional, IsString } from "class-validator";

export class TeacherCreateDto {
    @IsString()
    fullName: string
    
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    group?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    profilePhoto?: string

    @IsOptional()
    @IsString()
    cellNumber?: string[]

    @IsOptional()
    @IsString()
    jobName?: string
}