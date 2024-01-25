import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataInterface } from '../Interfaces/user-data-interface';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  url = 'http://172.22.176.1:6363/api/userdata';

  constructor(private http: HttpClient) { }
  getAllUsers(): Observable<UserDataInterface[]> {
    return this.http.get<UserDataInterface[]>(`${this.url}/getAllUsers`);
  }


  getUserById(id: any): Observable<UserDataInterface[]> {
    return this.http.get<UserDataInterface[]>(`${this.url}/getUserById/${id}`);
  }

  addUser(user: any): Observable<UserDataInterface[]> {
    return this.http.post<UserDataInterface[]>(`${this.url}/insertUser`,[user]);
  }


  updateUser(data: any): Observable<UserDataInterface[]> {
    return this.http.put<UserDataInterface[]>(`${this.url}/updateUser/${data.user_id}`, [data]);
  }

  deleteUser(data: any): Observable<UserDataInterface[]> {
    const dataToDelete = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: [{
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        dob: data.dob,
        gender: data.gender,
        country: data.country,
      }]

    };
    return this.http.delete<UserDataInterface[]>(`${this.url}/deleteUser`, dataToDelete);
  }

}
