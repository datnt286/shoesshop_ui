export enum InvoiceStatus {
    Placed = 1,
    Approved,
    Shipped,
    Received,
    Cancelled,
}

export const getStatusText = (status: InvoiceStatus): string => {
    switch (status) {
        case InvoiceStatus.Placed:
            return 'Đã đặt';
        case InvoiceStatus.Approved:
            return 'Đã duyệt';
        case InvoiceStatus.Shipped:
            return 'Đang vận chuyển';
        case InvoiceStatus.Received:
            return 'Đã nhận';
        case InvoiceStatus.Cancelled:
            return 'Đã huỷ';
        default:
            return 'Không rõ';
    }
};
