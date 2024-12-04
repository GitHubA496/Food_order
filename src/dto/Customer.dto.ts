import {IsEmail,IsEmpty,Length} from "class-validator";

export class CreateCustomerInput{
    
    @IsEmail()
    email: string;

    @Length(7,12)
    phone : string

    @Length(6,12)
    password : string
}

export interface CustomerPayload{
    _id : string,
    email : string,
    verified : boolean,
}

export class CustomerLoginInput{
    @IsEmail()
    email: string;

    @Length(6,12)
    password: string;
}

export class EditCustomerProfileInputs{

    @Length(3,16)
    firstname: string;

    @Length(3,16)
    lastname: string;

    @Length(6,20)
    address: string;
}

export class OrderInputs{
    _id : string;
    units : number;
}