import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { DbService } from '@/db/db.service'

@Injectable()
export class UsersService {
  constructor(private readonly service: DbService) { }
  create(createUserDto: CreateUserDto) {
    return this.service.createUser(createUserDto)
  }
  findAll() {
    return this.service.findAllUsers()
  }
  findOne(email: string) {
    return this.service.findOneUser({ email })
  }
  remove(email: string) {
    return this.service.removeUser(email)
  }
}
