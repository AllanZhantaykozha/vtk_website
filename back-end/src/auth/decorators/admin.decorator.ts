import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const IsAdmin = createParamDecorator(
    (data: null, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const admin = request.admin

        return admin ? true : false
    }
) 