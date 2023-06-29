import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface{

    private eventHandlers: {[evenName: string]: EventHandlerInterface[] } = {};

    get getEventHandlers(): {[eventName: string]: EventHandlerInterface[]} {
        return this.eventHandlers;
    }

    register(eventName: string, eventHandler: EventHandlerInterface): void{
        if (!this.eventHandlers[eventName]){
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(eventHandler);
    }

    unregister(eventName: string, eventHandler: EventHandlerInterface): void {
        if (this.eventHandlers[eventName]){
            const index = this.eventHandlers[eventName].indexOf(eventHandler);
            if(index !== -1){
                this.eventHandlers[eventName].splice(index, 1);
            }
            
        }
    }

    unregisterAll(): void {
        this.eventHandlers = {};
    }

    notity(event: EventInterface): void{

        const evenName = event.constructor.name;
        if(this.eventHandlers[evenName]){
            this.eventHandlers[evenName].forEach((eventHandler) => {
                eventHandler.handle(event);
            })
        }
        
    }
}