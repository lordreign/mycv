import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

// test 시작할때 test db 삭제
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

// test 후
global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});
