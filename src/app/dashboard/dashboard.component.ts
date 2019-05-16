import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {Sort} from '@angular/material';
import { RequestService } from '../request.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { FileUploader } from 'ng2-file-upload';

declare let jsPDF;


interface Task {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  estimatedHours: number;
  actualHours: number;
  attachments: number;
  status: string;
  created: string;
  updated: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private request: RequestService,
    public snackBar: MatSnackBar,
    public router: Router,
  ) {
    auth.isAuthenticated();
    this.uploader = new FileUploader({
      url: 'http://localhost:3000/task/import/csv',
      method: 'POST',
      authTokenHeader: 'Authorization',
      authToken: `Bearer ${this.auth.get('token')}`,
    });
  }

  sortedData: Task[] = [];
  tasks: Task[] = [];
  uploader;
  searchKeyword;

  sortData(sort: Sort) {
    const data = this.tasks.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        // case 'startDate': return compare(a.startDate, b.startDate, isAsc);
        // case 'endDate': return compare(a.endDate, b.endDate, isAsc);
        case 'estimatedHours': return compare(a.estimatedHours, b.estimatedHours, isAsc);
        case 'actualHours': return compare(a.actualHours, b.actualHours, isAsc);
        // case 'created': return compare(a.created, b.created, isAsc);
        // case 'updated': return compare(a.updated, b.updated, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  filterResults() {
    this.sortedData = [];
    this.tasks.map( (value, key) => {
      if (value.name.toLocaleLowerCase().indexOf(this.searchKeyword.toLocaleLowerCase()) !== -1) {
        this.sortedData.push(value);
      }
    });
  }

  listTask() {
    this.request.listTask()
    .subscribe(
      (response: any) => {
        console.log('response', response);
        if (response.status === 'success') {
          response.result.map((result, key) => {
            result.startDate = moment(result.startDate).format('MM/DD/YYYY');
            result.endDate = moment(result.endDate).format('MM/DD/YYYY');
            result.updatedAt = moment(result.updatedAt).format('MM/DD/YYYY');
            result.createdAt = moment(result.createdAt).format('MM/DD/YYYY');
          });
          localStorage.setItem('tasks', JSON.stringify(response.result));
          this.tasks = response.result;
          this.sortedData = this.tasks.slice();
        }
      },
      (error) => {
        console.log('error', error);
        const err = error.message ? error.message : 'Something went wrong';
        console.log(err);
      }
    );
  }

  deleteTask(taskId: string) {
    console.log('messageID', taskId);
    this.request.deleteTask(taskId)
    .subscribe(
      (response: any) => {
        console.log('response', response);
        if (response.status === 'success') {
          this.tasks.map((value, key) => {
            if (value._id === taskId) {
              delete this.tasks[key];
            }
          });

          this.sortedData = this.tasks.slice();

          this.snackBar.open('Task Deleted Successfully.', 'OK', {
            duration: 3000,
          });
        }
      },
      (error) => {
        console.log('error', error);
        const err = error.message ? error.message : 'Something went wrong';
        console.log(err);
      }
    );
  }

  ngOnInit() {
    this.listTask();
  }

  navigateEditTask(taskId) {
    this.router.navigate(['/task/edit/' + taskId]);
  }

  exportCSV() {
    console.log(this.tasks);

    const  options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Tasks',
        useBom: true,
        noDownload: false,
        headers: [
          'name',
          'startDate',
          'endDate',
          'estimatedHours',
          'actualHours',
          'attachments',
          'status',
          'createdAt',
          'updatedAt'
        ],
    };

    const exportData: any = this.tasks.map(a => ({...a}));

    exportData.map((value: any, key) => {
      delete exportData[key]._id;
      delete exportData[key].userId;
      delete exportData[key].__v;
    });
    console.log(this.tasks);
   const exportResult = new Angular5Csv(exportData, 'Tasks' + moment().unix() + '.xls' , options);
  }

  importCSVFile() {

      this.uploader.uploadAll();
      this.uploader.onSuccessItem = (item: any, response: any, status: number, headers: any): any => {
        if (response) {
          console.log('response importCSVFile', response);
          response = JSON.parse(response);
          this.listTask();
          this.snackBar.open(response.data + ' tasks imported', 'OK', {
            duration: 3000,
          });
        }
      };

      this.uploader.onErrorItem = (item: any, response: any, status: number, headers: any): any => {
        if (response) {
          console.log(response);
          response = JSON.parse(response);
          this.snackBar.open(response.message, 'OK', {
            duration: 10000,
          });
        }
      };
  }

  exportPDF() {
    const columns = [
      {title: 'Name', dataKey: 'name'},
      {title: 'Start Date', dataKey: 'startDate'},
      {title: 'End Date', dataKey: 'endDate'},
      {title: 'Estimated Hours', dataKey: 'estimatedHours'},
      {title: 'Actual Hours', dataKey: 'actualHours'},
      {title: 'Attachments', dataKey: 'attachments'},
      {title: 'Status', dataKey: 'status'},
      {title: 'Created At', dataKey: 'createdAt'},
      {title: 'Updated At', dataKey: 'updatedAt'}
    ];
    const exportData: any = this.tasks.map(a => ({...a}));

    exportData.map((value: any, key) => {
      delete exportData[key]._id;
      delete exportData[key].userId;
      delete exportData[key].__v;
    });

    const doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, exportData, {
      cellPadding: 10, // a number, array or object (see margin below)
        fontSize: 7,
        font: 'helvetica', // helvetica, times, courier
        lineColor: 200,
        lineWidth: 0,
        fontStyle: 'normal', // normal, bold, italic, bolditalic
        overflow: 'ellipsize', // visible, hidden, ellipsize or linebreak
        fillColor: false, // false for transparent or a color as described below
        textColor: 20,
        halign: 'left', // left, center, right
        valign: 'middle', // top, middle, bottom
        columnWidth: 0 // 'auto', 'wrap' or a number
    });

    doc.save('Tasks' + moment().unix() + '.pdf');
  }

}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
