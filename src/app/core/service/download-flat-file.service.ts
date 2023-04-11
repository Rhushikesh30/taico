import { HttpClient} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { download,Download } from 'src/app/shared/downloader/download';
import {SAVER, Saver} from 'src/app/shared/downloader/saver'
import { environment } from 'src/environments/environment'; 
import {DownloadFlatFile} from 'src/app/core/models/DownloadFlatFile'
@Injectable({
  providedIn: 'root'
})
export class DownloadFlatService {

  constructor(
    private http : HttpClient,
    @Inject(SAVER) private save: Saver
    ) { 

  }

  download(data):Observable<Download>{
    return this.http.post(`${environment.apiUrl}/download-flat-file/`,data, {reportProgress: true,observe: 'events',responseType: 'blob'}).pipe(download((blob,filename) => this.save(blob,filename)))
  }
  get_file_names():Observable<DownloadFlatFile>
  {
    return this.http.get<any>(`${environment.apiUrl}/download-flat-file/`)
  }
}

