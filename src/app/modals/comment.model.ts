export interface Comment {
    id: string;
    idUser: string;
    idTicket: string;
    idCreator: string;
    message: string;
    username: string;
    images: Array<string>;
    rating: number;
    likeCount: number;
    isMyLike: boolean;
    created_at: string;
}
  