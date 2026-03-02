import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TareasController],
  providers: [TareasService, PrismaService],
})
export class TareasModule {}