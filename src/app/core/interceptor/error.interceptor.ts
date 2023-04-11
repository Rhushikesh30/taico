import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  handleError(error: HttpErrorResponse){
    return throwError(()=> JSON.stringify(error));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): 
  Observable<HttpEvent<any>>{
    return next.handle(req)
    .pipe(
      catchError(this.handleError)
    )
  };
}

