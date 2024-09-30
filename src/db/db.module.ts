import { Module } from '@nestjs/common'
import { DbService } from './db.service'
import { InMemoryDbService } from './in-memory-db.service'

@Module({
  providers: [DbService, InMemoryDbService],
})
export class DbModule { }
