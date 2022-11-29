import { OrderConstraint, Address, ViolationError, Order as IOrder } from "../share";

// 注文ステータス
export const OrderStatus = {
    IN_PROGRESS: "IN_PROGRESS",
    DELIVERING: "DELIVERING",
    CLOSED: "CLOSED",
    LOTTERY: "LOTTERY",
    ELECTION: "ELECTION",
};

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export { OrderConstraint } from "../share";

// 注文を表すクラス
// ステータスによってメソッドが呼び出し可能かどうかをチェックする
export class Order implements IOrder {
    status: OrderStatus;
    readonly orderId: string;
    readonly constraints: OrderConstraint[];
    deliveryAddress?: Address;
    deliveryDate?: Date;
    isLottery?: boolean;

    constructor(orderId: string, constraints: OrderConstraint[], isLottery?: boolean) {
        this.orderId = orderId;
        this.constraints = constraints;
        this.status = OrderStatus.IN_PROGRESS;
        this.isLottery = isLottery ?? false;
    }

    draw(win: boolean) {
        if (!this.isLottery) {
            throw new Error("This order is not lottery");
        }
        this.status = win ? OrderStatus.ELECTION : OrderStatus.CLOSED;
    }

    // 配送手配
    // 「国内配送のみ」「土日配送不可」の注文であれば、それをチェックする。
    deliver(deliveryAddress: Address, deliveryDate: Date): void {
        if (this.isLottery && this.status !== OrderStatus.ELECTION) {
            throw new Error(`Order status is not election`);
        }
        if (this.status !== OrderStatus.IN_PROGRESS) {
            throw new Error(`Order status is not in progress and ELECTION`);
        }

        this.deliveryAddress = deliveryAddress;
        this.deliveryDate = deliveryDate;
        this.status = OrderStatus.DELIVERING;
        
        // 注文の制約をチェック。エラー時はその旨のメッセージが返る
        const violations = this.constraints.map(constraint => constraint.apply(null, [this]))
            .filter(Boolean)
            .map((violation): string => violation?.message || "");

        // エラーがあれば、例外を送出する
        if (violations.length > 0) {
            throw new ViolationError(violations);
        }
    }

    // 配送業者に受け渡したら注文のステータスをCLOSEDにする
    close() {
        if (this.status !== OrderStatus.DELIVERING) {
            throw new Error(`Order status is not delivering or lottery or selection`);
        }
        this.status = OrderStatus.CLOSED;
    }

    // 

}