import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(private http: HttpClient) { }
  getTenants()
  {
    return this.http.get<any[]>(`${environment.apiUrl}/tenant/`);
  }
  getEndpoints(params){
    return this.http.get<any[]>(`${environment.apiUrl}/api_endpoints/`,{params:params});
  }
  getLogs(params){
    return this.http.get<any[]>(`${environment.apiUrl}/logs/`,{params:params});
  }
  getLogDetails(log_id){
    return this.http.get<any[]>(`${environment.apiUrl}/logs/${log_id}/`,);
  }
}
