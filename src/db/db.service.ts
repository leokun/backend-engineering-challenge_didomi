import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { Db, UserEventsHistory, UserSearchOptions } from './db.interface';
import { PostEventDto } from '@/events/dto/post-event.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { User } from '@/users/entities/user.entity';
import { PrismaService } from '@/prisma.service';
import { Consent } from '@prisma/client';
import { GetUserResponse } from './dto/user-response';
import { PostEventResponse } from './dto/created-event-response';

@Injectable()
export class DbService implements Db {

    constructor(private readonly prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto): Promise<User | undefined> {
        try {
            return await this.prisma.user.create({
            data: {
                email: createUserDto.email
            },
            select: {
                id: true,
                email: true,
                consents: true
            },
        })

        } catch (_error) {
            throw new UnprocessableEntityException('User already exists')
        }
        
        
    }


    async findAllUsers(): Promise<GetUserResponse[]> {
        return await this.prisma.user.findMany({
            where: {
                deleted: { equals: false }
            },
            select: {
                id: true,
                email: true,
                consents: {
                    select: {
                        id: true,
                        enabled: true
                    }
                }
            },
        })
    }

    async findOneUser(search: UserSearchOptions): Promise<User> {
        return await this.prisma.user.findFirst({
            where: {
                ...search,
                deleted: { equals: false }
            },
            select: {
                id: true,
                email: true,
                consents: {
                    select: {
                        id: true,
                        enabled: true
                    }
                }
            },
        })
    }

    async removeUser(email: string): Promise<void> {
        await this.prisma.user.update({
            where: {
                email: email
            },
            data: {
                deleted: true
            }
        })
    }
    async postEvent(postConsentDto: PostEventDto): Promise<PostEventResponse> {
        await this.prisma.consent.deleteMany({
            where: {
                userId: postConsentDto.user.id
            }
        })
        const update = await this.prisma.user.update({
            where: {
                id: postConsentDto.user.id
            },
            data: {
                consents: {
                    createMany: {
                        data: postConsentDto.consents
                    }
                }
            },
            select: {
                id: true,
                consents: {
                    select: {
                        id: true,
                        enabled: true
                    }
                }
            },
        })

        return { user: { id: update.id }, consents: update.consents }
    }
    async saveEventHistory(postConsentDto: PostEventDto): Promise<void> {

        await this.prisma.user.update({
            where: {
                id: postConsentDto.user.id
            },
            data: {
                events: {
                    createMany: {
                        data: { consents: JSON.stringify(postConsentDto.consents) }
                    }
                }
            },

        })
    }
    async getUserEventsHistory(email: string): Promise<UserEventsHistory> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                events: {
                    select: {
                        createdAt: true,
                        consents: true
                    }
                }
            },
        })

        return {
            user: { id: user.id },
            events: user.events.map((event) => (
                {
                    timestamp: event.createdAt.getTime(),
                    consents: JSON.parse(event.consents as string) as Consent[]
                }
            ))
        }
    }
}

