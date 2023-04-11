import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DownloadFlatFileComponent} from './download-flat-file/download-flat-file.component'
import {UploadFlatFileComponent} from './upload-flat-file/upload-flat-file.component'


const routes: Routes = [
  {
    path: '',
    redirectTo: 'download-flat-file',
    pathMatch: 'full'
  },
  {
    path: 'download-flat-file',
    component: DownloadFlatFileComponent
  },
  {
    path: 'upload-flat-file',
    component: UploadFlatFileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageFlatFileRoutingModule {}
