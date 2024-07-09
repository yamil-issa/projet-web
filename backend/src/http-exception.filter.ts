import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();

    const response = ctx.res;
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
    });
  }
}
