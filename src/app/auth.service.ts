import { AuthenticationClient, GetCurrentUserRequest, GetCurrentUserResponse } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@aneoconsultingfr/armonik.api.angular';

@Injectable()
export class UserGrpcService {
  constructor(
    private _authenticationService: AuthenticationClient,
  ) {}
  /**
   *@returns an Observable<GetCurrentUserResponse> fetching a user
   */
  getUser$(): Observable<GetCurrentUserResponse> {
    const request = new GetCurrentUserRequest();
    return this._authenticationService.getCurrentUser(request);
  }
}

@Injectable()
export class UserService {
  user!: User.AsObject;
}
