import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PostgreSQLDbService } from '@/db/postgre-sql-db.service'
import { InMemoryDbService } from '@/db/in-memory-db.service'
import { PrismaService } from '@/prisma.service'
import { DbInterface } from '@/db/db.interface'

describe('UsersController', () => {
  let controller: UsersController
  let dbService: DbInterface
  const prisma = new PrismaService()

  beforeEach(async () => {
    dbService = new InMemoryDbService()
    //dbService = new DbService(prisma)
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, { provide: PostgreSQLDbService, useValue: dbService }],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })
  
  afterEach(async () => {
    await prisma?.user.deleteMany()
  })

  it('should create a user', async () => {
    const user = await controller.create({ email: 'kX7ZJ@example.com' })
    expect(user.email).toEqual('kX7ZJ@example.com')
  })

  it("can't create a user with an existing email", async () => {
    await controller.create({ email: 'kX7ZJ@example.com' })
    expect(async () => await controller.create({ email: 'kX7ZJ@example.com' })).rejects.toThrow()
  })

  it('can get all users', async () => {
    await controller.create({ email: 'kX7ZJ@example.com' })
    await controller.create({ email: 'kX7ZJ@test.com' })
    const users = await controller.findAll()
    expect(users.length).toEqual(2)
  })

  it('can get a user', async () => {
    await controller.create({ email: 'kX7ZJ@example.com' })
    const user = await controller.findOne('kX7ZJ@example.com')
    expect(user.email).toEqual('kX7ZJ@example.com')
  })

  it('can delete a user', async () => {
    await controller.create({ email: 'kX7ZJ@example.com' })
    await controller.remove('kX7ZJ@example.com')
    const users = await controller.findAll()
    expect(users.length).toEqual(0)
  })
})
