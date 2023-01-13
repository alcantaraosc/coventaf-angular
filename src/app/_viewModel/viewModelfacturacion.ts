import { facturas } from "../_models/facturas";
import { factura_linea } from "../_models/factura_linea";


export interface viewModelfacturacion {
    factura: facturas
    facturaLinea: factura_linea[];
}