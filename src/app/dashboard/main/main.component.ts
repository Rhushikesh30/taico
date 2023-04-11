import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LogsService } from 'src/app/core/service/logs.service'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Logs } from 'src/app/core/models/logs'
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  apiLogForm: FormGroup
  selectedTenantName: any
  selectedEndPointName: any
  currentDate
  previousDate
  showUploadLoader = false
  isTableVisible=false
  timezone = 'IST'
  datepipe = new DatePipe("en-US")
  tenants = []
  endpoints = []
  @ViewChild('logSourcePaginator', { read: MatPaginator }) logSourcePaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  logDataSource: MatTableDataSource<Logs>;
  logColumns = [
    "actions",
    "id",
    "status",
    "created_date_time"
  ]
  paginatorCount = 0
  pageSize = 10;
  currentPage = 0;
  constructor(private formBuilder: FormBuilder, private logService: LogsService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    let curdate = new Date()
    this.currentDate = this.datepipe.transform(curdate, 'yyyy-MM-dd HH:mm:ss', this.timezone);
    curdate.setDate(curdate.getDate() - 1)
    this.previousDate = this.datepipe.transform(curdate, 'yyyy-MM-dd HH:mm:ss', this.timezone)
    this.apiLogForm = this.formBuilder.group({
      tenant_id: [, Validators.required],
      endpoint_id: [, Validators.required],
      from_date: [this.previousDate, Validators.required],
      to_date: [this.currentDate, Validators.required],
    });
    this.logService.getTenants().subscribe(
      {
        next: function (value) {
          this.tenants = value
          if (this.tenants) {
            this.selectedTenantName = value[0].id
            this.setEndpoints(this.selectedTenantName)
          }
        }.bind(this),
      })
    this.apiLogForm.get('tenant_id').valueChanges.subscribe({
      next: function (value) {
        this.setEndpoints(value)
      }.bind(this),
    })
  }

  setEndpoints(tenant_id): void {
    this.logService.getEndpoints({ tenant_id: tenant_id }).subscribe(
      {
        next: function (value) {
          this.endpoints = value
          this.selectedEndPointName = value[0].id
        }.bind(this),
      })
  }
  getLogs(): void {
    let params = { ...this.apiLogForm.value, ...{ page: this.currentPage + 1, page_size: this.pageSize } }
    this.logService.getLogs(params).subscribe({
      next: function (value) {
        this.addDataToDataSource(value)
      }.bind(this)
    })
  }
  onSubmit(): void {
    this.apiLogForm.patchValue({ from_date: this.datepipe.transform(this.apiLogForm.value.from_date, 'yyyy-MM-dd HH:mm:ss'), to_date: this.datepipe.transform(this.apiLogForm.value.to_date, 'yyyy-MM-dd HH:mm:ss') })
    this.getLogs()
  }
  addDataToDataSource(data: any): void {
    this.paginatorCount = data.count
    if (this.logDataSource == undefined) {
      this.logDataSource = new MatTableDataSource(data.results);
    }
    else {
      this.logDataSource.data = data.results
    }
    if(this.logDataSource.data.length>0)
    {
     this.isTableVisible=true
    }
    else
    {
      this.isTableVisible=false
    }
    this.logDataSource.paginator = this.logSourcePaginator;
    this.logDataSource.sort = this.sort;
    setTimeout(() => {
      this.logSourcePaginator.pageIndex = this.currentPage;
      this.logSourcePaginator.length = data.count;
    });
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getLogs()
  }
  getLogAction(value, is_view): void {
    this.logService.getLogDetails(value.id).subscribe(
      {
        next: function (data) {
          if (is_view) {
            var tab = window.open('about:blank', '_blank');
            tab.document.write(data[0].error_message.replaceAll('\n','<br>')); 
            tab.document.close();
          }
          else {
            const blob = new Blob([data[0].error_message], { type: 'application/octet-stream' });
            const anchor = document.createElement('a');
            anchor.download = "log_"+value.id+".txt";
            anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
            anchor.click();
          }
        }.bind(this)
        ,
      })
  }
}
