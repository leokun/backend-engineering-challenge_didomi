import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll() {
    return await this.usersService.findAll()
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    return await this.usersService.findOne(email)
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto)
    const newUser = await this.usersService.create(createUserDto)
    if (!newUser) {
      throw new UnprocessableEntityException('User already exists')
    }
    return newUser
  }

  @Delete(':email')
  async remove(@Param('email') email: string) {
    return await this.usersService.remove(email)
  }
}
