import { Controller, Post, Body, Get } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  async crear(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.crearTarea(createTareaDto);
  }

  @Get()
  async listar() {
    return this.tareasService.listarTareas();
  }

}