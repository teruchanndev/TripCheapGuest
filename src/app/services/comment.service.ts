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

    // getCommentsOfTicket(ticketId: string) {
    //     this.http
    //         .get<{ message: string, comment: any }>
    //         (this.BACKEND_URL + ticketId)
    //         .pipe(
    //             map(commentData => {
    //                 return commentData.comment.map( comment => {
    //                     return {
    //                         id: comment._id,
    //                         idUser: comment.idUser,
    //                         idTicket: comment.idTicket,
    //                         idCreator: comment.idCreator,
    //                         message: comment.message,
    //                         username: comment.username,
    //                         images: comment.images,
    //                         likeCount: comment.likeCount,
    //                         disLikeCount: comment.disLikeCount,
    //                         lisUserLike: comment.lisUserLike,
    //                         lisUserDisLike: comment.lisUserDisLike,
    //                         created_at: comment.created_at
    //                     };
    //                 });
    //             })
    //         ).subscribe(transformedComment => {
    //             console.log('transformedComment:', transformedComment);
    //             this.comments = transformedComment;
    //             this.commentUpdated.next([...this.comments]);
    //         });
    // }

    getComments(ticketId: string) {
        return new Promise((resolve) => {
            this.http
            .get<{ message: string, comment: any }>
                (this.BACKEND_URL + ticketId).subscribe(responseData => {
                    console.log('responseData', responseData.comment);
                    resolve(responseData.comment);
                });
        }) 
    }

    // getCommentUpdateListener() {
    //     return this.commentUpdated.asObservable();
    // }

    addComment(
        idUser: string,
        idTicket: string,
        idCreator: string,
        message: string,
        username: string,
        images: Array<string>,
        likeCount: number,
        disLikeCount: number,
        listUserLike: Array<string>,
        listUserDisLike: Array<string>
    ) {
        const commentData = {
            idUser: idUser,
            idTicket: idTicket,
            idCreator: idCreator,
            message: message,
            username: username,
            images: images,
            likeCount: likeCount,
            disLikeCount: disLikeCount,
            listUserLike: listUserLike,
            listUserDisLike: listUserDisLike
          };
        console.log('commentDt: ', commentData);
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise((resolve) => {
        this.http
        .post<
            { message: string; comments: Object }>
            (this.BACKEND_URL, commentData)
            .subscribe(responseData => {
            resolve(responseData.comments);
            console.log('responseDt: ', responseData.comments);
        });
        });
    }

    updateIsLike(
        idComment: string,
        isCheckLike: boolean
    ) {
        const dateChange = {
            idComment: idComment,
            isCheckLike: isCheckLike
        }
        console.log('dateChange: ', dateChange);
        return new Promise((resolve) => {
            this.http
                .put(this.BACKEND_URL + 'like/' + idComment, dateChange)
                .subscribe(response => {
                    resolve(response);
                });
        });
    }

    updateIsDisLike(
        idComment: string,
    ) {
        const dateChange = {
            idComment: idComment,
        }
        return new Promise((resolve) => {
            this.http
                .put(this.BACKEND_URL + 'dislike/' + idComment, dateChange)
                .subscribe(response => {
                    resolve(response);
                });
        });
    }

    deleteComment(idComment: string) {
        return new Promise((resolve) => {
            this.http
            .delete(this.BACKEND_URL + idComment).subscribe(response => {
                resolve(response);  
            });
        }); 
    }


}