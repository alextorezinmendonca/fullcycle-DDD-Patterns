import OrderItem from '../entity/order_item';
import Customer from '../entity/customer';
import Order from '../entity/order'
import OrderService from './order.service';

describe("Order service unity test", () => {

    it("Should place an order", () => {

        const customer = new Customer('id1',"Alex");
        const item1 = new OrderItem("i1", "p1", 20, 'id12', 5);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(50);
        expect(order.total()).toBe(100);

    });

    it("Should get total of all orders", () => {

        const item1 = new OrderItem('i1', "p1", 10, "desc1", 2);
        const item2 = new OrderItem('i1', "p1", 20, "desc1", 3);

        const order = new Order('o1', 'c1', [item1]);
        const order2 = new Order('o2', 'c1', [item2]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(80);
    });


});