import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'

import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { UserformMasterElement } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<UserformMasterElement[]> {
    return this.httpClient.get<UserformMasterElement[]>(`${environment.apiUrl}/user/`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  create(formValue): Observable<UserformMasterElement[]> {
    const id = formValue.id
    if (id) {
      return this.httpClient.put<UserformMasterElement[]>(`${environment.apiUrl}/user/${id}/`, formValue)
      .pipe(
        map(data => {
          data['status'] = 1;
          return data;
        }),
        catchError(this.errorHandler)
      )
    }
    else{
      return this.httpClient.post<UserformMasterElement[]>(`${environment.apiUrl}/user/`,formValue)
      .pipe(
        map(data => {
          data['status'] = 2;
          return data;
        }),
        catchError(this.errorHandler)
      )
    }
  }

  delete(id) {
    return this.httpClient.delete<UserformMasterElement[]>(`${environment.apiUrl}/user/${id}/`,id);
  }

  errorHandler(error:HttpErrorResponse) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error.status} Server Error`;
    }
    return throwError(errorMessage);
 }
 getUserFormData(company_id) {
  return this.httpClient.get(`${environment.apiUrl}/employee/`, {params:{company_id}});
}

}

