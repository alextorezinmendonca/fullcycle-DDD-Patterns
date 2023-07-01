import {Sequelize} from 'sequelize-typescript';
import ProductModel from './product.model';
import Product from '../../../../domain/product/entity/product';
import ProductRepository from './product.repository';

describe("Product repository test", ()=> {

    let sequilize: Sequelize;

    beforeEach(async () => {
        sequilize = new Sequelize({
            dialect: 'sqlite',
            storage: 'memory',
            logging: false,
            sync: {force: true},
        });

        sequilize.addModels([ProductModel]);
        await sequilize.sync();
    });

    afterEach(async() => {
        await sequilize.close();
    });

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "p1",10);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({where: {id: "1"}});

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "p1",
            price: 10,
        });
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', "p1", 10);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({where: {id: "1"}});

        product.changeName('p2');
        product.changePrice(20);

        await productRepository.update(product);

        const productModel2 = await ProductModel.findOne({where: {id: "1"}});

        expect(productModel2.toJSON()).toStrictEqual({
            id: "1",
            name: "p2",
            price: 20,
        });

    })

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', "p1", 10);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({where: {id: "1"}});

        const foundProduct = await productRepository.find("1");

        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price,
        });

    })

    it("should find all products", async () => {
        const productRepository = new ProductRepository();
        const product1 = new Product('1', "p1", 10);
        await productRepository.create(product1);

        const product2 = new Product('2', "p2", 20);
        await productRepository.create(product2);
        

        const products = [product1, product2];
        const foundProduct = await productRepository.findAll();

        expect(products).toEqual(foundProduct);

    })

});