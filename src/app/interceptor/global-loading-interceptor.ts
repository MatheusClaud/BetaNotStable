import {
  HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest
} from '@angular/common/http';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { GlobalStateService } from '../services/state/global-state-service';
import { inject } from '@angular/core';

export const globalLoadingInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const gsService = inject(GlobalStateService);
  gsService.setLoadingVisibility(true);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      return throwError(() => error);
    }),
    finalize(() => {
      gsService.setLoadingVisibility(false);
    })
  );
};