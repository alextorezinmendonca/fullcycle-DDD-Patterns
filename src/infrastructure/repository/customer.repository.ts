import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import EventDispatcher from "../../domain/event/@shared/event-dispatcher";
import CostumerCreatedEvent from "../../domain/event/product/costumer-created.event";
import EnviaConsoleLog1Handler from "../../domain/event/product/handler/print-log1.handler";
import EnviaConsoleLog2Handler from "../../domain/event/product/handler/print-log2.handler";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface"
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface{

    async create(entity: Customer): Promise<void> {
    
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        });
        // const eventDispatcher = new EventDispatcher();
        // const eventHandler = new EnviaConsoleLog1Handler();
        // const eventHandler2 = new EnviaConsoleLog2Handler();

        // eventDispatcher.register("CostumerCreatedEvent", eventHandler);
        // eventDispatcher.register("CostumerCreatedEvent", eventHandler2)

        // const costumerCreatedEvent = new CostumerCreatedEvent(entity);
        // eventDispatcher.notity(costumerCreatedEvent);

    }

    async update(entity: Customer): Promise<void> {
        
        await CustomerModel.update({
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        },
        {
            where: {
                id: entity.id
            }
        }
        );
    }

    async find(id: string): Promise<Customer> {
        let customerModel;
        try {
            customerModel = await CustomerModel.findOne({
                where: {
                    id,
                },
                rejectOnEmpty: true,
            });
        } catch(error){
            throw new Error("Customer not found");
        }

        const customer = new Customer(id, customerModel.name);
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zipcode,
            customerModel.city
        );

        customer.changeAddress(address);
        return customer;
    }

    
    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();

        const customers = customerModels.map((customerModels) => {
            let customer = new Customer(customerModels.id, customerModels.name);
            customer.addRewardPoints(customerModels.rewardPoints);
            const address = new Address(
                customerModels.street, 
                customerModels.number, 
                customerModels.zipcode, 
                customerModels.city
            );
            customer.changeAddress(address);
            if(customerModels.active){
                customer.activate();
            }    
            return customer;
        });

        return customers;

    } 

    

}