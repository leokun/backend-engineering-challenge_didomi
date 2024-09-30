import { Consent } from "@/events/entities/consent.entity"

export class User {
  id: string
  email: string
  consents: Consent[] = []
}
