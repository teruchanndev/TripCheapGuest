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
    payMethod: string;
    status: boolean;
    isCancel: boolean;
    isSuccess: boolean;
    isConfirm: boolean;
}
