import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { InMemoryService } from './in-memory.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, InMemoryService],
})
export class UsersModule { }
