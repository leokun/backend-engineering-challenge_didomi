import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

export interface UsersServiceInterface {
    create(createUserDto: CreateUserDto): User;
    getAll(): User[];
    get(email: string): User;
    delete(email: string): void;
}
