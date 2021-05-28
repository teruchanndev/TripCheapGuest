export interface Comment {
    _id: string;
    idUser: string;
    idTicket: string;
    idCreator: string;
    message: string;
    username: string;
    images: Array<string>;
    likeCount: number;
    disLikeCount: number;
    listUserLike: Array<string>;
    listUserDisLike: Array<string>;
    created_at: string;
}
  