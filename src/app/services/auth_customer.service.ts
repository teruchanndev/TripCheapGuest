import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../modals/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthService {

    BACKEND_URL = environment.apiURL + '/customer/';
    private token: String;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;
    private customerId: string;
    private username: string;
    private created_at: string;

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }
    getIsAuth() {
      return this.isAuthenticated;
    }
    getCustomerId() {
      return this.customerId;
    }

    getUsername() {
      return this.username;
    }

    getCreatedAt() {
      return this.created_at;
    }

    createCustomer(
      email: string, 
      password: string, 
      username: string) {
        const authData: AuthData = {
          email: email, 
          password: password, 
          username: username, 
          created_at: ''
        };
        this.http.post(this.BACKEND_URL + 'signup', authData)
            .subscribe(() => {
              this.router.navigate(['/login']);
            }, error => {
              alert(error);
              this.authStatusListener.next(false);
            });
    }

    changePassword(password: string) {
      return new Promise((resolve, reject) => {
        this.http.put(this.BACKEND_URL + 'password', password)
          .subscribe(() => {
            resolve(true);
          }, error => {
            reject(false);
          });
      });
    }

    login(email: string, password: string) {
        const authData: AuthData = {
          email: email, 
          password: password, 
          username: '', 
          created_at: ''
        };
        // console.log(authData);
        this.http.post<{
          token: string, 
          expiresIn: number, 
          customerId: string, 
          username: string, 
          created_at: string }>(this.BACKEND_URL  +  'login', authData)
            .subscribe(response => {
                // console.log('res: ' + response.created_at);
                const token = response.token;
                this.token = token;
                if (token) {
                  const expiresInDuration = response.expiresIn;
                  this.setAuthTimer(expiresInDuration);
                  this.isAuthenticated = true;
                  this.customerId = response.customerId;
                  this.username = response.username;
                  this.created_at = response.created_at;
                  this.authStatusListener.next(true);
                  const now = new Date();
                  const expirationDate = new Date(now.getTime() + expiresInDuration * 1000 );
                  localStorage.setItem('customerName', this.username);
                  this.saveAuthData(token, expirationDate, this.customerId, this.username, this.created_at);
                  if(localStorage.getItem('ticketId') && localStorage.getItem('type') == 'detailTicket') {
                    this.router.navigate(['/detail/', localStorage.getItem('ticketId')]);
                    localStorage.removeItem('ticketId');
                    localStorage.removeItem('type');
                  } else {
                    this.router.navigate(['/home']);
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Đăng nhập thành công!',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    
                  }
                }
            }, error => {
              // console.log('error ' + error);
              this.authStatusListener.next(false);
              console.log('error', error.error.message);
              Swal.fire({
                title: error.error.message,
                icon: 'error'
              })
            });
    }

    autoAuthCustomer() {
      const authInformation = this.getAuthData();
      if (!authInformation) { return; }
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.customerId = authInformation.customerId;
        this.username = authInformation.username;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }

    logout() {
      this.token = null;
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      this.customerId = null;
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(['/login']);
    }

    deleteAccount(id: string) {
      return new Promise((resolve) => {
        this.http.delete(this.BACKEND_URL + 'delete/' + id).subscribe(() => {
          this.token = null;
          this.isAuthenticated = false;
          this.authStatusListener.next(false);
          this.customerId = null;
          clearTimeout(this.tokenTimer);
          this.clearAuthData();
          this.router.navigate(['/home']);
        }
        );
      })
    }

    private setAuthTimer(duration: number) {
      console.log('setting timer: ' + duration);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, customerId: string, username: string, created_at: string) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem('customerId', customerId);
      localStorage.setItem('username', username);
      localStorage.setItem('created_at', created_at);
    }

    private clearAuthData() {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
    }

    private getAuthData() {
      const token  = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expiration');
      const customerId = localStorage.getItem('customerId');
      const username = localStorage.getItem('username');
      const created_at = localStorage.getItem('created_at');
      if (!token || !expirationDate) {
        return;
      }
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        customerId: customerId,
        username: username,
        created_at: created_at
      };
    }
}
