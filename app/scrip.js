function doPost(e) {
    const { action, busqueda } = e.parameter; // Obtener los parámetros de la solicitud
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('datosUsuarios'); // Cambia al nombre de tu hoja
    const data = sheet.getDataRange().getValues();
  
    let response;
  
    switch (action) {
      case 'buscarUsuario':
        response = buscarUsuario(data, busqueda);
        break;
      case 'actualizarEstadoAsistencia':
        response = actualizarEstadoAsistencia(sheet, data, busqueda);
        break;
      default:
        response = { resultado: false, mensaje: 'Acción no válida' };
    }
  
    // Devolver la respuesta en formato JSON
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }
  
  function buscarUsuario(data, busqueda) {
    for (let i = 1; i < data.length; i++) {
      // Comparar tanto el ID (columna L) como el DNI (columna D)
      if (data[i][11] == busqueda || data[i][3] == busqueda) { // Usar == para comparar valores sin importar el tipo
        return {
          resultado: true,
          usuario: {
            nombre: data[i][1],       // Columna B
            edad: data[i][2],         // Columna C
            contacto: data[i][5],     // Columna F
            zona: data[i][6],         // Columna G
            iglesia: data[i][7],      // Columna H
            dni: data[i][3],          // Columna D
            id: data[i][11],          // Columna L
            habitacion: data[i][13],  // Columna N
            equipo: data[i][14],      // Columna O
            estado: data[i][15]       // Columna P
          }
        };
      }
    }
    return { resultado: false, mensaje: 'Usuario no encontrado' };
  }
  
  function actualizarEstadoAsistencia(sheet, data, busqueda) {
    for (let i = 1; i < data.length; i++) {
      if (data[i][11] == busqueda || data[i][3] == busqueda) { // Comparar tanto el ID como el DNI
        sheet.getRange(i + 1, 16).setValue("Asistido"); // Columna P (Estado)
        SpreadsheetApp.flush(); // Guardar los cambios
        return { resultado: true, mensaje: 'Asistencia marcada correctamente' };
      }
    }
    return { resultado: false, mensaje: 'Usuario no encontrado' };
  }
  
  
  