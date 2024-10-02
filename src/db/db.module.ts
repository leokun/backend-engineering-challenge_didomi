import { Module } from '@nestjs/common'
import { DbService } from './db.service'
import { InMemoryDbService } from './in-memory-db.service'
import { PrismaService } from '@/prisma.service'

@Module({
  providers: [DbService, InMemoryDbService, PrismaService],
})
export class DbModule { }
