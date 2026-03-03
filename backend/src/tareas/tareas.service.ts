import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTareaDto } from './dto/create-tarea.dto';

@Injectable()
export class TareasService {
  constructor(private prisma: PrismaService) {}

  async crearTarea(data: CreateTareaDto) {
    return this.prisma.tarea.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fechaEntrega: data.fechaEntrega,
        estado: data.estado,
      },
    });
  }
}