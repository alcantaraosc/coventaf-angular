export interface encabezadoFactura {
    noFactura: string
    fecha: Date
    bodega: string
    caja: string
    tipoCambio: number
    codigoCliente: string
    cliente: string    
    subTotalDolar: number
    descuentoDolar: number
    ivaDolar: number
    totalDolar: number

    subTotalCordoba: number
    descuentoCordoba: number
    ivaCordoba: number
    totalCordoba: number

    formaDePago?:string    
    atentidoPor: string
    observaciones: string
}