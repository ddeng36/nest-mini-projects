import { Controller, Post, Body, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login.dto';
import { RedisService } from 'src/redis/redis.service';

@Controller('user')
export class UserController {
  @Inject(RedisService)
  private redisService: RedisService;

  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, code } = loginUserDto;
    const codeInRedis = await this.redisService.get(`captcha_${email}`);
    if (codeInRedis !== code) {
      throw new Error('验证码错误');
    }
    if (!codeInRedis) {
      throw new Error('验证码已过期');
    }
    const user = await this.userService.findUserByEmail(email);
    console.log(user);

    return 'success';
  }
}
