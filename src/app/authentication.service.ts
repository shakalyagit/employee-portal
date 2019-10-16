import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { map } from 'rxjs/operators/map';
import { Router, Params } from '@angular/router';
import * as config from './config/config';
import { Observable, BehaviorSubject, } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserDetails {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  grade: string;
  department: string;
  gradeId: string;
  departmentId: string;
  phoneNumber: string;
  extNumber: string;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
  ttl: Number;
}

@Injectable()
export class AuthenticationService {
  // public baseUrl = 'http://139.59.224.233:3084';
  private baseUrl: String;
  // public baseUrl = '';
  private mediaBaseUrl: String;

  private token: string;

  headerText: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router,
    // public sysConfig: ConfigService
  ) {
    this.baseUrl = config.baseUrl;
    this.mediaBaseUrl = config.mediaBaseUrl;
    this.headerText = new BehaviorSubject([]);
  }

  private saveToken(token: string): void {
    console.log(token);
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  public getAuthToken(): string {
    if (!this.token) {
      console.log(this.token);
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      let userDetails = localStorage.getItem('user');
      if (userDetails)
        return JSON.parse(userDetails);
      else
        return null;
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return true;
    }
    return false;
  }

  // public isLoggedIn(): boolean {
  //   const user = this.getUserDetails();
  //   if (user) {
  //     console.log("usr");
  //     console.log("usr expr time ", user.exp);

  //     console.log("Time now ", Date.now());
  //     // console.log('time',Date.now() / 1000);
  //     return user.exp > Date.now();
  //   } else {
  //     return false;
  //   }
  // }

  public fileRequest (method: 'post',  type: String, data?: any): Observable<any>  {
    let fileUpload;
    console.log('data',data);
    if (method === 'post') {
      fileUpload = this.http.post(`${this.mediaBaseUrl}/${type}`, data);
  }
  return fileUpload;
  }

  // public getFile(value) {
  //   return `${this.mediaBaseUrl}${value}`;
  // }

  public request(method: 'post' | 'get' | 'put' | 'delete' | 'patch' | 'file', type: String, data?: any): Observable<any> {
    let base;

    // console.log("method-" + method);
    if (method === 'post') {
      if (type === 'users/login?include=user' || type === 'register') {
        base = this.http.post(`${this.baseUrl}/${type}`, data, { headers: { "Content-Type": "application/json" } });
      }
      else {
        base = this.http.post(`${this.baseUrl}/${type}`, data, { headers: { "Content-Type": "application/json", Authorization: `${this.getToken()}` } });
      }
    }
    else if (method === 'put') {
      base = this.http.put(`${this.baseUrl}/${type}`, data, { headers: { "Content-Type": "application/json", Authorization: `${this.getToken()}` } });
    }
    else if (method === 'patch') {
      base = this.http.put(`${this.baseUrl}/${type}`, data, { headers: { "Content-Type": "application/json", Authorization: `${this.getToken()}` } });
    }
    else if (method === 'delete') {
      base = this.http.delete(`${this.baseUrl}/${type}`, { headers: { "Content-Type": "application/json", Authorization: `${this.getToken()}` } });
    }
    else if (method === 'file') {
      base = this.http.post(`${this.baseUrl}/${type}`, data, { headers: { Authorization: `${this.getToken()}` } });
    }
    else {
      if (data)
        base = this.http.get(`${this.baseUrl}/${type}`, { params: data, headers: { Authorization: `${this.getToken()}` } });
      else
        base = this.http.get(`${this.baseUrl}/${type}`, { headers: { Authorization: `${this.getToken()}` } });
    }

    if (type === 'users/login') {
      const request = base.pipe(
        map((data: any) => {
          console.log('in', data);
          if (data.status === 500) {
alert("Something went wrong. Please try again.")
          } else if (data.result) {
            console.log("token", data.result);
            this.saveToken(data.result);
            const userData: UserDetails = {
              employeeId: data.result.employeeId,
              firstName: data.result.firstName,
              lastName: data.result.lastName,
              grade: data.result.gradeDisplayName,
              email: data.result.email,
              department: data.result.orgDisplayName,
              gradeId: data.result.grade,
              departmentId: data.result.organization,
              phoneNumber: data.result.phone,
              extNumber: data.result.extNo,
              id: data.result.userKey
            }
            localStorage.setItem('user', JSON.stringify(userData));
          }
          // console.log(data);
          return data;
        })
      );
      return request;
    }


    return base;
  }


  public call(methodName, methodType: 'post' | 'get' | 'put' | 'delete', data = {}): Observable<any> {
    return this.request(methodType, methodName, data);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'users/login?include=user', user);
  }



  public logout(): void {
    // /Users/logout
    this.token = '';
    // this.request('post', 'users/logout', {}).subscribe((response) => {
      // console.log(response);
      window.localStorage.removeItem('mean-token');
      window.localStorage.removeItem('user');
      console.log("redirect");
      this.router.navigateByUrl('auth/login');
      console.log("logged out");
    // }, (err) => {
    //   window.localStorage.removeItem('mean-token');
    //   window.localStorage.removeItem('user');
    //   this.router.navigateByUrl('auth/login');
    //   console.log("no access token");
    //   console.log("redirect");
    // });
  }

  public logoutWithoutRedirect(): void {
    this.token = '';
    this.request('post', 'users/logout', {}).subscribe((response) => {
      // console.log(response);
      window.localStorage.removeItem('mean-token');
    }, (err) => {
      window.localStorage.removeItem('mean-token');
    });
  }
}