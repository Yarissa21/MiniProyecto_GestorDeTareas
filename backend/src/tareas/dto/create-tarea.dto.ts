import { IsString, IsDateString, IsEnum } from 'class-validator';
import { Estado } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTareaDto {
  @ApiProperty({ example: 'Preparar presentación' })
  @IsString()
  titulo: string;

  @ApiProperty({ example: 'Diapositivas para la reunión del lunes', required: false })
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: '2026-04-01T12:00:00.000Z' })
  @IsDateString()
  fechaEntrega: Date;

  @ApiProperty({ enum: Estado, example: Estado.PENDIENTE })
  @IsEnum(Estado)
  estado: Estado;

  @ApiProperty({ example: true })
  estadoActivo?: boolean;
}