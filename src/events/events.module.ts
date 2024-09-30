import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { DbService } from '@/db/db.service'

@Module({
  controllers: [EventsController],
  providers: [EventsService, DbService],
  imports: [DbModule],
})
export class EventsModule { }
