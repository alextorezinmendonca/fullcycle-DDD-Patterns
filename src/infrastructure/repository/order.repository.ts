import Order from "../../domain/entity/order";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItem from "../../domain/entity/order_item";


export default class OrderRepository implements OrderRepositoryInterface{

    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
              id: entity.id,
              customer_id: entity.customerId,
              total: entity.total(),
              items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
              })),
            },
            {
              include: [{ model: OrderItemModel }],
            }
          );
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total()
            },
            {
                where: { id: entity.id}
            }
        );

        OrderItemModel.destroy({
             where: {order_id: entity.id}
        });
        
        entity.items.forEach(async (item)=>{
            OrderItemModel.create(
            {
                id: item.id,
                product_id: item.productId,
                order_id: entity.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            },
            {
                include: [{model: OrderModel}]
            }

        )});
        
    }

    async find(id: string): Promise<Order>{
        const orderModel = await OrderModel.findOne({
                where: {id : id}, 
                include: [{ model: OrderItemModel }]
        });
            
        return new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
        );
    }

    async findAll(): Promise<Order[]>{
        const orderModel = await OrderModel.findAll({include: [{ model: OrderItemModel }]});
            
        return orderModel.map((orderModel) => new Order(orderModel.id, orderModel.customer_id, 

            orderModel.items.map(
                (item) => new OrderItem(
                    item.id, 
                    item.name, 
                    item.price, 
                    item.product_id, 
                    item.quantity)))
        );
    }

}

