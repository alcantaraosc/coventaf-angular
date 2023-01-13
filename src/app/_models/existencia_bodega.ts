export interface existencia_bodega {
    ARTICULO: string
    BODEGA: string
    EXISTENCIA_MINIMA: number
    EXISTENCIA_MAXIMA: number
    PUNTO_DE_REORDEN: number
    CANT_DISPONIBLE: number
    CANT_RESERVADA: number
    CANT_NO_APROBADA: number
    CANT_VENCIDA: number
    CANT_TRANSITO: number
    CANT_PRODUCCION: number
    CANT_PEDIDA: number
    CANT_REMITIDA: number
    CONGELADO: string
    FECHA_CONG?: Date
    BLOQUEA_TRANS: string
    FECHA_DESCONG?: Date
    COSTO_UNT_PROMEDIO_LOC: number
    COSTO_UNT_PROMEDIO_DOL: number
    COSTO_UNT_ESTANDAR_LOC: number
    COSTO_UNT_ESTANDAR_DOL: number
    COSTO_PROM_COMPARATIVO_LOC: number
    COSTO_PROM_COMPARATIVO_DOLAR: number
    NoteExistsFlag: number
    RecordDate: Date
    RowPointer: string
    CreatedBy: string
    UpdatedBy: string
    CreateDate: Date

}