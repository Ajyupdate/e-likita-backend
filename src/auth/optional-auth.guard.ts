import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to not throw an error when no user is found
  handleRequest(err: any, user: any) {
    // Return user if found, otherwise return null (no error thrown)
    return user || null;
  }
}
