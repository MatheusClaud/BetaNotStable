import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token/token-service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService)
  const token = tokenService.getToken()
  if (token != null) {
    const newReqData = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })

    return next(newReqData)
  } else {
    return next(req)
  }
};
