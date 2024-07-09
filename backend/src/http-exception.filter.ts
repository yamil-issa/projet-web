import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();

    if (context.req) {
      // Handling HTTP requests
      const response = context.req.res;
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        success: false,
        message: exception.message,
      });
    } else {
      // Handling GraphQL requests
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        success: false,
        message: exception.message,
      };
    }
  }
}