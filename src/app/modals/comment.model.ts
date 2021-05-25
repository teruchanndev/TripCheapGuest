export interface Comment {
    idUser: string;
    nameUser: string;
    idTicket: string;
    idCreator: string;
    message: string;
    images: Array<string>;
    rating: number;
    likeCount: number;
    created_at: string;
}
  