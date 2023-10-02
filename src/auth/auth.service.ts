import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
    signup() {
        return { msg: `I'm signed up` };
    }

    login() {
        const newLocal = `I'm logged in`;