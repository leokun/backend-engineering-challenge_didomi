import { Injectable } from '@nestjs/common'
import { PostEventDto } from './dto/post-event.dto'
import { DbService } from '@/db/db.service'
import { Consent } from './entities/consent.entity'
import { User } from '@/users/entities/user.entity'

@Injectable()
export class EventsService {
  constructor(private readonly service: DbService) { }


  saveHistory(postConsentDto: PostEventDto): void {
    this.service.saveEventHistory(postConsentDto)
  }

  post(postConsentDto: PostEventDto): void {
    const user = this.service.findOneUser({ id: postConsentDto.user.id })
    if (!user) { throw new Error('User not found') }

    this.service.postEvent({ ...postConsentDto, consents: this.setConsent(user, postConsentDto.consents) })
  }

  private setConsent(user: User, consents: Consent[]): Consent[] {
    if (user.consents.length == 0) user.consents = consents
    else {
      consents.forEach((consent) => {
        const foundAt = user.consents.findIndex(
          (userConsent) => userConsent.id == consent.id
        )
        if (foundAt == -1) user.consents.push(consent)
        else user.consents[foundAt] = consent
      })
    }

    return user.consents
  }
}
