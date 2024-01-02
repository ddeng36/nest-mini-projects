import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ArticleService } from './article.service';
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.articleService.findOne(+id);
  }
  @Get(':id/view')
  async view(@Param('id') id: string) {
    return await this.articleService.view(+id);
  }
}
