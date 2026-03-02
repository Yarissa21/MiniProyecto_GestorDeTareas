import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Estado } from '@prisma/client';

export class CreateTareaDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fechaEntrega: Date;

  @IsEnum(Estado)
  estado: Estado;
}