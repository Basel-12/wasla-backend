import { User } from '../../../modules/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_favorite_words' })
export class FavoriteWords {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    word: string;

    @ManyToOne(() => User, (user) => user.favoriteWords)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
