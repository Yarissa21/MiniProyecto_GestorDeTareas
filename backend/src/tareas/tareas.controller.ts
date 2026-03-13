import { Controller, Post, Body, Get, Query, Put, Delete, Patch, Param } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { Estado } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('tareas')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes.' })
  async crear(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.crearTarea(createTareaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas' })
  @ApiResponse({ status: 200, description: 'Lista de tareas.' })
  @ApiResponse({ status: 404, description: 'No hay tareas registradas.' })
  async listar() {
    return this.tareasService.listarTareas();
  }

 @Put(':id')
 @ApiOperation({ summary: 'Actualizar una tarea' })
 @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'La tarea no existe.' })
  async actualizar(
    @Param('id') id: string,
    @Body() updateTareaDto: CreateTareaDto,
  ) {
    return this.tareasService.actualizarTarea(Number(id), updateTareaDto);
  }  

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Tarea eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
   async eliminar(@Param('id') id: string) {
    return this.tareasService.eliminarTarea(Number(id));
 }
 
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado de una tarea' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Estado actualizado.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
   async cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: Estado,
  ) {
    return this.tareasService.cambiarEstado(Number(id), estado);
  }

  @Get('filtrar')
  @ApiOperation({ summary: 'Filtrar tareas por estado' })
  @ApiQuery({ name: 'estado', enum: Estado, required: false, example: Estado.PENDIENTE })
  @ApiResponse({ status: 200, description: 'Lista de tareas filtradas.' })
  @ApiResponse({ status: 404, description: 'No hay tareas para el filtro seleccionado.' })
  async filtrar(@Query('estado') estado?: Estado) {
    return this.tareasService.filtrarPorEstado(estado);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar tareas por texto' })
  @ApiQuery({ name: 'texto', type: String, example: 'presentación' })
  @ApiResponse({ status: 200, description: 'Lista de tareas encontradas.' })
  @ApiResponse({ status: 404, description: 'No se encontraron tareas con ese texto.' })  
  async buscar(@Query('texto') texto: string) {
    return this.tareasService.buscarPorTexto(texto);
  }

}