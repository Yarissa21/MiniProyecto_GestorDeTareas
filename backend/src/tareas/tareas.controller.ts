import { Controller, Post, Body, Get, Query, Put, Delete, Patch, Param } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { Estado } from '@prisma/client';

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

  @Delete(':id')
   async eliminar(@Param('id') id: string) {
    return this.tareasService.eliminarTarea(Number(id));
 }
 
  @Patch(':id/estado')
   async cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: Estado,
  ) {
    return this.tareasService.cambiarEstado(Number(id), estado);
  }

  @Get('filtrar')
  async filtrar(@Query('estado') estado?: Estado) {
    return this.tareasService.filtrarPorEstado(estado);
  }

  @Get('buscar')
async buscar(@Query('texto') texto: string) {
  return this.tareasService.buscarPorTexto(texto);
}

}