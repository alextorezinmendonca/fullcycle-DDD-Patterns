import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../../../customer/repository/sequelize/customer.model';
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository';
import Customer from '../../../../domain/customer/entity/customer';
import Address from '../../../../domain/customer/value-object/address';
import OrderItemModel from './order-item.model';
import ProductModel from '../../../product/repository/sequelize/product.model';
import ProductRepository from '../../../product/repository/sequelize/product.repository';
import Product from '../../../../domain/product/entity/product';
import OrderItem from '../../../../domain/checkout/entity/order_item'
import Order from '../../../../domain/checkout/entity/order'
import OrderModel from './order.model';
import OrderRepository from './order.repository';

describe("Order repository test", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([
        CustomerModel,
        OrderModel,
        OrderItemModel,
        ProductModel,
      ]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
    
        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);
    
        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        
    
        const order = new Order("123", "123", [orderItem]);


        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                    {
                    id: orderItem.id,
                    product_id: "123",
                    order_id: "123",
                    quantity: orderItem.quantity,
                    name: orderItem.name,
                    price: orderItem.price,
                },
            ],
        });
    });


    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
    
        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);
    
        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        
        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);


        //Create new product
        const product2 = new Product("678", "Product 2", 40);
        await productRepository.create(product2)

        //Create new orderItem
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 5);

        order.addItem(orderItem2);

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({

            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: orderItem.productId,
                    order_id: order.id,
                    quantity: orderItem.quantity,
                    name: orderItem.name,
                    price: orderItem.price,
                },
                {
                    id: orderItem2.id,
                    product_id: orderItem2.productId,
                    order_id: order.id,
                    quantity: orderItem2.quantity,
                    name: orderItem2.name,
                    price: orderItem2.price,
                },
            ],
            
        });

    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
    
        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);
    
        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        
        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find("123");

        expect(foundOrder).toStrictEqual(order);

    });

    it("should find a all orders", async () => {

        //Create order 1
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
    
        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);
        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        
        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        //Create order 2
        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);
    
        const product2 = new Product("456", "Product 2", 20);
        await productRepository.create(product2);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 5);
        
        const product3 = new Product("789", "Product 3", 40);
        await productRepository.create(product3);
        const orderItem3 = new OrderItem("3", product3.name, product3.price, product3.id, 8);

        const order2 = new Order("456", "456", [orderItem2, orderItem3 ]);

        await orderRepository.create(order2);

        //Find all
        const foundOrder = await orderRepository.findAll();

        //Test
        expect(foundOrder).toHaveLength(2);
        expect(foundOrder).toContainEqual(order);
        expect(foundOrder).toContainEqual(order2);

    });
  });