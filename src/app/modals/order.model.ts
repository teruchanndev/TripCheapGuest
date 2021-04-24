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
    isCancel: boolean; // đơn hàng bị hủy
    isSuccess: boolean; // hoàn thành đơn hàng
    isConfirm: boolean; // xác nhận đơn hàng
    // qrcode: string;
}
