import { Module } from '@nestjs/common'
import { PostgreSQLDbService } from './postgre-sql-db.service'
import { InMemoryDbService } from './in-memory-db.service'
import { PrismaService } from '@/prisma.service'

@Module({
  providers: [PostgreSQLDbService, InMemoryDbService, PrismaService],
})
export class DbModule { }
