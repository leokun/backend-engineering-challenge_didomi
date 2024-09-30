import { Test, TestingModule } from '@nestjs/testing'
import { InMemoryDbService } from './in-memory-db.service'

describe('InMemoryService', () => {
  let service: InMemoryDbService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryDbService],
    }).compile()

    service = module.get<InMemoryDbService>(InMemoryDbService)
  })

  it('should create a user', () => {
    const user = service.createUser({ email: 'kX7ZJ@example.com' });
    expect(user.email).toEqual('kX7ZJ@example.com');
  })

  it("can't create a user with an existing email", () => {
    service.createUser({ email: 'kX7ZJ@example.com' });
    expect(() => service.createUser({ email: 'kX7ZJ@example.com' })).toThrow();
  })

  it('can get all users', () => {
    service.createUser({ email: 'kX7ZJ@example.com' });
    service.createUser({ email: 'kX7ZJ@test.com' });
    expect(service.findAllUsers().length).toEqual(2);
  })

  it('can get a user', () => {
    service.createUser({ email: 'kX7ZJ@example.com' });
    const user = service.findOneUser({ email: 'kX7ZJ@example.com' });
    expect(user.email).toEqual('kX7ZJ@example.com');
  })

  it('can delete a user', () => {
    service.createUser({ email: 'kX7ZJ@example.com' });
    service.removeUser('kX7ZJ@example.com');
    expect(service.findAllUsers().length).toEqual(0);
  })
})
