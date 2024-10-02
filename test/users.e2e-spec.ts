import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '@/users/users.module';
import { PostgreSQLDbService } from '@/db/postgre-sql-db.service';
import { InMemoryDbService } from '@/db/in-memory-db.service';
import { User } from '@/users/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let user: User;
  const service = new InMemoryDbService()

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).overrideProvider(PostgreSQLDbService).useValue(service)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET  /users - should return an epmpty array', async () => {
    return await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([]);
  });

  it('POST /users - should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'zBqFP@example.com' })
      .expect(201)
    user = response.body;
    expect(user.email).toEqual('zBqFP@example.com');


  })

  it('GET  /users - should return an array with one user', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([user]);
  });

  it('DELETE /users - should delete a user', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${user.email}`)
      .expect(200);
    await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([]);
  });


});
