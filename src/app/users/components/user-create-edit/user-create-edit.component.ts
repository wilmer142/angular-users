import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from '../../interfaces/user';
import { UserAction } from '../../interfaces/user-action';
import { UserActionEnum } from '../../enums/user-action.enum';

@Component({
  selector: 'app-user-create-edit',
  templateUrl: './user-create-edit.component.html',
  styleUrls: ['./user-create-edit.component.css']
})
export class UserCreateEditComponent implements OnInit {
  public userActionEnum = UserActionEnum;

  constructor(public dialogRef: MatDialogRef<UserCreateEditComponent>, @Inject(MAT_DIALOG_DATA) public data: UserAction) {
    this.data.user = !this.data.user 
    ? {
      user: '',
      names: '',
      surnames: '',
      email: '',
      isActive: true
    } 
    : this.data.user
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
