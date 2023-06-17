import Address from './domain/entity/address';
import Customer from './domain/entity/customer';
import OrderItem from './domain/entity/order_item';
import Order from './domain/entity/order';

//Aggregate from customer
//Relation by entity
let customer = new Customer("123", "Alex Mendonça");
const address = new Address("Rua x", 885, "15000-00", "Rio Preto");
customer.address = address;
customer.activate();

    //  /\
    //  |
    //  |     Relation by ID number
    //  |
    //  \/

//Aggregetate relation from order
//Relation by object - entity
const item1 = new OrderItem("1", "item1", 10, 'QA01', 2);
const item2 = new OrderItem("2", "item2", 20, 'QA02', 3);
const order = new Order("1", "123", [item1, item2]) //The same customer number ID to link Order and Customer.!! (123)
