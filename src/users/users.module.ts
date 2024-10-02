import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DbService } from '@/db/db.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, DbService, PrismaService],
  imports: [DbModule],
})
export class UsersModule { }
