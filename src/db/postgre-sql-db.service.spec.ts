import { Test, TestingModule } from '@nestjs/testing'
import { PostgreSQLDbService } from './postgre-sql-db.service'
import { PrismaService } from '@/prisma.service'

describe('PostgreSQLDbService', () => {
  let service: PostgreSQLDbService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgreSQLDbService, PrismaService],
    }).compile()

    service = module.get<PostgreSQLDbService>(PostgreSQLDbService)
  })
  afterEach(async () => {
    const prisma = new PrismaService()
    await prisma.user.deleteMany()
  })

  it('should create a user', async () => {
    const user = await await service.createUser({ email: 'kX7ZJ@example.com' });
    expect(user.email).toEqual('kX7ZJ@example.com');
  })

  it("can't create a user with an existing email", async () => {
    await service.createUser({ email: 'kX7ZJ@example.com' });
    expect(async () => await service.createUser({ email: 'kX7ZJ@example.com' })).rejects.toThrow();
  })

  it('can get all users', async () => {
    await service.createUser({ email: 'kX7ZJ@example.com' });
    await service.createUser({ email: 'kX7ZJ@test.com' });
    const users = await service.findAllUsers();
    expect(users.length).toEqual(2);
  })

  it('can get a user', async () => {
    await service.createUser({ email: 'kX7ZJ@example.com' });
    const user = await service.findOneUser({ email: 'kX7ZJ@example.com' });
    expect(user.email).toEqual('kX7ZJ@example.com');
  })

  it('can delete a user', async () => {
    await service.createUser({ email: 'kX7ZJ@example.com' });
    await service.removeUser('kX7ZJ@example.com');
    const users = await service.findAllUsers();
    expect(users.length).toEqual(0);
  })

  it('can post events', async () => {
    const user = await service.createUser({ email: 'kX7ZJ@example.com' });
    await service.postEvent({
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
    const userWithConsent = await service.findOneUser({ email: 'kX7ZJ@example.com' })
    expect(userWithConsent.consents.length).toEqual(1)
    expect(userWithConsent.consents[0].id).toEqual('email_notifications')
    expect(userWithConsent.consents[0].enabled).toEqual(true)
  })

  it('can save event history', async () => {
    const user = await service.createUser({ email: 'kX7ZJ@example.com' });
    await service.saveEventHistory({
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

    const userEventsHistory = await service.getUserEventsHistory('kX7ZJ@example.com')
    expect(userEventsHistory.events.length).toEqual(1)
    expect(userEventsHistory.events[0].consents.length).toEqual(1)
    expect(userEventsHistory.events[0].consents[0].id).toEqual('email_notifications')
    expect(userEventsHistory.events[0].consents[0].enabled).toEqual(true)
  })

})
