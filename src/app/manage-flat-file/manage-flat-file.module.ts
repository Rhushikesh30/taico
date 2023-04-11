import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadFlatFileComponent } from './download-flat-file/download-flat-file.component';
import {ManageFlatFileRoutingModule} from './manage-flat-file-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {UploadFlatFileComponent} from './upload-flat-file/upload-flat-file.component'

@NgModule({
  declarations: [
    DownloadFlatFileComponent,
    UploadFlatFileComponent
  ],
  imports: [
    ManageFlatFileRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule,
    MatButtonModule
  ]
})
export class ManageFlatFileModule { }
