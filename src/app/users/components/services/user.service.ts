import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
    providedIn: "root"
})
export class UserService {

    constructor(public http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('./api/users.json');
    }

}
