import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() body: { title: string; day?: string }): Promise<Task> {
    return this.tasksService.create(body.title, body.day);
  }
  
  @Post('bulk')
  bulkCreate(@Body() tasks: Array<{ title: string; day?: string }>): Promise<Task[]> {
    return this.tasksService.bulkCreate(tasks);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { completed: boolean },
  ): Promise<Task> {
    return this.tasksService.update(+id, body.completed);
  }

  @Put(':id/entire')
  entireUpdate(
    @Param('id') id: string,
    @Body() body: { title: string; completed: boolean; day?: string },
  ): Promise<Task> {
    return this.tasksService.entireUpdate(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(+id);
  }
}
