import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/decorators';
import { JwtGuard } from 'src/guards';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    //? the value passed to the AuthGuard refers to the Passport strategy to use
    //5 (in the implementation of a strategy, we pass a string value, in this case 'jwt')
    @Get('currentUser')
    getCurrentUser(@GetUser('') user: Express.User) {
        //? user object is appended by the validate method in the jwt strategy impl
        return user;
    }
}
