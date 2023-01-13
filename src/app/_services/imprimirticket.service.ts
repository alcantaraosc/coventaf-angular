import { style } from '@angular/animations';
import { Injectable } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { detalleFactura } from '../_models/detalleFactura';
import { encabezadoFactura } from '../_models/encabezadoFactura';
import { listarDwonList } from '../_models/listarDrownList';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Injectable({
  providedIn: 'root'
})
export class ImprimirticketService {

  private generarDetalleFactura(datDetalleFact: detalleFactura[]){
    let script=[{
      fontSize: 7,
      bold: true,
      with: 'auto',
      columns: [
        { text: 'Codigo' }, { text: 'Cant' }, { text: 'Precio' }, { text: '%' }, { text: 'Monto' }
      ]
         
    },
    {
      stack: [ {text: '', style:'' } ]
    }
  ];

    //agregar una linea
    const agregarLineaFactura = {
      stack:[{ text: '----------------------------------------------------', style: ''}]            
    }
     //agregar una linea
    script.push(agregarLineaFactura);              
    

    for(var fact of  datDetalleFact){      
      //comprobar si existe el codigo de barra
      if (fact.codigoBarra.length > 0) {
          const datos_ =  {
            fontSize: 7,
            bold: false,
            with: 'auto',
            style: fact.consecutivo==0 ? '': 'margenEspacio',
            columns: [
                        { text: fact.articuloId }, 
                        { text: fact.cantidad.toFixed(2).toString() } ,
                        { text: fact.precioCordobas.toFixed(2).toString() },
                        { text: fact.porCentajeDescuento.toFixed(2).toString() },
                        { text: fact.subTotalCordobas.toFixed(2).toString() }
                        
                ],
            
          }    
          script.push(datos_);

          //agregar la descripcion en una sola fila
          const datosDescripcion = {
            stack:[{ text: fact.descripcion , style: 'config'} ]            
          }
          script.push(datosDescripcion);              
      }
    }

    return script;
    
  }



  imprimirTicketFactura( datDetalleFact: detalleFactura[], datEncabezadoFactura: encabezadoFactura){
  
    let nombreEstablecimiento: string ="TIENDA DE ELECTRODOMESTICO";
    let direccion: string ="Km 6 Carretera Norte, 700 Mts al norte";
    let direccion2: string = "Puente a Desnivel";
    let telefono: string = "Tel:(505)22493187 Fax: 22493184";

    var docDefinition : any  = {
      // a string or { width: number, height: number }
      pageSize: {
        width: 180,
        height: 3000
      },
      //pageSize: 'C8',

      // by default we use portrait, you can change it to landscape if you wish
      //pageOrientation: 'landscape',
    
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 5, 0, 0, 0 ],

          content: [
      
          {
            stack: [			 
              {text: 'EJERCITO DE NICARAGUA', style:'header'  },
              {text: nombreEstablecimiento, style: 'header'},          
            ]      
          },

          {
            stack: [
              {text: direccion,  style: 'subheader'},
              {text: direccion2,  style: 'subheader'},
              {text: 'Managua, Nicaragua',  style: 'subheader'},
              {text: telefono,  style: 'subheader'},   
              { text: 'N° RUC: J1330000001272'},
              {text: '\n'},        
            ],
            style: 'subheader'
          },

          {
            stack: [             
              { text: `No Factura: ${datEncabezadoFactura.noFactura}` },
              { text: `Cliente: (${datEncabezadoFactura.codigoCliente}) ${datEncabezadoFactura.cliente}`},
              { text: `Fecha: ${ datEncabezadoFactura.fecha }`},                    
              { text: `Bodega: ${datEncabezadoFactura.bodega}`},
              { text: `Caja: ${datEncabezadoFactura.caja}`},  
              { text: `Tipo Cambio: ${datEncabezadoFactura.tipoCambio.toString()}`},  
              { text: '\n'},
              { text: '----------------------------------------------------------------------------------------' }                          
            ],
            style: 'config'
          },


        /* detalle de la tabla */
        this.generarDetalleFactura(datDetalleFact),
          /*-------- */
          {
          fontSize: 7,         
          alignment: 'left',  
          stack: [
            { text: '------------------------------------------------------------------------------------------'},
          ]
          
        },

        {
          fontSize: 7,
          bold: true,
          with: 'auto',
          columns: [
            { text: '' }, { text: 'Sub Total:', style: 'alingmentLetraTotales' }, { text: '' }, { text: datEncabezadoFactura.subTotalCordoba, style: 'alingmentMontosTotales' }

          ]
             
        },

        {
          fontSize: 7,
          bold: true,
          with: 'auto',
          columns: [
            { text: '' }, { text: 'Descuento:', style: 'alingmentLetraTotales' }, { text: '' }, { text: datEncabezadoFactura.descuentoCordoba, style: 'alingmentMontosTotales' }

          ]
             
        },

        {
          fontSize: 7,
          bold: true,
          with: 'auto',
          columns: [
            { text: '' }, { text: 'IVA:', style: 'alingmentLetraTotales' }, { text: '' }, { text:  datEncabezadoFactura.ivaCordoba, style: 'alingmentMontosTotales'  }

          ]
             
        },

        {
          fontSize: 7,
          bold: true,
          with: 'auto',
          columns: [
            { text: '' }, { text: 'Total:', style: 'alingmentLetraTotales' }, { text: '' }, { text:  datEncabezadoFactura.totalCordoba, style: 'alingmentMontosTotales' }

          ]
             
        },

        {
          fontSize: 7,
          bold: true,
          with: 'auto',
          columns: [
            { text: '' },  { text: 'Total:', style: 'alingmentLetraTotales'}, { text: '' },  { text:  datEncabezadoFactura.totalDolar, style: 'alingmentMontosTotales' }
          ]
             
        },


       /*{          
          stack: [
            { text: `Sub Total:  ${datEncabezadoFactura.subTotalCordoba.toString()}`},
            { text: `Descuento: ${datEncabezadoFactura.descuentoCordoba}`},
            { text: `IVA:  ${datEncabezadoFactura.ivaCordoba}`},
            { text: `Total: ${datEncabezadoFactura.totalCordoba}`},   
            { text: `Total: ${ datEncabezadoFactura.totalDolar }`},                       
            { text: '\n'},  
          
          ],
          style: 'totales'
        },*/

        {
          stack: [
            { text: `Forma de Pago: ${datEncabezadoFactura.formaDePago.toString()}`},  
            { text: '\n'},      
            { text: `Observaciones: ${datEncabezadoFactura.observaciones.toString()}`},                                
            { text: '\n'},                 
            { text: `Atendido por: ${datEncabezadoFactura.atentidoPor.toString()}` }, 
            { text: '\n'},           
            { text: `ENTREGADO: `},   
            { text: '\n'},                    
            { text: `RECIBIDO: `, },                     
            { text: '\n'},                
          ],

          style:'footer'
        },

        {
          fontSize: 7,
          bold: true,
          alignment: 'center',
          stack: [
            { text: `NO SE ACEPTAN CAMBIOS DESPUES DE`},                                               
            { text: `48 HORAS *APLICAN RESTRICCIONES*`},   
            { text: '\n'},                    
            { text: `GRACIAS POR SU COMPRA`, },                     
            { text: '\n'},                
          ],
          
        }

        ],

        styles: {
          header: {
            fontSize: 7,
            bold: true,
            alignment: 'center',
            margin: [0,0, 0, 0]
          },

          subheader: {
            fontSize: 7,               
            alignment: 'center',
          },
          config: {
            fontSize: 7,       
            alignment: 'left',
            margin: [0, 0, 0, 0]
          },

          margenEspacio: {
            margin: [0, 5, 0, 0]
          },

          totales:{
            fontSize: 7,       
            alignment: 'right',
            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
            margin: [0, 0, 15, 0]
          },

          footer: {
            fontSize: 7,       
            alignment: 'left',
            margin: [0, 5, 0, 0]
          } ,
          
        alingmentLetraTotales: {
          alignment: 'right',
        },

        alingmentMontosTotales: {
          alignment: 'left',
        }
      }
    }

    pdfMake.createPdf(docDefinition).open();
    //pdfMake.createPdf(docDefinition).print({}, window);

    //this.generatePDF();
  }


  generatePDF() {
    var win = window.open('', '_self');
    setTimeout (() => {
        const documentDefinition = {
          content: 'CONTENIDO DEL PDF'
        };
        pdfMake.createPdf(documentDefinition).print({}, win);
    }, 1000)
  }



   iterarCiclo(datDetalleFact: detalleFactura[]){
    let articulo: string
    for (let data of datDetalleFact ){
      articulo: data.articuloId        
    }

    return articulo;
   }
 
  
}
