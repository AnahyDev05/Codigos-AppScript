function identificador() { //version  V0.1
  var hojaDestino = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("IDENTIFICADOR Base de Datos Despacho");
  //var unionAreSubareaDestino = hojaDestino.getRange("G2:I" + hojaDestino.getLastRow()).getValues();
  
  //datos del archivo destino
  var unionQSolicitaForPagoDt = hojaDestino.getRange("B2:AC" + hojaDestino.getLastRow()).getValues(); //B2:AC -> C2:R

  //hoja origen
  var libroOriginal = SpreadsheetApp.openById("178M33EaTbv6rT6CA2XkA_csJlMoBI9Ej3s1T_7hq0no");
  var hojaOriginal = libroOriginal.getSheetByName("DIR-CAT-SUBCAT");

  //nuevo sacar la forma de pago
  var dataOrigenMetoPago = hojaOriginal.getRange("AQ3:AR" + hojaOriginal.getLastRow()).getValues();

  //sacar la ciclico para su comparacion de nombre de usuario.
  var dataQuiensolicita = hojaOriginal.getRange("AV2:AX" + hojaOriginal.getLastRow()).getValues();

  //crear mapa Metodo de pago
  var metodoPago = {};
  dataOrigenMetoPago.forEach(function (fila) {
    if(fila[0]){
      metodoPago[fila[0]] = fila[1];//sacar la posicion AR de la hoja master. 
    }
  });


  //crear quien solicita
  var quienSolicita = {};
  dataQuiensolicita.forEach(function (fila) {
    if(fila[0]){
      quienSolicita[fila[0]] = [fila[1], fila[2]];
    }
  });

   //union
   var identi = [];
   var numeroInicial = obtenerUltimoConsecutivo(hojaDestino);
   var mapaFiltros = {}; // Guarda los filtros ya procesados
   var contador = numeroInicial;

  for(var i=0; i<unionQSolicitaForPagoDt.length; i++){//A2:A61698
    var fecha = unionQSolicitaForPagoDt[i][0];
    var quiensolicita1 = unionQSolicitaForPagoDt[i][1]; //para la comparacion
    var formaPago = unionQSolicitaForPagoDt[i][16];
    var detallePago = unionQSolicitaForPagoDt[i][17];
    var destino = unionQSolicitaForPagoDt[i][19];
    var cuenta_clave = unionQSolicitaForPagoDt[i][20];

    
    

    // Crear clave única con los filtros
    var claveFiltro = fecha + "|" + formaPago + "|" + detallePago + "|" + destino + "|" + cuenta_clave;

    if(metodoPago[formaPago] && quienSolicita[quiensolicita1]){

      // Si no existe esta combinación de filtros, generar nuevo ID
      if(!mapaFiltros[claveFiltro]){
          mapaFiltros[claveFiltro] = String(contador).padStart(6, "0");
          contador++;
      }

      identi.push(
        metodoPago[formaPago] + "-"+ //Col.metodo de pago
        quienSolicita[quiensolicita1][0] + "-" + //Col. solictu de persona solicitante
        quienSolicita[quiensolicita1][1] + "-" + //Col. solictu de persona solicitante
        mapaFiltros[claveFiltro]
      );
      numeroInicial++;
    }else{
      identi.push("");
    }
  }


  // 🔑 convertir a matriz
  var salida = identi.map(v => [v]);

  if (salida.length > 0) {
    var inicioPegado = ultimaFilaNoVaciaV2(hojaDestino);
    hojaDestino
      .getRange(inicioPegado + 1, 1, salida.length, 1)
      .setValues(salida);

  }  
}

function obtenerUltimoConsecutivo(hoja) {
  var ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return 1;

  var ultimoValor = hoja.getRange(ultimaFila, 1).getValue(); // col A
  if (!ultimoValor) return 1;

  var partes = ultimoValor.split("-");
  var numero = parseInt(partes[partes.length - 1], 10);

  return isNaN(numero) ? 1 : numero + 1;
}


function ultimaFilaNoVaciaV2(hoja) {
  if (!hoja) {
    Logger.log("La hoja "+ hoja + " no existe.");
    return;
  }
  
  const columna = hoja.getRange("A:A").getValues(); // Obtiene todos los valores de la columna B
  let ultimaFila = 0;

  // Iterar desde el final hacia arriba para encontrar la última fila con datos
  for (let i = columna.length - 1; i >= 0; i--) {
    if (columna[i][0] !== "") {
      ultimaFila = i + 1; // +1 porque los índices comienzan en 0
      break;
    }
  }

  return ultimaFila;
 // Logger.log(`La última fila con datos en la columna A de 'solicitudes' es: ${ultimaFila}`);
}
