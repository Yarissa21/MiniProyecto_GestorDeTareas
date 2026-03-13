import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { Estado } from '@prisma/client';

@Injectable()
export class TareasService {
  constructor(private prisma: PrismaService) {}

  async crearTarea(data: CreateTareaDto) {
    try {
      if (!data.titulo) {
        return { mensaje: 'El título es obligatorio' };
      }
      if (!data.descripcion) {
        return { mensaje: 'La descripcion es obligadoria'};
      }
      if (!data.fechaEntrega) {
        return { mensaje: 'La fecha es obligadoria'};
      }

      return await this.prisma.tarea.create({
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          fechaEntrega: data.fechaEntrega,
          estado: data.estado,
        },
      });
    } catch (error) {
      return { mensaje: 'Error al crear la tarea' };
    }
  }

  async listarTareas() {
    try {
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

    } catch (error) {
      return { mensaje: 'Error al obtener las tareas.' };
    }
  }

  async actualizarTarea(id: number, data: CreateTareaDto) {
    try {

      const tarea = await this.prisma.tarea.findUnique({
        where: { id }
      });

      if (!tarea) {
        return { mensaje: 'La tarea no existe.' };
      }

      return await this.prisma.tarea.update({
        where: { id },
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          fechaEntrega: data.fechaEntrega,
          estado: data.estado,
        },
      });

    } catch (error) {
      return { mensaje: 'Error al actualizar la tarea.' };
    }
  }
  
  async eliminarTarea(id: number) {
    try {
      return await this.prisma.tarea.delete({
        where: { id },
      });
    } catch (error) {
      return { mensaje: 'Tarea no encontrada o ya eliminada.' };
    }
  }

  async cambiarEstado(id: number, estado: Estado) {
    try {

      const tarea = await this.prisma.tarea.findUnique({
        where: { id },
      });

      if (!tarea) {
        return { mensaje: 'Tarea no encontrada' };
      }

      return await this.prisma.tarea.update({
        where: { id },
        data: {
          estado: estado,
        },
      });

    } catch (error) {
      return { mensaje: 'Error al cambiar el estado de la tarea.' };
    }
  }

  async filtrarPorEstado(estado?: Estado) {
    try {

      let tareas;

      if (estado) {
        tareas = await this.prisma.tarea.findMany({
          where: { estado },
          orderBy: { fechaEntrega: 'asc' },
        });
      } else {
        tareas = await this.prisma.tarea.findMany({
          orderBy: { fechaEntrega: 'asc' },
        });
      }

      if (tareas.length === 0) {
        return { mensaje: 'No hay tareas para el filtro seleccionado.' };
      }

      return tareas;

    } catch (error) {
      return { mensaje: 'Error al filtrar las tareas.' };
    }
  }

  async buscarPorTexto(texto: string) {
    try {

      const tareas = await this.prisma.tarea.findMany({
        where: {
          OR: [
            {
              titulo: {
                contains: texto,
                mode: 'insensitive',
              },
            },
            {
              descripcion: {
                contains: texto,
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          fechaEntrega: 'asc',
        },
      });

      if (tareas.length === 0) {
        return { mensaje: 'No se encontraron tareas con ese texto.' };
      }

      return tareas;

    } catch (error) {
      return { mensaje: 'Error al buscar tareas.' };
    }
  }
}