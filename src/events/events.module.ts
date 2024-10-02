import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { PostgreSQLDbService } from '@/db/postgre-sql-db.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [EventsController],
  providers: [EventsService, PostgreSQLDbService, PrismaService],
  imports: [DbModule],
})
export class EventsModule { }
