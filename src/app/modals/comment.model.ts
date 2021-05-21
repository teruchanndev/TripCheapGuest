export interface Comment {
    idUser: string;
    idTicket: string;
    idCreator: string;
    message: string;
    images: Array<string>;
    rating: number;
    likeCount: number;
}
  