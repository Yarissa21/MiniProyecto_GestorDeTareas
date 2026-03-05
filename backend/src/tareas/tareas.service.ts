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

  async listarTareas() {
    const tareas = await this.prisma.tarea.findMany({
      orderBy: {
        fechaEntrega: 'asc',
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        fechaEntrega: true,
        estado: true,
      },
    });

    if (tareas.length === 0) {
      return { mensaje: 'No hay tareas registradas.' };
    }

    return tareas;
  }

 async actualizarTarea(id: number, data: CreateTareaDto) {
    return this.prisma.tarea.update({
      where: { id: id },
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fechaEntrega: data.fechaEntrega,
        estado: data.estado,
      },
    });
  }

  async eliminarTarea(id: number) {
    return this.prisma.tarea.delete({
      where: { id: id },
    });
}

}