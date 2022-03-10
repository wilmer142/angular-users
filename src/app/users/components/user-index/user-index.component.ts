import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { User } from '../../interfaces/user';
import { UserCreateEditComponent } from '../user-create-edit/user-create-edit.component';
import { UserActionEnum } from '../../enums/user-action.enum';
import { UserAction } from '../../interfaces/user-action';

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.css'],
})
export class UserIndexComponent implements OnInit {
  userIndexForm: FormGroup;
  searchSubject = new Subject<User>();
  createSubject = new Subject<UserAction>();


  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.userIndexForm = this.formBuilder.group({
        email: '',
        user: '',
        names: '',
        surnames: '',
    });
  }

  ngOnInit() {}

  search() {
    const searchParams: User = Object.assign({}, this.userIndexForm.getRawValue());
    this.searchSubject.next(searchParams);
  }

  openCreateUser() {
    const dialogRef = this.dialog.open(UserCreateEditComponent, {
        width: '800px',
        data: { action: UserActionEnum.Create, user: undefined }
    });
  
    dialogRef.afterClosed().subscribe((result: UserAction) => {
        if (result) {
            this.createSubject.next(result);
        }
    });
  }
}
