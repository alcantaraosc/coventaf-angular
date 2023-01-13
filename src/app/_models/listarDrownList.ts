import { bodega } from "./bodega"
import { condicionPago } from "./condicionPago"
import { forma_pagos } from "./forma_pagos"
import { tipo_tarjeta } from "./tipo_tarjeta"


export interface listarDwonList {
    exito: number    
    mensaje: string
    noFactura: string
    tipoDeCambio:number
    bodega: bodega[]
    formaPagos: forma_pagos[]
    tipoTarjeta: tipo_tarjeta[]
    condicionPago: condicionPago[]
}