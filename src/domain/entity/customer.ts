import Address from "./address";    

export default class Customer{
    
    private _id: string;
    private _name: string = "";
    private _address!: Address; //Inicializa em branco (!)
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name:string){
        this._id = id;
        this._name = name;
        this.validate();
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