import { Test, TestingModule } from '@nestjs/testing'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { DbService } from '@/db/db.service'
import { InMemoryDbService } from '@/db/in-memory-db.service'
import { PrismaService } from '@/prisma.service'
import { Db } from '@/db/db.interface'

describe('EventsController', () => {
  let controller: EventsController
  let dbService: Db
  const prisma = new PrismaService()

  beforeEach(async () => {
    dbService = new InMemoryDbService()
    //dbService = new DbService(prisma)
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService, { provide: DbService, useValue: dbService }],
    }).compile()

    controller = module.get<EventsController>(EventsController)
  })
  
  afterEach(async () => {
    await prisma?.user.deleteMany()
  })

  it('should add consent to an existing user', async () => {
    const user = await dbService.createUser({ email: 'kX7ZJ@example.com' })
    await controller.post({
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
    console.log(userWithConsent)
    expect(userWithConsent.consents.length).toEqual(1)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(true)

    let userEventsHistory = await dbService.getUserEventsHistory('kX7ZJ@example.com')
    expect(userEventsHistory.events.length).toEqual(1)
    expect(userEventsHistory.events[0].consents.length).toEqual(1)
    expect(userEventsHistory.events[0].consents[0].id).toEqual('email_notifications')
    expect(userEventsHistory.events[0].consents[0].enabled).toEqual(true)

    await controller.post({
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
    console.dir(userWithConsent, { depth: null })
    expect(userWithConsent.consents.length).toEqual(2)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(false)
    expect(userWithConsent.consents[1].id).toEqual('sms_notifications')
    expect(userWithConsent.consents[1].enabled).toEqual(true)

    userEventsHistory = await dbService.getUserEventsHistory('kX7ZJ@example.com')
    expect(userEventsHistory.events.length).toEqual(2)
    expect(userEventsHistory.events[1].consents.length).toEqual(2)
    expect(userEventsHistory.events[1].consents[0].id).toEqual('email_notifications')
    expect(userEventsHistory.events[1].consents[0].enabled).toEqual(false)
    expect(userEventsHistory.events[1].consents[1].id).toEqual('sms_notifications')
    expect(userEventsHistory.events[1].consents[1].enabled).toEqual(true)


    await controller.post({
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

    userEventsHistory = await dbService.getUserEventsHistory('kX7ZJ@example.com')
    expect(userEventsHistory.events.length).toEqual(3)
    expect(userEventsHistory.events[2].consents.length).toEqual(1)
    expect(userEventsHistory.events[2].consents[0].id).toEqual('sms_notifications')
    expect(userEventsHistory.events[2].consents[0].enabled).toEqual(false)

  })
})
