import { ApiProperty } from '@nestjs/swagger';

export class CccVo {
  @ApiProperty({ name: 'aaa', type: Number })
  aaa: number;
  @ApiProperty({ name: 'bbb', type: String })
  bbb: string;
}
