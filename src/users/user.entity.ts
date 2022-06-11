import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  BeforeInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Report, (report) => report.user, {
    // eager: true, // eager loading 예시
  })
  reports: Promise<Report[]>; // lazy loading 예시

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @BeforeInsert()
  checkEmail() {
    //  email validation
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
