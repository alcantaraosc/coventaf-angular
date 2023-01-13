export interface usuarios {    
    usuario: string
    nuevoUsuario: boolean
    nombre: string
    tipo: string
    activo: string  
    req_Cambio_Clave: string    
    frecuencia_Clave: number
    fecha_Ult_Clave: Date 
    max_Intentos_Conex: number
    clave?: string   
    correo_Electronico?: string
    tipo_Acceso: string
    celular?: string  
    tipo_Personalizado?: string
    noteExistsFlag: number
    recordDate: Date
    rowPointer: string
    createdBy: string
    updatedBy: string
    createDate: Date
    claveCifrada?: string
    confirmarClaveCifrada?: string
    grupo?: string
    titulo?: string
}