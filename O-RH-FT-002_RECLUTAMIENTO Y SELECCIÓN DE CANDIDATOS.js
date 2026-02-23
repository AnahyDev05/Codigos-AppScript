function onOpen() { 
    var ui = SpreadsheetApp.getUi();
  var mensaje = "⚠️ IMPORTANTE ⚠️"
    + "\n- Esta es una plantilla automatizada:"
    + "\n- 🚫 No agregar o quitar columnas ni filas."
    + "\n- 🚫 No alterar las fórmulas."
    + "\n- 🚫 No modificar la posición de tablas o rangos."

    + "\n- 🔷 Llena TODAS las columnas antes de seleccionar 'SI' en la columna BK de ALTA"


    + "\n- ☎︎ Para modificaciones, contacta al área de PROYECTOS"

    + "\n- — Versión 2"

  ui.alert(mensaje);
}
////////////////
// Copia una fila específica (número) de "ENTREVISTAS" a "Hoja 10" del libro destino
function altasFila(fila) {
  try {
    var ssOrigen = SpreadsheetApp.getActiveSpreadsheet();
    var hojaOrigen = ssOrigen.getSheetByName("ENTREVISTAS");
    if (!hojaOrigen) {
      throw new Error("No se encontró la hoja 'ENTREVISTAS' en el archivo activo.");
    }

    // Validar fila
    if (!fila || fila < 1) {
      throw new Error("Número de fila inválido: " + fila);
    }

    // Leer toda la fila del origen
    var numCols = hojaOrigen.getLastColumn();
    var valoresFila = hojaOrigen.getRange(fila, 1, 1, numCols).getValues()[0];

    // Mapear columnas (base 0 en el array)
    var valorNombre = valoresFila[5];   // Columna F //nombre
    var valorESivil = valoresFila[8];   // Columna I //estado civil
    var valorDepto = valoresFila[0];    // Columna A //area = departamento
    var valorPuesto = valoresFila[1];   // Columna B //puesto
    var valorNivEstudio = valoresFila[13];   // Columna N //nivel de estudios

    var valorFaIn1 = valoresFila[18];   // Columna S //FAMILIAR INTERNO 1
    var valorPar1 = valoresFila[19];   // Columna T //PARENTESCO 1
    var valorArea1 = valoresFila[20];   // Columna U //ÁREA 1
    var valorFaIn2 = valoresFila[21];   // Columna V //FAMILIAR INTERNO 2
    var valorPar2 = valoresFila[22];   // Columna W //PARENTESCO 2
    var valorArea2 = valoresFila[23];   // Columna X //ÁREA 2
    var valorFaIn3 = valoresFila[24];   // Columna Y //FAMILIAR INTERNO 3
    var valorPar3 = valoresFila[25];   // Columna Z //PARENTESCO 3
    var valorArea3 = valoresFila[26];   // Columna AA //ÁREA 3
    
    var valorLinkPsic = valoresFila[54];   // Columna BC //LINK PSICOMETRICOS modv 18/12/2025
    var valorLinkMED = valoresFila[55];   // Columna BD //LINK MEDICOS modv 18/12/2025
    var valorLinkPOLI = valoresFila[56];   // Columna BE //LINK POLIGRAFOS modv 18/12/2025
    
    //nueva 18/12/2025
    var valorPrueba15Dias = valoresFila[63];   // Columna BL //PRUEBA 15 DÍAS 
    
    var valorAlta = valoresFila[65];    // Columna BN (66) //onEdit modv 18/12/2025

    // Solo continuar si hay algo en la columna AZ
    if (String(valorAlta).trim().toLocaleUpperCase() !== "SI") {
     // Logger.log("La columna AZ está vacía en la fila " + fila + ". No se procesó.");
      Logger.log("La columna BO está vacía en la fila " + fila + ". No se procesó.");
      return;
    }

    // Verificar que haya datos relevantes
    if ((valorNombre === "" || valorNombre === null) &&
        (valorESivil=== "" || valorESivil === null) &&
        (valorDepto === "" || valorDepto === null) &&
        (valorPuesto === "" || valorPuesto === null) &&
        (valorNivEstudio === "" || valorNivEstudio === null) &&
        (valorFaIn1 === "" || valorFaIn1 === null) &&
        (valorPar1 === "" || valorPar1 === null) &&
        (valorArea1 === "" || valorArea1 === null) &&
        (valorFaIn2 === "" || valorFaIn2 === null) &&
        (valorPar2 === "" || valorPar2 === null) &&
        (valorArea2 === "" || valorArea2 === null) &&
        (valorFaIn3 === "" || valorFaIn3 === null) &&
        (valorPar3 === "" || valorPar3 === null) &&
        (valorArea3 === "" || valorArea3 === null) &&
        (valorLinkPsic === "" || valorLinkPsic === null) &&
        (valorLinkMED === "" || valorLinkMED === null) &&
        (valorLinkPOLI === "" || valorLinkPOLI === null) &&
        (valorPrueba15Dias === "" || valorPrueba15Dias === null)) {
      Logger.log("No hay datos en Nombre/Puesto/Depto en la fila " + fila + ". No se procesó.");
      return;
    }

    // Preparar datos a enviar
    var fechaHoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yy"); //HojaDestino 9

    // Abrir libro destino por ID y obtener hoja destino
    var destinoId = '1oXd2MeuZawr6XI5FehGbVtBMCHkMz4lav8f23e04iM4'; // <- tu ID
    var libroDestino = SpreadsheetApp.openById(destinoId);
    var hojaDestino = libroDestino.getSheetByName("RESTRUCTURACION");
    if (!hojaDestino) {
      throw new Error("No se encontró la hoja 'Hoja 10' en el libro destino.");
    }

    // Calcular siguiente fila vacía y escribir datos (sin tocar columna E)
    var filaDestino = obtenerUltimaFila(hojaDestino, 4, 6);//
    //var filaDestino = obtenerUltimaFila(hojaDestino, 3, 4);
    var filaD = filaDestino + 1;
    //hojaDestino.getRange(filaD, 1, 1, 4).setValues([[valorNombre, valorDepto, valorPuesto, fechaHoy]]);
    hojaDestino.getRange(filaD, 3).setValue(valorNivEstudio);//columna C
    hojaDestino.getRange(filaD, 4).setValue(valorNombre);//columna C
    hojaDestino.getRange(filaD, 5).setValue(valorESivil);//columna D
    hojaDestino.getRange(filaD, 6).setValue(valorDepto);//columna E
    hojaDestino.getRange(filaD, 7).setValue(valorPuesto);//columna F

    // Luego asignar “ACTIVO” solo si la celda ya tiene esa opción
    var celdaEstado = hojaDestino.getRange(filaD, 11)//activo
    var celdaFecha = hojaDestino.getRange(filaD, 10)//fecha
    if (celdaEstado.getValue() === "" && celdaFecha.getValue() === "") {
      celdaEstado.setValue("ACTIVO");
      celdaFecha.setValue(fechaHoy);
    }
    
    hojaDestino.getRange(filaD, 30).setValue(valorFaIn1);//columna AC
    hojaDestino.getRange(filaD, 31).setValue(valorPar1);//columna AD
    hojaDestino.getRange(filaD, 32).setValue(valorArea1);//columna AE
    hojaDestino.getRange(filaD, 33).setValue(valorFaIn2);//columna AF
    hojaDestino.getRange(filaD, 34).setValue(valorPar2);//columna AG
    hojaDestino.getRange(filaD, 35).setValue(valorArea2);//columna AH
    hojaDestino.getRange(filaD, 36).setValue(valorFaIn3);//columna AI
    hojaDestino.getRange(filaD, 37).setValue(valorPar3);//columna AJ
    hojaDestino.getRange(filaD, 38).setValue(valorArea3);//columna AK

    hojaDestino.getRange(filaD, 41).setValue(valorLinkPsic);//columna AO
    hojaDestino.getRange(filaD, 43).setValue(valorLinkMED);//columna AQ
    hojaDestino.getRange(filaD, 45).setValue(valorLinkPOLI);//columna AS
    
    hojaDestino.getRange(filaD, 47).setValue(valorPrueba15Dias);//NUEVO Col. AU


    Logger.log("✅ Fila " + fila + " procesada. Datos enviados a fila destino " + filaD + ": " + valoresFila.join(", "));
  } catch (err) {
    Logger.log("❌ Error en altasFila: " + err);
    throw err; // opcional: lanzar para ver el error al ejecutar manualmente
  }
}

