export type Address = {
    country: string;
    postalCode: string;
    region: string;
    streetAddress: string;
}

export class ViolationError extends Error {
    constructor(messages: string[]) {
        super("* " + messages.join("\n* "));
    }
}

export interface Order {
    deliveryAddress?: Address;
    deliveryDate?: Date;
}

export type OrderValidator = (order: Order) => Violation | undefined;

export type Violation = {
    message: string;
}

export type OrderConstraint = typeof OrderConstraint[keyof typeof OrderConstraint];

export const OrderConstraint: {
    [key: string]: OrderValidator
} = {
    SHIPPING_JAPAN_ONLY: (order: Order) => order.deliveryAddress?.country !== "JP" ? {
        message: "This order is shipping only for Japan"
    } : undefined,
    DELIVERY_WEEKEND: (order: Order) => ![0,6].includes(order.deliveryDate?.getDay() || -1) ? {
        message: "This order can deliver only on weekday"
    } : undefined,
};