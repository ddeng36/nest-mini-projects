import { ArticleService } from './../article/article.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  @Inject(ArticleService)
  private ArticleService: ArticleService;

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.ArticleService.flushRedisToDB();
  }
}
