import { Injectable } from '@nestjs/common'
import { Db, UserEventsHistory, UserSearchOptions } from './db.interface';
import { PostEventDto } from '@/events/dto/post-event.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class DbService implements Db {
    createUser(createUserDto: CreateUserDto): User | undefined {
        throw new Error('Method not implemented.');
    }
    findAllUsers(): User[] {
        throw new Error('Method not implemented.');
    }
    findOneUser(search: UserSearchOptions): User {
        throw new Error('Method not implemented.');
    }
    removeUser(email: string): void {
        throw new Error('Method not implemented.');
    }
    postEvent(postConsentDto: PostEventDto): void {
        throw new Error('Method not implemented.');
    }
    saveEventHistory(postConsentDto: PostEventDto): void {
        throw new Error('Method not implemented.');
    }
    getUserEventsHistory(email: string): UserEventsHistory {
        throw new Error('Method not implemented.');
    }
}
