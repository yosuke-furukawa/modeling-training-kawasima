import { OrderConstraint, Address, ViolationError } from "../share";

interface Order {
    orderId: string;
    constraints: OrderConstraint[];
}

export { OrderConstraint } from "../share";

// 配送手配処理ができることを表すインタフェース
interface Deliverable {
    deliver: (address: Address, deliveryDate: Date) => DeliveringOrder;
}

// 注文クローズ処理ができることを表すインタフェース
interface OrderCloseable {
    close: () => ClosedOrder;
}

// 注文受付中を表す
export class InProgressOrder implements Order, Deliverable {
    readonly orderId: string;
    readonly constraints: OrderConstraint[];

    constructor(orderId: string, constraints: OrderConstraint[]) {
        this.orderId = orderId;
        this.constraints = constraints;
    }

    deliver(deliveryAddress: Address, deliveryDate: Date): DeliveringOrder {
        return new DeliveringOrder(
            this.orderId,
            this.constraints,
            deliveryAddress,
            deliveryDate
        );
    }
}

// 配送手配中を表す
export class DeliveringOrder implements Order, OrderCloseable {
    readonly orderId: string;
    readonly constraints: OrderConstraint[];
    readonly deliveryAddress: Address;
    readonly deliveryDate: Date;

    constructor(orderId: string, constraints: OrderConstraint[], deliveryAddress: Address, deliveryDate: Date) {
        this.orderId = orderId;
        this.constraints = constraints;
        this.deliveryAddress = deliveryAddress;
        this.deliveryDate = deliveryDate;

        const violations = this.constraints.map(constraint => constraint.apply(null, [this]))
            .filter(Boolean)
            .map((violation): string => violation?.message || "");
        if (violations.length > 0) {
            throw new ViolationError(violations);
        }
    }

    close() {
        return new ClosedOrder(this.orderId, this.constraints);
    }
}

// クローズされた注文を表す
export class ClosedOrder implements Order {
    readonly orderId: string;
    readonly constraints: OrderConstraint[];

    constructor(orderId: string, constraints: OrderConstraint[]) {
        this.orderId = orderId;
        this.constraints = constraints;
    }
}