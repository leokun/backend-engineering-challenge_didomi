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
  findAll() {
    const allUsers = this.usersService.findAll()

    return { users: allUsers }
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email)
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const newUser = this.usersService.create(createUserDto)
    if (!newUser) {
      throw new UnprocessableEntityException('User already exists')
    }
    return newUser
  }

  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email)
  }
}
