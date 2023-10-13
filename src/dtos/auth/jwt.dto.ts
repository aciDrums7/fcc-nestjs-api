import { IsNotEmpty } from 'class-validator';

export class JwtDto {
    constructor(accessToken: string) {
        this.access_token = accessToken;
    }

    @IsNotEmpty()
    access_token: string;
}
