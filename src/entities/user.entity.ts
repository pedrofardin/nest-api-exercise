import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'character varying' })
  name: string;

  @Column({ name: 'password', type: 'character varying' })
  password: string;

  @Column({ name: 'email', type: 'character varying' })
  email: string;

  @Column({ name: 'balance', type: 'numeric' })
  balance: number;
}