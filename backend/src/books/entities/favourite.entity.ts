import { Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
import { UserEntity } from 'src/auth/entities/user.entity'
import { BookEntity } from './book.entity'

@Entity('favourite')
export class FavouriteEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity

  @ManyToOne(() => BookEntity, { onDelete: 'CASCADE' })
  book: BookEntity

  @CreateDateColumn()
  createdAt: Date
}