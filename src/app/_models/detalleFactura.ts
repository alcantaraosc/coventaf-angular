export interface detalleFactura {
    consecutivo: number
    articuloId: string
    inputArticuloDesactivado: boolean
    codigoBarra: string
    descripcion: string
    unidad: string
    cantidad: number
    cantidadExistencia: number
    inputCantidadDesactivado: boolean
    precioDolar: number
    precioCordobas: number
    subTotalDolar: number
    subTotalCordobas: number    
    porCentajeDescuento: number
    descuentoInactivo:number
    descuentoDolar: number
    descuentoCordoba: number
    descuentoTotalGeneral: number
    totalDolar: number 
    totalCordobas: number  
    //con esta propiedad controlo si ya tengo en la lista 
    //el unico input para buscar el proximo articulo
    inputActivoParaBusqueda: boolean
    botonEliminarDesactivado: boolean
}
