import {
  HttpErrorResponse,
    HttpEvent,
    HttpEventType,
    HttpProgressEvent,
    HttpResponse
  } from "@angular/common/http";
  import { Observable,throwError} from "rxjs";
  import { distinctUntilChanged, scan,catchError} from "rxjs/operators";
  
  function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
    return event.type === HttpEventType.Response;
  }
 
  function isHttpProgressEvent(
    event: HttpEvent<unknown>
  ): event is HttpProgressEvent {
    return (
      event.type === HttpEventType.DownloadProgress ||
      event.type === HttpEventType.UploadProgress
    );
  }
  
  export interface Download {
    content: Blob | null;
    progress: number;
    state: "PENDING" | "IN_PROGRESS" | "DONE";
  }
  
  export function download(
    saver?: (b: Blob,filename:string) => void
  ): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
    return (source: Observable<HttpEvent<Blob>>) =>
      source.pipe(
        scan(
          (download: Download, event): Download => {
            if (isHttpProgressEvent(event)) {
              if (event.loaded!=event.total)
              {
                return {
                    progress: Math.round((100 * event.loaded) / event.total),
                    state: "IN_PROGRESS",
                    content: null
                  };
              }
            }
            if (isHttpResponse(event)) {
              if (saver) {
                saver(event.body,event.headers.get('content-disposition'));
              }
              return {
                progress: 100,
                state: "DONE",
                content: event.body
              };
            }
            return download;
          },
          { state: "PENDING", progress: 0, content: null }
        ),
        distinctUntilChanged((a, b) => a.state === b.state
          && a.progress === b.progress
          && a.content === b.content
        ),
      );
  }
  