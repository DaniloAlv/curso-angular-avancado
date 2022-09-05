import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { LocalStorageUtils } from 'src/app/utils/localstorage';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseService {

  constructor(private httpClient: HttpClient) {
    super();
   }

  instanceofLocalStorage(): LocalStorageUtils{
    return this.LocalStorage;
  }

  cadastrarUsuario(newUser: User): Observable<User> {

    let response = this.httpClient.post(`${this.UrlApiV1}/auth/register`, newUser, this.ObterHeaderJson())
      .pipe(
        map(this.extractData),
        catchError(this.serviceError));

    return response;
  }

  login(user: User): Observable<User> {

    let reponse = this.httpClient.post(`${this.UrlApiV1}/auth/login`, user, this.ObterHeaderJson())
      .pipe(
        map(this.extractData),
        catchError(this.serviceError)
      );

    return reponse;
  }
}
