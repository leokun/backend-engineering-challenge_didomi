import { Test, TestingModule } from '@nestjs/testing'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { DbService } from '@/db/db.service'
import { InMemoryDbService } from '@/db/in-memory-db.service'

describe('EventsController', () => {
  let controller: EventsController
  let dbService: InMemoryDbService

  beforeEach(async () => {
    dbService = new InMemoryDbService()
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsService,
        { provide: DbService, useValue: dbService }
      ],
    }).compile()

    controller = module.get<EventsController>(EventsController)
  })

  it('should add consent to an existing user', () => {
    const user = dbService.createUser({ email: 'kX7ZJ@example.com' })
    controller.post({
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
    let userWithConsent = dbService.findOneUser({ email: 'kX7ZJ@example.com' })
    expect(userWithConsent.consents.length).toEqual(1)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(true)

    let userEventsHistory = dbService.getUserEventsHistory('kX7ZJ@example.com')
    expect(userEventsHistory.length).toEqual(1)
    expect(userEventsHistory[0].consents.length).toEqual(1)
    expect(userEventsHistory[0].consents[0].id).toEqual('email_notifications')
    expect(userEventsHistory[0].consents[0].enabled).toEqual(true)

    controller.post({
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

    userWithConsent = dbService.findOneUser({ email: 'kX7ZJ@example.com' })
    expect(userWithConsent.consents.length).toEqual(2)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(false)
    expect(userWithConsent.consents[1].id).toEqual('sms_notifications')
    expect(userWithConsent.consents[1].enabled).toEqual(true)

    userEventsHistory = dbService.getUserEventsHistory('kX7ZJ@example.com')
    expect(userEventsHistory.length).toEqual(2)
    expect(userEventsHistory[1].consents.length).toEqual(2)
    expect(userEventsHistory[1].consents[0].id).toEqual('email_notifications')
    expect(userEventsHistory[1].consents[0].enabled).toEqual(false)
    expect(userEventsHistory[1].consents[1].id).toEqual('sms_notifications')
    expect(userEventsHistory[1].consents[1].enabled).toEqual(true)


    controller.post({
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

    userWithConsent = dbService.findOneUser({ email: 'kX7ZJ@example.com' })
    expect(userWithConsent.consents.length).toEqual(2)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(false)
    expect(userWithConsent.consents[1].id).toEqual('sms_notifications')
    expect(userWithConsent.consents[1].enabled).toEqual(false)

    userEventsHistory = dbService.getUserEventsHistory('kX7ZJ@example.com')
    expect(userEventsHistory.length).toEqual(3)
    expect(userEventsHistory[2].consents.length).toEqual(1)
    expect(userEventsHistory[2].consents[0].id).toEqual('sms_notifications')
    expect(userEventsHistory[2].consents[0].enabled).toEqual(false)

  })
})
