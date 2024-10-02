import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PostgreSQLDbService } from '@/db/postgre-sql-db.service'

@Injectable()
export class UsersService {
  constructor(private readonly service: PostgreSQLDbService) { }
  create(createUserDto: CreateUserDto) {
    try {
      return this.service.createUser(createUserDto)

    } catch (_error) {
      throw new UnprocessableEntityException('User already exists')
    }
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
