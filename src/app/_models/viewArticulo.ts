export interface viewArticulo {
    articuloID: string,
    codigoBarra?: string,
    descripcion: string,
    precio:number,
    existencia: number,
    bodegaID:string,
    nombreBodega: string,
    nivelPrecio: string,
    moneda: string
    descuento: number
}