import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
 

  constructor(private http: HttpClient) { }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => new Error((JSON.parse(error.toString())) || "Server Error"));
  }


  getFileNameAsperID(){
    return this.http.get<any[]>(`${environment.apiUrl}/upload-flat-file/`);
  }

  
  uploadFile(uploadData: FormData) {
    return this.http.post(`${environment.apiUrl}`.concat('/upload-flat-file/'), uploadData,{reportProgress: true,observe: "events"})
      .pipe(map(data => {
        return data;
      }),
        catchError(this.errorHandler)
      )
  }
  sendToPSbOnline()
  {
    return this.http.post(`${environment.apiUrl}`.concat('/send-data/'),{})
  }

}
