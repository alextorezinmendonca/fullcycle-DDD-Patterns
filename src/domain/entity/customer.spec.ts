import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () =>{

    it("Should throw error when id is empty!", () => {
        expect(() => {
            let customer = new Customer("", "Alex");
        }).toThrowError("ID is required");
    });

    it("Should throw error when name is empty!", () => {
        expect(() => {
            let customer = new Customer("1", "");
        }).toThrowError("Name is required");
    });

    it("Should change name", () => {

        const customer = new Customer("1", "Alex");

        customer.changeName("Rubia");

        expect(customer.name).toBe("Rubia");

    });

    it("Should throw error when name is empty in changeName!", () => {
        expect(() => {
            let customer = new Customer("1", "alex");
            customer.changeName("");
        }).toThrowError("Name is required");
    });

    it("Should activate customer", () => {
        const customer = new Customer("1", "Alex");
        const address = new Address("Rua", 12, "123", "Rio preto");
        customer.changeAddress(address);

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });

    it("Should throw erro when address is undefined when activate a customer", () => {

        expect(() => {
            const customer = new Customer("1", "Alex");
            customer.activate();

        }).toThrowError("Address is mandatory to activate a customer");

    });
    
    it("Should deactivate customer", () => {
        const customer = new Customer("1", "Alex");
        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("Should add reward point", () => {

        const customer = new Customer("1", "Alex");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);

    });

});