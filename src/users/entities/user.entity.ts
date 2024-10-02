import { Consent } from "@/events/entities/consent.entity"

export class User {
  id: string
  email: string
  consents: Consent[] = []

  static fromDb(options: Partial<User>) {
    for (const [key, value] of Object.entries(options)) {
      if (key in this) {
        this[key] = value
      }
    }
    return new User()
  }
}
