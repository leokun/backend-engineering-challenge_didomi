import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PostgreSQLDbService } from '@/db/postgre-sql-db.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PostgreSQLDbService, PrismaService],
  imports: [DbModule],
})
export class UsersModule { }
