export interface pago_pos {
    pago: string
    caja: string
    tipo: string
    condicion_Pago: string
    entidad_Financiera?: string
    Tipo_Tarjeta?: string
    Forma_Pago?: string
    Numero: string
    Monto_Local?: number
    Monto_Dolar: number
    Autorizacion: string
    Fecha_Expiracion?: string
    Cobro?: number
    Cliente_Liquidador?: string
    Tipo_Cobro?: string
    Referencia: string
    Num_Seguimiento?: string
    num_Transac_Tarjeta?: string
    Campo1?: string
    Valor1?: string
    Campo2?: string
    Valor2?: string
    Campo3?: string
    Valor3?: string
    Campo4?: string
    Valor4?: string
    Campo5?: string
    Valor5?: string
    Campo6?: string
    Valor6?: string
    Noteexistsflag?: number
    Recorddate: Date
    Rowpointer: string
    Createdby: string
    Updatedby: string
    Createdate: Date
}