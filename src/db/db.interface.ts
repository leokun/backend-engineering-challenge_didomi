import { PostEventDto } from '@/events/dto/post-event.dto'
import { Consent } from '@/events/entities/consent.entity'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { User } from '@/users/entities/user.entity'

type EmailOption = { email: string }
type IdOption = { id: string }
export type UserSearchOptions = EmailOption | IdOption
export type UserEventsHistory = { timestamp: number, consents: Consent[] }[]


export interface Db {
  createUser(createUserDto: CreateUserDto): User | undefined
  findAllUsers(): User[]
  findOneUser(search: UserSearchOptions): User
  removeUser(email: string): void
  postEvent(postConsentDto: PostEventDto): void
  saveEventHistory(postConsentDto: PostEventDto): void
  getUserEventsHistory(email: string): UserEventsHistory

}
