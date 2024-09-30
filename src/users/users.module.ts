import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DbService } from '@/db/db.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, DbService],
  imports: [DbModule],
})
export class UsersModule { }
