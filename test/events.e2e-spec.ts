import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '@/users/users.module';
import { DbService } from '@/db/db.service';
import { InMemoryDbService } from '@/db/in-memory-db.service';
import { User } from '@/users/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let user: User;
  //const service = new InMemoryDbService()

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })//.overrideProvider(DbService).useValue(service)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  it('SETUP USER', () => {

    request(app.getHttpServer())
      .post('/users')
      .send({ email: 'zBqFP@example.com' })
      .expect((response) => {
        user = response.body;
      })
  })

  it('GET  /users - should have no consents', () => {
    expect(user.consents.length).toEqual(0)
  })

  it('POST /events - should create an event', () => {
    request(app.getHttpServer())
      .post('/events')
      .send({
        user: { id: user.id }, consents: [
          {
            id: "email_notifications",
            enabled: true
          }
        ]
      })
      .expect(201)
      .expect((response) => {
        console.log(response.body)
        expect(response.body.user.id).toEqual(user.id)
        expect(response.body.consents.length).toEqual(1)
        expect(response.body.consents[0].id).toEqual("email_notifications")
        expect(response.body.consents[0].enabled).toEqual(true)
      })
  })

  it('POST /events - should create two new events', () => {
    request(app.getHttpServer())
      .post('/events')
      .send({
        user: { id: user.id }, consents: [
          {
            id: "email_notifications",
            enabled: false
          },
          {
            id: "sms_notifications",
            enabled: true
          }
        ]
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.user.id).toEqual(user.id)
        expect(response.body.consents.length).toEqual(2)
        expect(response.body.consents[0].id).toEqual("email_notifications")
        expect(response.body.consents[0].enabled).toEqual(false)
        expect(response.body.consents[1].id).toEqual("sms_notifications")
        expect(response.body.consents[1].enabled).toEqual(true)
      })

  })



});
