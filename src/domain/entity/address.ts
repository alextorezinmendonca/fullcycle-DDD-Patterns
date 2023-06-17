export default class Address{
    
    private _street: string = "";
    private _number: number = 0;
    private _zip: string = "";
    private _city: string = "";

    constructor(stree: string, number: number, zip: string, city: string){

        this._street = stree;
        this._number = number;
        this._zip = zip;
        this._city = city;

        this.validate();
    }

    validate(){
        if(this._street.length === 0){
            throw new Error("Street is required")
        }
        if(this._number === 0){
            throw new Error("number is required")
        }
        if(this._zip.length === 0){
            throw new Error("zip is required")
        }
        if(this._city.length === 0){
            throw new Error("city is required")
        }
    }

    toString(){
        return `${this._street}, ${this._number}, ${this._zip}, ${this._city},`;
    }

    get street(): string{
        return this._street;
    }

    get number(): number{
        return this._number;
    }

    get zip(): string{
        return this._zip;
    }

    get city(): string{
        return this._city;
    }

}