import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { ArticleService } from 'src/article/article.service';

@Module({
  imports: [ArticleService],
  providers: [TasksService],
})
export class TaskModule {}
