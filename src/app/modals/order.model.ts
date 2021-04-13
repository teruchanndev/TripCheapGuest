import { ServiceSelect } from './serviceSelect.model';

export interface Order {
    id: string;
    nameTicket: string;
    imageTicket: string;
    dateStart: string;
    dateEnd: string;
    idTicket: string;
    idCreator: string;
    idCustomer: string;
    itemService: Array<ServiceSelect>;
    payMethod: string
}
