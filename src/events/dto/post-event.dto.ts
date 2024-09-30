import { Consent } from "../entities/consent.entity"

export class PostEventDto {
  user: { id: string }
  consents: Consent[]
}
