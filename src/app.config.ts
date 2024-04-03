import { catchError, tap } from "rxjs";
import { UserGrpcService, UserService } from "./app/auth.service";
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { GrpcCoreModule } from "@ngx-grpc/core";
import { GrpcWebClientModule } from "@ngx-grpc/grpc-web-client";
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ ClientSideRowModelModule ])

function initializeAppFactory(userGrpcService: UserGrpcService, userService: UserService) {
  return () => userGrpcService.getUser$().pipe(
    tap((data) => {
      if (!data.user) {
        throw new Error('No user');
      }
      userService.user = data.user;
    }),
    catchError((err) => {
      throw err;
    })
  )
}

export const appConfig: ApplicationConfig = {
  providers: [
    UserGrpcService,
    UserService,
    {
      provide: Window,
      useValue: window
    },
    {
      provide: Storage,
      useValue: localStorage
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [UserGrpcService, UserService],
      multi: true
    },
    importProvidersFrom(GrpcCoreModule.forRoot()),
    importProvidersFrom(GrpcWebClientModule.forRoot({ settings: { host: '' } }))
  ]
};