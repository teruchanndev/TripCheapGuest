import { HttpClient } from '@angular/common/http';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../modals/customer.model';


@Injectable({ providedIn: 'root' })

export class CustomerService {
    private infoCustomer: Customer[] = [];
    private infoCustomerUpdated = new Subject<Customer[]>();
    BACKEND_URL = environment.apiURL + '/customer/';

    constructor(private http: HttpClient, private router: Router) {}

    getInfoCustomer() {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise((resolve) => {
            this.http.get<{
                username: string,
                email: string,
                phoneNumber: string,
                fullName: string,
                address: string
            }>(this.BACKEND_URL + 'info').subscribe(responseData => {
              resolve(responseData);
            });
        });
    }

    getCustomerUpdateListener() {
        return this.infoCustomerUpdated.asObservable();
    }

    updateInfo(
        email: string,
        phoneNumber: string,
        fullName: string,
        address: string,
        username: string,
    ) {
        const infoData = {
            email: email,
            phoneNumber: phoneNumber,
            fullName: fullName,
            address: address,
            username: username
        };
        // console.log(infoData);

        // tslint:disable-next-line:no-shadowed-variable
        return new Promise((resolve) => {
          this.http.put(this.BACKEND_URL + 'info/edit', infoData)
          .subscribe(response => {
              resolve(response);
          });
        });

    }

    // getAvatar(){
    //     return this.UrlAvt;
    // }
}
