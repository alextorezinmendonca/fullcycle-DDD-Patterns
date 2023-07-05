import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit test", () => {


    it("Should create a customer", () => {

        let customer = CustomerFactory.create("Alex");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Alex");
        expect(customer.address).toBeUndefined();


    });

    it("Should create a customer with address", () => {
        const address = new Address("Rua 12", 100, "120992", "SP") 
        let customer = CustomerFactory.createWithAddress("Alex", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Alex");
        expect(customer.address).toBe(address);


    });


});