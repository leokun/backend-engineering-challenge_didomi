import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { PostgreSQLDbService } from '@/db/postgre-sql-db.service'
import { InMemoryDbService } from '@/db/in-memory-db.service'
import { PrismaService } from '@/prisma.service'
import { DbInterface } from '@/db/db.interface'

describe('UsersService', () => {
  let service: UsersService
  let dbService: DbInterface
  const prisma = new PrismaService()

  beforeEach(async () => {
    dbService = new InMemoryDbService()
    //dbService = new DbService(prisma)
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PostgreSQLDbService, useValue: dbService }],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  afterEach(async () => {
    await prisma?.user.deleteMany()
  })

  it('should create a user', async () => {
    const user = await service.create({ email: 'kX7ZJ@example.com' })
    expect(user.email).toEqual('kX7ZJ@example.com')
  })

  it("can't create a user with an existing email", async () => {
    await service.create({ email: 'kX7ZJ@example.com' })
    expect(async () => await service.create({ email: 'kX7ZJ@example.com' })).rejects.toThrow()
  })

  it('can get all users', async () => {
    await service.create({ email: 'kX7ZJ@example.com' })
    await service.create({ email: 'kX7ZJ@test.com' })
    const users = await service.findAll()
    expect(users.length).toEqual(2)
  })

  it('can get a user', async () => {
    await service.create({ email: 'kX7ZJ@example.com' })
    const user = await service.findOne('kX7ZJ@example.com')
    expect(user.email).toEqual('kX7ZJ@example.com')
  })

  it('can delete a user', async () => {
    await service.create({ email: 'kX7ZJ@example.com' })
    await service.remove('kX7ZJ@example.com')
    const users = await service.findAll()
    expect(users.length).toEqual(0)
  })
})
