import { User } from "./entities/user.entity";

export interface UsersInterface {
    getAll(): User[];
    get(email: string): User;
    delete(email: string): void;
}
