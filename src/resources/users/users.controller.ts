import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtGuard } from 'src/guards';

@Controller('users')
export class UsersController {
    //? the value passed to the AuthGuard refers to the Passport strategy to use
    //5 (in the implementation of a strategy, we pass a string value, in this case 'jwt')
    @UseGuards(JwtGuard)
    @Get('currentUser')
    getCurrentUser(@Request() req) {
        //? user object is appended by the validate method in the jwt strategy impl
        return req.user;
    }
}
