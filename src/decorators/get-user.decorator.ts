import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx?: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        if (request.user[data]) return { [data]: request.user[data] };
        return request.user;
    },
);
