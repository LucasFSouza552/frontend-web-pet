export default interface IAddress {
    street: string;
    number: string;
    complement?: string;
    city: string;
    cep: string;
    state: string;
    neighborhood: string;
}