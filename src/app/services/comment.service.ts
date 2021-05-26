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
                            username: comment.username,
                            images: comment.images,
                            rating: comment.rating,
                            likeCount: comment.likeCount,
                            isMyLike: comment.isMyLike,
                            created_at: comment.created_at
                        };
                    });
                })
            ).subscribe(transformedComment => {
                this.comments = transformedComment;
                this.commentUpdated.next([...this.comments]);
            });
    }

    getCommentUpdateListener() {
        return this.commentUpdated.asObservable();
    }

    addComment(
        idUser: string,
        idTicket: string,
        idCreator: string,
        message: string,
        username: string,
        images: Array<string>,
        rating: number,
        likeCount: number,
        isMyLike: boolean
    ) {
        const commentData = {
            idUser: idUser,
            idTicket: idTicket,
            idCreator: idCreator,
            message: message,
            username: username,
            images: images,
            rating: rating,
            likeCount: likeCount,
            isMyLike: isMyLike
          };
        console.log('commentDt: ', commentData);
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise((resolve) => {
        this.http
        .post<
            { message: string; comments: Object }>
            (this.BACKEND_URL, commentData)
            .subscribe(responseData => {
            resolve(commentData);
        });
        });
    }

    updateIsLike(
        idComment: string,
        likeCount: number,
        isMyLike: boolean
    ) {
        const dateChange = {
            idComment: idComment,
            likeCount: likeCount,
            isMyLike: isMyLike
        }
        return new Promise((resolve) => {
            this.http
                .put(this.BACKEND_URL + idComment, dateChange)
                .subscribe(response => {
                    resolve(response);
                });
        });
    }


}