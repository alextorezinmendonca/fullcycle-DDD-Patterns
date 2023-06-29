import EventHandlerInterface from "../../@shared/event-handler.interface";
import EventInterface from "../../@shared/event.interface";
import CostumerCreatedEvent from "../costumer-created.event";

export default class EnviaConsoleLog1Handler implements EventHandlerInterface<CostumerCreatedEvent>{
    handle(event: EventInterface): void {
        console.log("Esse é o primeiro console.log do evento: CustomerCreated");
    }
}