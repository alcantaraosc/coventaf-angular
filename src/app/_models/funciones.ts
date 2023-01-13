import { funcionesRoles } from "./funcionesRoles"

export interface funciones {

    funcionID:number
    nombreFuncion: string
    codigo: string
    descripcion: string
    activo:boolean
    fechaCreacion:Date
    fechaModificacion?: Date
    titulo?: string
    funcionesRoles?: funcionesRoles[]
    
}