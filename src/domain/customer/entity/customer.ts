import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../event/customer-created.event";
import EnviaConsoleLog1Handler from "../event/handler/print-log1.handler";
import EnviaConsoleLog2Handler from "../event/handler/print-log2.handler";
import EnviaConsoleLogChangeAddressHandler from "../event/handler/print-log-change-address.handler";
import Address from "../value-object/address";
import CustomerChangeAddressEvent from "../event/customer-change-address-event";

export default class Customer{
    
    private _id: string;
    private _name: string;
    private _address!: Address; //Inicializa em branco (!)
    private _active: boolean = true;
    private _rewardPoints: number = 0;
    private _eventDispatcher : EventDispatcher;
    private static _eventHandler : EnviaConsoleLog1Handler;
    private static _eventHandler2 : EnviaConsoleLog2Handler;
    private static _eventChangeAddressHandler : EnviaConsoleLogChangeAddressHandler;

    constructor(id: string, name:string){
        this._id = id;
        this._name = name;
        this.validate();
        this._eventDispatcher = new EventDispatcher();
        this._eventDispatcher.register("CustomerCreatedEvent", Customer._eventHandler);
        this._eventDispatcher.register("CustomerCreatedEvent", Customer._eventHandler2);
        this._eventDispatcher.register("CustomerChangeAddressEvent", Customer._eventChangeAddressHandler)

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: this._id,
            name: this._name,
        });
         this._eventDispatcher.notity(customerCreatedEvent);
    }
    static getChangeAddressEventHandler(){
        return Customer._eventChangeAddressHandler = new EnviaConsoleLogChangeAddressHandler();
    }
    static getEventHandler1(){
        return Customer._eventHandler = new EnviaConsoleLog1Handler();
    }
    static getEventHandler2(){
        return Customer._eventHandler2 = new EnviaConsoleLog2Handler();
    }

    validate(){
        if (this._id.length === 0){
            throw new Error("ID is required")
        }
        if (this._name.length === 0){
            throw new Error("Name is required");
        }

    }

    isActive(): boolean{
        return this._active;
    }
    
    get active(): boolean{
        return this._active;
    }
    changeName(name: string){
        this._name = name;
        this.validate();
    }

    addRewardPoints(points: number){
        this._rewardPoints += points;
    }

    get rewardPoints(): number{
        return this._rewardPoints;
    }

    activate(){
        if (this._address === undefined){
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate(){
        this._active = false;
    }

    changeAddress(address: Address) {
        this._address = address;

        const customerChangeAddressEvent = new CustomerChangeAddressEvent({
            id: this._id,
            name: this._name,
            address: this._address,
        });
         this._eventDispatcher.notity(customerChangeAddressEvent);
    }
    
    get id(): string{
        return this._id;
    }

    get name(): string{
        return this._name;
    }

    get address(): Address{
        return this._address;
    }

    set name(name:string){
        this._name = name;
    }

    set address(address: Address){
        this._address = address;
    }



}