import { Test, TestingModule } from '@nestjs/testing'
import { InMemoryDbService } from './in-memory-db.service'
import { rejects } from 'assert'

describe('InMemoryService', () => {
  let service: InMemoryDbService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryDbService],
    }).compile()

    service = module.get<InMemoryDbService>(InMemoryDbService)
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
})
