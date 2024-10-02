import { Module } from '@nestjs/common'
import { EventsModule } from './events/events.module'
import { DbModule } from './db/db.module'
import { DbService } from './db/db.service'
import { InMemoryDbService } from './db/in-memory-db.service'
import { UsersModule } from './users/users.module'
import { PrismaService } from './prisma.service';

@Module({
  imports: [UsersModule, EventsModule, DbModule],
  controllers: [],
  providers: [InMemoryDbService, DbService, PrismaService],
})
export class AppModule { }
