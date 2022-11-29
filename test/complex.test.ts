import { Order, OrderConstraint, OrderStatus } from '../src/complex/Order';

test('successfully', () => {
    const order = new Order("123", [OrderConstraint.SHIPPING_JAPAN_ONLY]);
    expect(order.status).toBe(OrderStatus.IN_PROGRESS);

    order.deliver({
        country: "JP",
        postalCode: "123",
        region: "Suginami",
        streetAddress: "a"
    }, new Date(2022, 10, 1));
    expect(order.status).toBe(OrderStatus.DELIVERING);

    order.close();
    expect(order.status).toBe(OrderStatus.CLOSED);
});

test('constraint violation', () => {
    const order = new Order("123", [OrderConstraint.SHIPPING_JAPAN_ONLY]);
    expect(order.status).toBe(OrderStatus.IN_PROGRESS);

    expect(() => {
        order.deliver({
            country: "US",
            postalCode: "123",
            region: "NY",
            streetAddress: "a"
        }, new Date(2022, 10, 1));
    }).toThrowError(/shipping only for Japan/)
});

test('lottery order1', () => {
    const order = new Order("123", [OrderConstraint.SHIPPING_JAPAN_ONLY], true);
    expect(order.status).toBe(OrderStatus.IN_PROGRESS);
    order.draw(false);

    expect(() => {
        order.deliver({
            country: "JP",
            postalCode: "123",
            region: "TOKYO",
            streetAddress: "a"
        }, new Date(2022, 10, 1));
    }).toThrowError(/Order status is not election/)
});

test('lottery order win version', () => {
    const order = new Order("123", [OrderConstraint.SHIPPING_JAPAN_ONLY], true);
    expect(order.status).toBe(OrderStatus.IN_PROGRESS);
    order.draw(true);

    expect(() => {
        order.deliver({
            country: "JP",
            postalCode: "123",
            region: "TOKYO",
            streetAddress: "a"
        }, new Date(2022, 10, 1));
    })
});