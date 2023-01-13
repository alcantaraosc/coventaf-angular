import { roles } from "./roles"

export class User {    
    usuario: string      
    token: string
    expireAt: Date
    roles: roles[]   
}