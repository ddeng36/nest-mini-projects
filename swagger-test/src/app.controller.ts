import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CccVo } from './ccc.vo';
import { CccDto } from './ccc.dto';
@ApiTags('测试tags分类')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiBearerAuth('bearer')
  @ApiTags('测试tags分类2')
  @ApiOperation({ summary: '测试 aaa', description: 'aaa 描述' })
  @ApiQuery({
    name: 'a1',
    type: String,
    description: 'a1 param',
    required: false,
    example: '1111',
  })
  @ApiQuery({
    name: 'a2',
    type: Number,
    description: 'a2 param',
    required: true,
    example: 2222,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String,
  })
  @Get('aaa')
  aaa(@Query('a1') a1, @Query('a2') a2) {
    console.log(a1, a2);
    return 'aaa success';
  }
  @ApiOperation({ summary: '测试 bbb', description: 'bbb 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'bbb 成功',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'bbb 失败',
    type: String,
  })
  @ApiParam({
    name: 'id',
    description: 'id param',
    required: true,
    example: '222',
  })

  @ApiCookieAuth('cookie')
  @Get('bbb/:id')
  bbb(@Param('id') id) {
    console.log(id);
    return 'bbb success';
  }




  @ApiBasicAuth('basic')
  @ApiOperation({ summary: '测试 ccc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ccc 成功',
    type: CccVo,
  })
  @ApiBody({
    type: CccDto,
  })
  @Post('ccc')
  ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc);

    const vo = new CccVo();
    vo.aaa = 111;
    vo.bbb = 222 + '';
    return vo;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
