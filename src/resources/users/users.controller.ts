import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/decorators';
import { EditUserDto } from 'src/dtos';
import { JwtGuard } from 'src/guards';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('')
    getAllUsers() {
        //? user object is appended by the validate method in the jwt strategy impl
        return this.usersService.getAllUsers();
    }

    //? the value passed to the AuthGuard refers to the Passport strategy to use
    //5 (in the implementation of a strategy, we pass a string value, in this case 'jwt')
    @Get('currentUser')
    getCurrentUser(@GetUser('') user: Express.User) {
        //? user object is appended by the validate method in the jwt strategy impl
        return user;
    }

    @Patch()
    editUser(@GetUser('sub') userId: number, @Body() userDto: EditUserDto) {
        return this.usersService.editUser(userId, userDto);
    }
}
