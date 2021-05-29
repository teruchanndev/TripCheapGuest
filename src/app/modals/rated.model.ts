export interface Rated {
    idTicket: string,
    idCreator: string,
    countRated: number,
    pointRated: number,
    listUserRated: Array<
    {
        idUser: string,
        nameUser: string,
        rating: number
    }>;
}
