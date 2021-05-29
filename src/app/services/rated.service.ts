import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

import { Rated } from '../modals/rated.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class RatedService {
    private rated: Rated;
    BACKEND_URL = environment.apiURL + '/rated/';

    constructor(
        private http: HttpClient,
        private router: Router) {}
    
    getRated(ticketId) {
        return new Promise((resolve) => {
            this.http.get<{
                message: string,
                rated: Rated
            }>(this.BACKEND_URL + ticketId).subscribe(responseData => {
                resolve(responseData.rated);
            })
        });
    }

    createRated(
        idTicket: string,
        idCreator: string,
        countRated: number,
        pointRated: number,
        listUserRated: Array<any>
    ) {
        const rateData = {
            idTicket : idTicket,
            idCreator : idCreator,
            countRated : countRated,
            pointRated : pointRated,
            listUserRated : listUserRated
        }
        return new Promise((resolve) => {
            this.http.post<
                { message: string; rated: Object }>
                (this.BACKEND_URL, rateData)
                .subscribe(responseData => {
                resolve(responseData.rated);
                console.log('responseDt: ', responseData.rated);
            });
        });
    }

    addRatedByUser(
        idTicket: string,
        idUser: string,
        nameUser: string,
        rating : number) {
        
        var data = {
            idTicket  : idTicket,
            idUser  : idUser,
            nameUser  : nameUser,
            rating  : rating
        }
        return new Promise((resolve) => {
            this.http.put<
                {message: string; status: boolean}>
                (this.BACKEND_URL, data)
        });
    }

    deleteComment(ticketId: string) {
        return new Promise((resolve) => {
            this.http
            .delete(this.BACKEND_URL + 'delete/' + ticketId).subscribe(response => {
                resolve(response);  
            });
        }); 
    }


}