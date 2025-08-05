
export default interface ApiMessage {
    success:boolean;
    message:string;
    description?:string;
    data?:[];
}