import Order from "./order";
import OrderItem from "./order_item";


describe("Order unit tests", () =>{

    const item1 = new OrderItem('1', 'bala', 2, 'QA01', 3);
    const item2 = new OrderItem('2', 'chiclete', 3, 'QA02', 5);

    it("Should throw error when id is empty!", () => {
        expect(() => {
            let order = new Order("", "123", [item1,item2]);
        }).toThrowError("Id is required");
    });

    it("Should throw error when customer id is empty!", () => {
        expect(() => {
            let order = new Order("123", "", [item1,item2]);
        }).toThrowError("Customer Id is required");
    });

    it("Should throw error when item is empty!", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrowError("Items must be greater than zero");
    });

    it("Should calculate total", () => {
        const order = new Order("123", "123", [item1]);
        expect(order.total()).toBe(6);

        const order2 = new Order("123", "123", [item1, item2]);
        expect(order2.total()).toBe(21);
    });

    it("Should check if item qtd is less than 0", () => {
        expect(()=>{

            const item2 = new OrderItem('1', 'bala', 2, 'QA01', -1)
            const order2 = new Order("123", "123", [item2]);

        }).toThrowError("Quantity must be greater than 0");

    });


});