import Frage from "./Frage";

export default class Vorlesung{
    constructor(public id:number, public name:string, public fragen:Frage[]){}
}