import { IsOptional, IsString } from "class-validator";

export class ProfileUpdateDto {
    @IsOptional()
    @IsString()
    fullName: string
    
    @IsOptional()
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
    photos?: string[]

    @IsOptional()
    @IsString()
    cellNumber?: string[]

    @IsOptional()
    @IsString()
    jobName?: string
}