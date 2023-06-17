import Product from "./product";

describe("Product unit tests", () =>{

    it("Should throw error when product Id is empty!", () => {
        expect(() => {
            const product = new Product('','bala',5);
        }).toThrowError("Product ID is required");
    });

    it("Should throw error when product name is empty!", () => {
        expect(() => {
            const product = new Product('1','',5);
        }).toThrowError("Product name is required");
    });

    it("Should throw error when product price is empty!", () => {
        expect(() => {
            const product = new Product('1','a', -1);
        }).toThrowError("Product price must be greater than 0");
    });

    it("Should change name", () => {
        
            const product = new Product('1','p1', 10);
            product.changeName("product2");

            expect(product.name).toBe("product2");
    });

    it("Should change price", () => {
        
            const product = new Product('1','p1', 10);
            product.changePrice(20);
            
            expect(product.price).toBe(20);
    });

});