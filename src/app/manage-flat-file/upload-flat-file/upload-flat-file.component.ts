import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { UploadFileService } from 'src/app/core/service/upload-file.service'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-flat-file',
  templateUrl: './upload-flat-file.component.html',
  styleUrls: ['./upload-flat-file.component.scss']
})
export class UploadFlatFileComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  renderedData: UploadFlatFile[];
  selectedFile: File;
  uploadFileForm: FormGroup;
  uploadData: FormData;
  BTN_VAL = 'Upload';
  flat_files: any;
  file_id: any
  flat_file_names: any[] = [];
  submitted = false
  showLoader = false
  showUploadLoader=false
  percentDone: any = "";
  sizeUploaded: any = "";
  fileSize: any;
  uploadingDone: any = "";
  fileName: any;
  submitDisabled = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  selectedFlatFile
  constructor(private router: Router, private formBuilder: FormBuilder, private uploadFileService: UploadFileService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.uploadFileForm = this.formBuilder.group({
      file_id: [''],

    });

    // this.UploadFileService.getFileNameAsperID().subscribe(data => {
    //   this.flat_file_names = data
    // })
    this.uploadFileService.getFileNameAsperID().subscribe({
      next: function (value) {
        this.flat_file_names = value;
        if (this.flat_file_names) {
          this.selectedFlatFile = value[0].id
        }
      }.bind(this),
      error: function (err) {
        this.showErrorMessage(err)
      }.bind(this),
    })
  }



  onFileSelected(event) {
    let formData = new FormData();
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile['name'];
    // Check if the selected file has a .txt extension
    if (this.selectedFile.type === "text/plain") {
      this.file_id = this.uploadFileForm.get('file_id').value;
      formData.append('file_id', this.file_id);
      formData.append('flat_files', this.selectedFile);
      this.uploadData = formData;
      this.submitDisabled = false;
    } else {
      // Display an error message if the selected file is not a .txt file
      this.showSnakBar('Please select a .txt file')
      this.selectedFile = null;
      this.fileName = '';
      this.submitDisabled = true;
    }
  }



  onSubmit() {
    this.submitted = true;
    if (this.uploadFileForm.invalid) {
      return;
    }
    else {

      this.percentDone = "0";
      this.sizeUploaded = "0";
      this.showUploadLoader=true
      this.uploadFileService.uploadFile(this.uploadData).subscribe({
        next: (data: any) => {
          if (data.type === HttpEventType["UploadProgress"]) {
            const sizeDone = (data.loaded / 1024).toFixed(2);
            this.percentDone = Math.round((100 * data.loaded) / data.total);
            this.fileSize = (data.total / 1024).toFixed(2);
            this.sizeUploaded = sizeDone;
            if (this.sizeUploaded == this.fileSize) {
              this.uploadingDone = "Completed !";
              setTimeout(() => {
                this.sizeUploaded = "";
                this.fileName = "";
                this.fileSize = "";
              }, 5000);
            }
          }
          if (data['body']['status'] == 'success') {
            // Swal.fire({
            //   title: 'File Uploaded Successfully!',
            //   icon: 'success',
            //   timer: 2000,
            //   showConfirmButton: false
            // });
            this.showSnakBar('File Uploaded Successfully!')
            this.submitted = false;
            this.submitDisabled = true;
            this.showUploadLoader=false
            this.fileInput.nativeElement.value = null
            this.uploadingDone = "";
            // this.router.navigate(['/Flat-file/upload-flat-file']).then(() => {
            // setTimeout(function() {window.location.reload();} , 2000);
            // });
          }
          // }
        },
        error: (error: any) => {
          this.showUploadLoader=false
          this.showSnakBar('Something went Wrong !!')
        }
      });
    }
  }

  sendToPSB(): void {
    this.showLoader = true
    this.uploadFileService.sendToPSbOnline().subscribe({
      next: function (value) {
        if ('message' in value)
        {
          this.showSnakBar(value.message)
        }
      }.bind(this),
      complete: function () {
        this.showLoader = false
      }.bind(this),
      error: function (err) {
        this.showLoader = false
        this.showErrorMessage(err)
      }.bind(this),
    })
  }

  showErrorMessage(err): void {
    let error_message = 'Something went wrong'
    let error = JSON.parse(err)
    if ('error' in error.error) {
      error_message = error.error.error
    }
    this.showSnakBar(error_message)
  }

  showSnakBar(message__): void {
    this._snackBar.open(message__, 'Okay', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000
    },)
  }
}



export interface UploadFlatFile {
  file_id: any
}
