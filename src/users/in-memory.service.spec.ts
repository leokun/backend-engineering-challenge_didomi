import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryService } from './in-memory.service';

describe('InMemoryService', () => {
  let service: InMemoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryService],
    }).compile();

    service = module.get<InMemoryService>(InMemoryService);
  });


  it('should create a user', () => {
    const user = service.create({ email: 'kX7ZJ@example.com' });
    expect(user.email).toEqual('kX7ZJ@example.com');
  })

  it("can't create a user with an existing email", () => {
    service.create({ email: 'kX7ZJ@example.com' });
    expect(() => service.create({ email: 'kX7ZJ@example.com' })).toThrow();
  })

  it('can get all users', () => {
    service.create({ email: 'kX7ZJ@example.com' });
    service.create({ email: 'kX7ZJ@test.com' });
    expect(service.getAll().length).toEqual(2);
  })

  it('can get a user', () => {
    service.create({ email: 'kX7ZJ@example.com' });
    const user = service.get('kX7ZJ@example.com');
    expect(user.email).toEqual('kX7ZJ@example.com');
  })

  it('can delete a user', () => {
    service.create({ email: 'kX7ZJ@example.com' });
    service.delete('kX7ZJ@example.com');
    expect(service.getAll().length).toEqual(0);
  })
});
