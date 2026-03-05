import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
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

 @Put(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() updateTareaDto: CreateTareaDto,
  ) {
    return this.tareasService.actualizarTarea(Number(id), updateTareaDto);
  }  
  
}