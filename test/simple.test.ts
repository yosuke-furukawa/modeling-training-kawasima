import {
    ClosedOrder,
    DeliveringOrder,
    InProgressOrder,
    OrderConstraint
} from '../src/simple/Order';

test('successfully', () => {
    const order = new InProgressOrder("123", [OrderConstraint.SHIPPING_JAPAN_ONLY]);
    expect(order).toBeInstanceOf(InProgressOrder);

    const deliveringOrder = order.deliver({
        country: "JP",
        postalCode: "123",
        region: "Suginami",
        streetAddress: "a"
    }, new Date(2022, 10, 1));
    expect(deliveringOrder).toBeInstanceOf(DeliveringOrder);

    const closedOrder = deliveringOrder.close();
    expect(closedOrder).toBeInstanceOf(ClosedOrder);
});

test('constraint violation', () => {
    const order = new InProgressOrder("123", [OrderConstraint.SHIPPING_JAPAN_ONLY]);
    expect(order).toBeInstanceOf(InProgressOrder);

    expect(() => {
        order.deliver({
            country: "US",
            postalCode: "123",
            region: "NY",
            streetAddress: "a"
        }, new Date(2022, 10, 1));
    }).toThrowError(/shipping only for Japan/)
});
