import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fetch from 'node-fetch';
import { UserToken } from './entity/userToken.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class PushNotificationsService {
    constructor(
        @InjectRepository(UserToken)
        private readonly userTokenRepository: Repository<UserToken>,
    ) { }

    async saveToken(userId: number, token: string): Promise<void> {
        // Evitar guardar duplicados exactos
        const exists = await this.userTokenRepository.findOne({
            where: {
                user: { id: userId },
                token,
            },
            relations: ['user'],
        });

        if (!exists) {
            const user = new User();
            user.id = userId;

            const newToken = this.userTokenRepository.create({ user, token });
            await this.userTokenRepository.save(newToken);
        }
    }

    async removeToken(userId: number, token: string): Promise<void> {
        await this.userTokenRepository.delete({
            user: { id: userId },
            token,
        });
    }

    async getTokensByUser(userId: number): Promise<string[]> {
        const tokens = await this.userTokenRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        return tokens.map((t) => t.token);
    }

    async sendNotification(token: string, title: string, body: string, data = {}): Promise<void> {
        if (!token.startsWith('ExponentPushToken')) return;

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: token,
                title,
                body,
                sound: 'default',
                data,
            }),
        });
    }

    async sendNotificationToUser(userId: number, title: string, body: string, data = {}): Promise<void> {
        const tokens = await this.getTokensByUser(userId);
        for (const token of tokens) {
            await this.sendNotification(token, title, body, data);
        }
    }
}
