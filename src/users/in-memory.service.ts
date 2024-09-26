import { Injectable } from '@nestjs/common';
import { UsersInterface } from './users.interface';
import { User } from './entities/user.entity';

@Injectable()
export class InMemoryService implements UsersInterface {
    getAll(): User[] {
        throw new Error('Method not implemented.');
    }
    get(email: string): User {
        throw new Error('Method not implemented.');
    }
    delete(email: string): void {
        throw new Error('Method not implemented.');
    }
    
}
