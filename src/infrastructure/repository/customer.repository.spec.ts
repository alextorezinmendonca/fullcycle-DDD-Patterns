import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../db/sequelize/model/customer.model';
import CustomerRepository from './customer.repository';
import Customer from '../../domain/entity/customer';
import Address from '../../domain/entity/address';
import EventDispatcher from '../../domain/event/@shared/event-dispatcher';
import EnviaConsoleLog1Handler from '../../domain/event/product/handler/print-log1.handler';
import EnviaConsoleLog2Handler from '../../domain/event/product/handler/print-log2.handler';
import CostumerCreatedEvent from '../../domain/event/product/costumer-created.event';

describe("Product repository test", ()=> {

    let sequilize: Sequelize;

    beforeEach(async () => {
        sequilize = new Sequelize({
            dialect: 'sqlite',
            storage: 'memory',
            logging: false,
            sync: {force: true},
        });

        sequilize.addModels([CustomerModel]);
        await sequilize.sync();
    });

    afterEach(async() => {
        await sequilize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Alex");
        const address = new Address( "sem saida", 12, "zip12", "SP");
        customer.address = address;
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id:"1"}});

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        
        });
    });

    it("should create and notify with event", async () => {
        const customerRepository = new CustomerRepository();

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CostumerCreatedEvent", eventHandler);
        eventDispatcher.register("CostumerCreatedEvent", eventHandler2)
        expect(eventDispatcher.getEventHandlers["CostumerCreatedEvent"][0]).toMatchObject(eventHandler);
        expect(eventDispatcher.getEventHandlers["CostumerCreatedEvent"][1]).toMatchObject(eventHandler2);

        
        const customer = new Customer("1", "Alex");
        const address = new Address( "sem saida", 12, "zip12", "SP");
        customer.address = address;
        await customerRepository.create(customer);

        //const costumerCreatedEvent = new CostumerCreatedEvent(customer);
        //eventDispatcher.notity(costumerCreatedEvent);

        const customerModel = await CustomerModel.findOne({where: {id:"1"}});

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        
        });
        expect(spyEventHandler).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });


    it("should update a costumer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Alex");
        const address = new Address("sem saida", 12, "zip12", "SP");
        customer.address = address;
        await customerRepository.create(customer);

        customer.changeName("Mendonca");
        await customerRepository.update(customer);
        const customerModel = await CustomerModel.findOne({where: {id: "1"}});

        expect(customerModel.toJSON()).toStrictEqual({

            id: "1",
            name: customer.name,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,

        });
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Alex");
        const address = new Address("sem saida", 12, "zip12", "SP");
        customer.address = address;
        await customerRepository.create(customer);

        const customerResult = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(customerResult);

    });

    it("shoould throw an error when customer is not found", async () =>{
        const customerRepository = new CustomerRepository();

        expect(async () =>{
            await customerRepository.find("1029");
        }).rejects.toThrow("Customer not found");

    });


    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("1", "Alex");
        const address1 = new Address("sem saida", 12, "zip12", "SP");
        customer1.address = address1;
        customer1.addRewardPoints(10);
        customer1.activate();

        const customer2 = new Customer("2", "Rubia");
        const address2 = new Address("sem saida2", 12, "zip122", "SPs");
        customer2.address = address2;
        customer2.addRewardPoints(20);
        customer2.activate();

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);

    });

});