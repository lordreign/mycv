import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('signup request', () => {
    const email = 'asdf@asdf.com';
    return (
      request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email,
          password: 'asdf',
        })
        .expect(201)
        // 응답
        .then((res) => {
          const { id, email } = res.body;
          expect(id).toBeDefined();
          expect(email).toEqual(email);
        })
    );
  });

  it('signup new user 그리고 whoami 호출', async () => {
    const email = 'asdf@asdf.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'asdf',
      })
      .expect(201);
    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(email);
  });
});
