import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersServiceInterface } from './users.service.interface';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class InMemoryService implements UsersServiceInterface {
    create(createUserDto: CreateUserDto): User {
        if (this.users.has(createUserDto.email)) {
            throw new UnprocessableEntityException('User already exists');
        };

        const user = new User();
        user.id = crypto.randomUUID();
        user.email = createUserDto.email;
        user.consents = [];
        this.users.set(createUserDto.email, user);
        return user;
    }

    private users: Map<string, User> = new Map<string, User>();

    getAll(): User[] {
        return Array.from(this.users.values());
    }

    get(email: string): User {
        return this.users.get(email);
    }

    delete(email: string): void {
        this.users.delete(email);
    }

}
