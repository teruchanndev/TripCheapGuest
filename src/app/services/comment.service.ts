import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Comment } from '../modals/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
    private comments: Comment[] = [];
    private commentUpdated = new Subject<Comment[]>();
    BACKEND_URL = environment.apiURL + '/comment/';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getCommentsOfTicket(ticketId: string) {
        this.http
            .get<{ message: string, comment: any }>
            (this.BACKEND_URL + ticketId)
            .pipe(
                map(commentData => {
                    return commentData.comment.map( comment => {
                        return {
                            id: comment._id,
                            idUser: comment.idUser,
                            idTicket: comment.idTicket,
                            idCreator: comment.idCreator,
                            message: comment.message,
                            images: comment.images,
                            rating: comment.rating,
                            likeCount: comment.likeCount
                        };
                    });
                })
            ).subscribe(transformedComment => {
                this.comments = transformedComment;
                this.commentUpdated.next([...this.comments]);
            });
    }

    getTicketUpdateListener() {
        return this.commentUpdated.asObservable();
    }

    addComment(
        idUser: string,
        idTicket: string,
        idCreator: string,
        message: string,
        images: Array<string>,
        rating: number,
        likeCount: number
    ) {
        const commentData = {
            idUser: idUser,
            idTicket: idTicket,
            idCreator: idCreator,
            message: message,
            images: images,
            rating: rating,
            likeCount: likeCount
          };
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise((resolve) => {
        this.http
        .post<
            { message: string; ticket: Object }>
            (this.BACKEND_URL, commentData)
        .subscribe(responseData => {
            resolve(commentData);
        });
        });
    }


}