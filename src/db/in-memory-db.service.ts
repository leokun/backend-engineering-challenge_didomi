import { Injectable } from '@nestjs/common'
import { PostEventDto } from '@/events/dto/post-event.dto'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { User } from '@/users/entities/user.entity'
import type { Db, UserEventsHistory, UserSearchOptions } from './db.interface'
import { Consent } from '@/events/entities/consent.entity'
import { GetUserResponse } from './dto/user-response'
import { PostEventResponse } from './dto/created-event-response'

type UserEmail = string
type UserId = string
type DateEventMap = Map<number, Consent[]>
@Injectable()
export class InMemoryDbService implements Db {

  private users: Map<UserEmail, User> = new Map<UserEmail, User>()
  private idEmail: Map<UserId, UserEmail> = new Map<UserId, UserEmail>()
  private userEventsHistory: Map<UserEmail, DateEventMap> = new Map<UserEmail, DateEventMap>()

  async createUser(createUserDto: CreateUserDto): Promise<GetUserResponse | undefined> {
    if (this.users.has(createUserDto.email)) {
      throw new Error('User already exists')
    }

    const user = new User()
    user.id = crypto.randomUUID()
    user.email = createUserDto.email
    user.consents = []
    this.users.set(createUserDto.email, user)
    this.idEmail.set(user.id, user.email)
    return user
  }

  async findAllUsers(): Promise<GetUserResponse[]> {
    return Array.from(this.users.values())
  }

  async findOneUser(search: UserSearchOptions): Promise<GetUserResponse> {
    if ('email' in search) {
      return this.users.get(search.email)
    }
    if ('id' in search) {
      return this.users.get(this.idEmail.get(search.id))
    }
    throw new Error('Invalid search options')
  }

  async removeUser(email: string): Promise<void> {
    this.users.delete(email)
  }

  async postEvent(postConsentDto: PostEventDto): Promise<PostEventResponse> {
    const user = this.findOneUser({ id: postConsentDto.user.id }) as unknown as User
    if (!user) throw new Error('User not found')
    user.consents = postConsentDto.consents

    return {
      user: { id: user.id },
      consents: user.consents
    }
  }

  async saveEventHistory(postConsentDto: PostEventDto) {
    const userEmail = this.idEmail.get(postConsentDto.user.id)
    if (!userEmail) throw new Error('User not found')


    if (!this.userEventsHistory.has(userEmail)) {
      this.userEventsHistory.set(userEmail, new Map([[Date.now(), [...postConsentDto.consents]]]))
    }
    else this.userEventsHistory.get(userEmail).set(Date.now(), [...postConsentDto.consents])
  }

  async getUserEventsHistory(email: string): Promise<UserEventsHistory> {
    const fromEntries = Object.fromEntries(this.userEventsHistory.get(email))
    const events = Object.entries(fromEntries).map(([key, value]) => ({ timestamp: Number(key), consents: value }))
    
    return { user: { id: this.idEmail.get(email) }, events }
  }
}
