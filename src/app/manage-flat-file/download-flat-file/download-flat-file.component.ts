import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DownloadFlatService } from 'src/app/core/service/download-flat-file.service'
import { Observable } from 'rxjs';
import { Download } from 'src/app/shared/downloader/download'
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';



@Component({
  selector: 'app-download-flat-file',
  templateUrl: './download-flat-file.component.html',
  styleUrls: ['./download-flat-file.component.scss']
})
export class DownloadFlatFileComponent implements OnInit {
  transactionFormGroup: FormGroup;
  showLoader: boolean = false
  download: Observable<Download>
  flatFileObservable: Observable<any>
  progress = 0
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  fileNames: [];
  selectedFlatFile
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private formBuilder: FormBuilder, private downloadFlatFileService: DownloadFlatService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.transactionFormGroup = this.formBuilder.group({
      file_id: [, [Validators.required]],
    })
    this.downloadFlatFileService.get_file_names().subscribe({
      next: function (value) {
        this.fileNames = value;
        if (this.fileNames) {
          this.selectedFlatFile = value[0].id
        }
      }.bind(this),
      error:function(err) {
        let error_message = 'Something went wrong'
        let error = JSON.parse(err)
        if ('error' in error.error) {
          error_message = error.error.error
        }
        this.showSnakBar(error_message)
      }.bind(this),
    })
  }
  onSubmit(): void {
    let self = this
    if (self.transactionFormGroup.invalid) {
      return
    }
    self.download = this.downloadFlatFileService.download(this.transactionFormGroup.value)
    self.download.subscribe({
      next(value) {

        self.progress = value.progress
      },
      complete() {
        setTimeout(() => {
          self.progress = 0
        }, 5000);
      },
      error(err) {
        let error = JSON.parse(err)
        let error_message = 'Something went wrong'
        if(error.status==404)
        {
          error_message='File Not Found'
        }
        else if (error.status==400)
        {
          error_message = 'Flat File Configration not done'
        }
        self.showSnakBar(error_message)
      },
    })

  }
  onCancelForm() {
    // this.transactionFormGroup.reset();
    this.progress = 0
  }
  showSnakBar(message__):void {
    this._snackBar.open(message__, 'Okay', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000
    },)
  }
}
