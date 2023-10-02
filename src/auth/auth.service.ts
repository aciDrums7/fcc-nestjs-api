import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
    signup() {
        return { msg: `I'm signed up` };
    }

    login() {
        return { msg: `I've logged in` };
    }
}