function activadorAltas(e) {
  try {
    if (!e) return;

    const hoja = e.range.getSheet();
    const fila = e.range.getRow();
    const columna = e.range.getColumn();
    const valor = String(e.value || "").trim().toUpperCase();

    // 1️⃣ SOLO hoja ENTREVISTAS
    if (hoja.getName() !== "ENTREVISTAS") return;

    // 2️⃣ SOLO columna BN (66)
    if (columna !== 66) return;

    // 3️⃣ SOLO cuando sea "SI"
    if (valor !== "SI") return;

    // 4️⃣ Lock para evitar dobles ejecuciones
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(2000)) return;

    altasFila(fila);

    lock.releaseLock();

  } catch (err) {
    Logger.log("❌ Error activadorAltas: " + err);
  }
}



// Función para obtener la última fila con datos en una columna específica
function obtenerUltimaFila(hoja, columna, filaInicio) {
  const datos = hoja.getRange(filaInicio, columna, hoja.getLastRow() - filaInicio + 1).getValues();

  for (let i = datos.length - 1; i >= 0; i--) {
    if (datos[i][0] !== "") { // Verifica si hay datos en la celda
      return filaInicio + i;
    }
  }

  return filaInicio - 1; // Retorna filaInicio - 1 si no hay datos en la columna
}
