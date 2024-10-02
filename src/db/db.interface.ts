import { PostEventDto } from '@/events/dto/post-event.dto'
import { Consent } from '@/events/entities/consent.entity'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { GetUserResponse } from './dto/user-response'
import { PostEventResponse } from './dto/created-event-response'

type EmailOption = { email: string }
type IdOption = { id: string }
export type UserSearchOptions = EmailOption | IdOption
export type UserEventsHistory = { user: IdOption, events: { timestamp: number, consents: Consent[] }[] }


export interface Db {
  createUser(createUserDto: CreateUserDto): Promise<GetUserResponse | undefined>
  findAllUsers(): Promise<GetUserResponse[]>
  findOneUser(search: UserSearchOptions): Promise<GetUserResponse>
  removeUser(email: string): Promise<void>
  postEvent(postConsentDto: PostEventDto): Promise<PostEventResponse>
  saveEventHistory(postConsentDto: PostEventDto): Promise<void>
  getUserEventsHistory(email: string): Promise<UserEventsHistory>
}
