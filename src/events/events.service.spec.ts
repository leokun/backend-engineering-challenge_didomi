import { Test, TestingModule } from '@nestjs/testing'
import { EventsService } from './events.service'
import { PostgreSQLDbService } from '@/db/postgre-sql-db.service'
import { InMemoryDbService } from '@/db/in-memory-db.service'
import { PrismaService } from '@/prisma.service'
import { DbInterface } from '@/db/db.interface'

describe('EventsService', () => {
  let service: EventsService
  let dbService: DbInterface
  const prisma = new PrismaService()

  beforeEach(async () => {
    dbService = new InMemoryDbService()
    //dbService = new DbService(prisma)
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService, { provide: PostgreSQLDbService, useValue: dbService }],
    }).compile()

    service = module.get<EventsService>(EventsService)
  })

  afterEach(async () => {
    await prisma?.user.deleteMany()
  })

  it('should add consent to an existing user', async () => {
    const user = await dbService.createUser({ email: 'kX7ZJ@example.com' })
    await service.post({
      user: {
        id: user.id
      },
      consents: [
        {
          id: 'email_notifications',
          enabled: true
        }
      ]
    })
    let userWithConsent = await dbService.findOneUser({ email: 'kX7ZJ@example.com' })
    expect(userWithConsent.consents.length).toEqual(1)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(true)

    await service.post({
      user: {
        id: user.id
      },
      consents: [
        {
          id: 'email_notifications',
          enabled: false
        },
        {
          id: 'sms_notifications',
          enabled: true
        }
      ]
    })

    userWithConsent = await dbService.findOneUser({ email: 'kX7ZJ@example.com' })
    expect(userWithConsent.consents.length).toEqual(2)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(false)
    expect(userWithConsent.consents[1].id).toEqual('sms_notifications')
    expect(userWithConsent.consents[1].enabled).toEqual(true)


    await service.post({
      user: {
        id: user.id
      },
      consents: [
        {
          id: 'sms_notifications',
          enabled: false
        }
      ]
    })

    userWithConsent = await dbService.findOneUser({ email: 'kX7ZJ@example.com' })
    expect(userWithConsent.consents.length).toEqual(2)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(false)
    expect(userWithConsent.consents[1].id).toEqual('sms_notifications')
    expect(userWithConsent.consents[1].enabled).toEqual(false)

  })
})
