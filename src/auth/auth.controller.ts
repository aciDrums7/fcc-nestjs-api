import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDto } from 'src/dtos';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signup(@Body() signUpDto: AuthDto) {
        return this.authService.signup(signUpDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() signInDto: AuthDto) {
        return this.authService.login(signInDto);
    }
}
