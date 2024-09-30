import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DbService } from '@/db/db.service'
import { InMemoryDbService } from '@/db/in-memory-db.service'

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: DbService, useValue: new InMemoryDbService() }
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should create a user', () => {
    const user = controller.create({ email: 'kX7ZJ@example.com' })
    expect(user.email).toEqual('kX7ZJ@example.com')
  })

  it("can't create a user with an existing email", () => {
    controller.create({ email: 'kX7ZJ@example.com' })
    expect(() => controller.create({ email: 'kX7ZJ@example.com' })).toThrow()
  })

  it('can get all users', () => {
    controller.create({ email: 'kX7ZJ@example.com' })
    controller.create({ email: 'kX7ZJ@test.com' })
    expect(controller.findAll().users.length).toEqual(2)
  })

  it('can get a user', () => {
    controller.create({ email: 'kX7ZJ@example.com' })
    const user = controller.findOne('kX7ZJ@example.com')
    expect(user.email).toEqual('kX7ZJ@example.com')
  })

  it('can delete a user', () => {
    controller.create({ email: 'kX7ZJ@example.com' })
    controller.remove('kX7ZJ@example.com')
    expect(controller.findAll().users.length).toEqual(0)
  })
})
