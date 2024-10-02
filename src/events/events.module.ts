import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { DbService } from '@/db/db.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [EventsController],
  providers: [EventsService, DbService, PrismaService],
  imports: [DbModule],
})
export class EventsModule { }
