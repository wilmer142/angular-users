import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { UserActionEnum } from '../../enums/user-action.enum';
import { User } from '../../interfaces/user';
import { UserAction } from '../../interfaces/user-action';
import { UserService } from '../services/user.service';
import { UserCreateEditComponent } from '../user-create-edit/user-create-edit.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Input() onSearch: Observable<User>;
  @Input() onCreate: Observable<UserAction>;

  public displayedColumns: string[] = ['user', 'email', 'names', 'surnames', 'isActive', 'actions'];
  public dataSource: MatTableDataSource<User>;
  private userData: User[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.onSearch.subscribe(searchParams => this.search(searchParams));
    this.onCreate.subscribe(user => this.create(user));

    this.userService.getUsers()
      .subscribe(users => {
        this.userData = users;
        this.initiateDataSource();
      });
  }

  search(params: User){
    this.dataSource.filter = JSON.stringify(params);
  }

  create(user: UserAction) {
    user.user.id = this.getNewUserIndex();
    this.userData.unshift(user.user);
    this.initiateDataSource();
  }

  onEdit(user: User) {
    const dialogRef = this.dialog.open(UserCreateEditComponent, {
      width: '800px',
      data: { action: UserActionEnum.Edit, user: {...user} }
    });
    dialogRef.afterClosed().subscribe((result: UserAction) => {
      if (result) {
        this.editUser(result);
      }
    });
  }

  editUser(user: UserAction) {
    let userIndex =  this.userData.findIndex(x => x.id === user.user.id) ;
    this.userData[userIndex] = user.user;
    this.initiateDataSource();
  }

  onDetail(user: User) {
    this.dialog.open(UserCreateEditComponent, {
      width: '800px',
      data: { action: UserActionEnum.Detail, user: {...user} }
    });
  }

  private initiateDataSource() {
    this.dataSource = new MatTableDataSource(this.userData);
    this.dataSource.paginator = this.paginator;
    this.setFilterPredicate();
  }

  private setFilterPredicate() {
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const filterParams: User = JSON.parse(filter); 
      return (data.names.toLocaleLowerCase().includes(filterParams.names.toLocaleLowerCase()) && !!filterParams.names)
        || (data.user.toLocaleLowerCase().includes(filterParams.user.toLocaleLowerCase()) && !!filterParams.user)
        || (data.email.toLocaleLowerCase().includes(filterParams.email.toLocaleLowerCase()) && !!filterParams.email)
        || (data.surnames.toLocaleLowerCase().includes(filterParams.surnames.toLocaleLowerCase()) && !!filterParams.surnames)
        || (!filterParams.names && !filterParams.user && !filterParams.email && !filterParams.surnames);
    };
  }

  private getNewUserIndex(): number {
    return Math.max.apply(Math, this.userData.map(ud => ud.id || 0 )) + 1;
  }
}
