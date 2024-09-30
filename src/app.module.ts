import { Module } from '@nestjs/common'
import { EventsModule } from './events/events.module'
import { DbModule } from './db/db.module'
import { DbService } from './db/db.service'
import { InMemoryDbService } from './db/in-memory-db.service'
import { UsersModule } from './users/users.module'

@Module({
  imports: [UsersModule, EventsModule, DbModule],
  controllers: [],
  providers: [InMemoryDbService, DbService],
})
export class AppModule { }
