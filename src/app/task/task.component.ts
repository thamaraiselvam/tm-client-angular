import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { RequestService } from '../request.service';
import { MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  name;
  startDate;
  _startDate;
  _endDate;
  endDate;
  estimatedHours;
  actualHours;
  tasks;
  date;
  isUpdate = false;
  selectedTask;
  selectedOption = '';

  constructor(
    private auth: AuthService,
    private request: RequestService,
    public snackBar: MatSnackBar,
    private router: Router,
    private activeRoute:  ActivatedRoute
  ) {
    console.log(activeRoute.snapshot.data.edit);
    if (!activeRoute.snapshot.data.edit) {
      this.isUpdate = false;
      this.showFreshForm();
    }
  }

  showEditForm(taskId) {

    this.tasks = localStorage.getItem('tasks');
    this.tasks = JSON.parse(this.tasks);

    this.selectedTask = this.tasks.find( task => task._id === taskId );

    this.name = new FormControl(this.selectedTask.name  , [Validators.required]);
    this._startDate = new FormControl(moment(this.selectedTask.startDate).format());
    this._endDate = new FormControl(moment(this.selectedTask.endDate).format());
    this.endDate = new FormControl(this.selectedTask.endDate, [Validators.required]);
    this.estimatedHours = new FormControl(this.selectedTask.estimatedHours, [Validators.required]);
    this.actualHours = new FormControl(this.selectedTask.actualHours, [Validators.required]);
    this.selectedOption = this.selectedTask.status;
  }

  showFreshForm() {
    this.name = new FormControl(Math.random().toString(36).substring(7)  , [Validators.required]);
    this._startDate = new FormControl(moment().add(4, 'days').format());
    this._endDate = new FormControl(moment().add(Math.floor(Math.random() * 25), 'days').format());
    this.estimatedHours = new FormControl(Math.floor(Math.random() * 500), [Validators.required]);
    this.actualHours = new FormControl(Math.floor(Math.random() * 500), [Validators.required]);
  }

  getErrorMessage(input: string) {
    switch (input) {
      case 'name':
        return this.name.hasError('required') ? 'You must enter a value' : '';
      // case 'startDate':
        // return this.startDate.hasError('required') ? 'You must enter a value' : '';
      case 'endDate':
        return this.startDate.hasError('required') ? 'You must enter a value' : '';
      case 'actualHours':
        return this.actualHours.hasError('required') ? 'You must enter a value' : '';
      case 'estimatedHours':
        return this.estimatedHours.hasError('required') ? 'You must enter a value' : '';
    }
  }

  addTask(name: string, startDate: string, endDate: string, actualHours: string, estimatedHours: string, attachments: string) {
    startDate = moment(startDate).format('MM/DD/YYYY');
    endDate = moment(endDate).format('MM/DD/YYYY');
    this.request.addTask(name, startDate, endDate, actualHours, estimatedHours, attachments)
      .subscribe(
        (response) => {
          if (response.status === 'success') {
            this.snackBar.open('New Task Added successfully.', 'OK', {
              duration: 3000,
            });
            this.router.navigate(['user/dashboard']);
          }
        },
        (error) => {
          this.snackBar.open(error.message, 'OK', {
            duration: 10000,
          });
        }
      );
  }

  updateTask(name: string, startDate: string, endDate: string, actualHours: string, estimatedHours: string, attachments: string) {
    startDate = moment(startDate).format('MM/DD/YYYY');
    endDate = moment(endDate).format('MM/DD/YYYY');
    this.request.updateTask(this.selectedTask._id, name, startDate, endDate, actualHours, estimatedHours, this.selectedOption, attachments)
      .subscribe(
        (response) => {
          if (response.status === 'success') {
            this.snackBar.open('Task Updated successfully.', 'OK', {
              duration: 3000,
            });
            this.router.navigate(['user/dashboard']);
          }
        },
        (error) => {
          this.snackBar.open(error.message, 'OK', {
            duration: 10000,
          });
        }
      );
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (this.activeRoute.snapshot.data.edit) {
          const taskId = params['taskId'];
          this.isUpdate = true;
          this.showEditForm(taskId);
        } else {
          this.showFreshForm();
        }
    });
  }

}
