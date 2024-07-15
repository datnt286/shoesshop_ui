export enum InvoiceStatus {
    Placed = 1,
    Approved,
    Shipped,
    Delivered,
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
        case InvoiceStatus.Delivered:
            return 'Đã giao';
        case InvoiceStatus.Received:
            return 'Đã nhận';
        case InvoiceStatus.Cancelled:
            return 'Đã huỷ';
        default:
            return 'Không rõ';
    }
};

export const getActionButtonText = (status: InvoiceStatus): string => {
    switch (status) {
        case InvoiceStatus.Placed:
            return 'Duyệt';
        case InvoiceStatus.Approved:
            return 'Vận chuyển';
        case InvoiceStatus.Shipped:
            return 'Xác nhận';
        case InvoiceStatus.Delivered:
            return 'Đã giao';
        case InvoiceStatus.Received:
            return 'Đã nhận';
        case InvoiceStatus.Cancelled:
            return 'Đã huỷ';
        default:
            return 'Không rõ';
    }
};

export const getActionBtnClassName = (status: InvoiceStatus): string => {
    switch (status) {
        case InvoiceStatus.Placed:
            return 'btn-blue';
        case InvoiceStatus.Approved:
            return 'btn-info';
        case InvoiceStatus.Shipped:
            return 'btn-warning';
        case InvoiceStatus.Received:
            return 'btn-success';
        case InvoiceStatus.Delivered:
            return 'btn-success';
        case InvoiceStatus.Cancelled:
            return 'btn-gray';
        default:
            return 'btn-gray';
    }
};

export const getActionBtnIcon = (status: InvoiceStatus): string => {
    switch (status) {
        case InvoiceStatus.Placed:
            return 'fas fa-edit';
        case InvoiceStatus.Approved:
            return 'fas fa-shipping-fast';
        case InvoiceStatus.Shipped:
            return 'fas fa-check';
        case InvoiceStatus.Delivered:
            return 'fas fa-check-circle';
        case InvoiceStatus.Received:
            return 'fas fa-check-circle';
        case InvoiceStatus.Cancelled:
            return 'fas fa-trash-alt';
        default:
            return 'fas fa-question';
    }
};

export const getStatusBadgeClass = (status: InvoiceStatus): string => {
    switch (status) {
        case InvoiceStatus.Placed:
            return 'badge-primary';
        case InvoiceStatus.Approved:
            return 'badge-info';
        case InvoiceStatus.Shipped:
            return 'badge-warning';
        case InvoiceStatus.Delivered:
            return 'badge-success';
        case InvoiceStatus.Received:
            return 'badge-success';
        case InvoiceStatus.Cancelled:
            return 'badge-secondary';
        default:
            return 'badge-secondary';
    }
};
