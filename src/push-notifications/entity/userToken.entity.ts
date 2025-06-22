import { User } from 'src/user/entity/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity({ name: 'user_tokens' })
export class UserToken {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.user_tokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' }) // Este será el nombre de la columna en la DB
    user: User;

    @Column('text')
    token: string;
}
