import { Controller, Post, Body, Get, Query, Put, Delete, Patch, Param } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { Estado } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tareas')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente.' })
  async crear(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.crearTarea(createTareaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas' })
  @ApiResponse({ status: 200, description: 'Lista de tareas.' })
  async listar() {
    return this.tareasService.listarTareas();
  }

 @Put(':id')
 @ApiOperation({ summary: 'Actualizar una tarea' })
  async actualizar(
    @Param('id') id: string,
    @Body() updateTareaDto: CreateTareaDto,
  ) {
    return this.tareasService.actualizarTarea(Number(id), updateTareaDto);
  }  

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
   async eliminar(@Param('id') id: string) {
    return this.tareasService.eliminarTarea(Number(id));
 }
 
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado de una tarea' })
   async cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: Estado,
  ) {
    return this.tareasService.cambiarEstado(Number(id), estado);
  }

  @Get('filtrar')
  @ApiOperation({ summary: 'Filtrar tareas por estado' })
  async filtrar(@Query('estado') estado?: Estado) {
    return this.tareasService.filtrarPorEstado(estado);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar tareas por texto' })  
  async buscar(@Query('texto') texto: string) {
    return this.tareasService.buscarPorTexto(texto);
  }

}