export interface varFacturacion {
    consecutivoActualFactura: number
    inputActivo:string
    idActivo: string
    //indica si el descuento esta aplicado o no esta aplicado
    descuentoActivo: boolean
    //indica si el descuento es del beneficio o descuento es de Linea
    descBeneficioOrDescLinea: string
    visibleTipoTarjeta: string
    visibleCondicionPago: string
    
    //descuento que el cliente
    tipoDeCambio: number
    bodegaId: string;
    nivelPrecio: string

    //mostrar los datos del cliente en el html
    nombreCliente: string
    saldoDisponible: number    
    porcentajeDescCliente: number
   
   // fechaDay = new Date();

    /**Totales */
    subTotalDolar: number 
    subTotalCordoba: number
    //descuento
    descuentoDolar: number
    descuentoCordoba: number 
    //subtotales 
    descuentoGeneral: number
    subTotalDescuentoDolar: number
    subTotalDescuentoCordoba: number
    ivaCordoba: number
    ivaDolar: number
    totalDolar: number 
    totalCordobas: number
    totalUnidades: number
    fechaFactura: Date  
    //desactivar y activar el check DSD(Descuento Sobre Descuento)
    checkDisabledDSD: boolean

    desactivarBotonValDes: boolean
    desactivarBotonGuardar: boolean
}