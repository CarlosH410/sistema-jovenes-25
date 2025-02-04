function generarPDFsConQR() {
    // Abre la hoja de cálculo activa y selecciona la hoja de trabajo
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var datos = hoja.getDataRange().getValues();
    
    // Itera sobre cada fila, omitiendo la primera fila (asumiendo que son encabezados)
    for (var i = 1; i < datos.length; i++) {
      var nombre = datos[i][1];  // Columna B: Nombre y apellido
      var dni = datos[i][3];     // Columna D: DNI
      var idUnico = datos[i][12]; // Columna M: ID único
      var qrUrl = datos[i][13];  // Columna N: URL del código QR
      var mensaje = "Estimado/a " + nombre + ",\nGracias por participar en nuestro campamento. Tu ID es: " + idUnico + ". ¡Esperamos que disfrutes la experiencia!";
      
      // Crea el contenido del PDF con la imagen del QR
      var contenidoHTML = '<html><body>' +
                          '<h1>Detalles del Usuario</h1>' +
                          '<p><strong>Nombre:</strong> ' + nombre + '</p>' +
                          '<p><strong>DNI:</strong> ' + dni + '</p>' +
                          '<p><strong>ID Único:</strong> ' + idUnico + '</p>' +
                          '<p>' + mensaje + '</p>' +
                          '<p><img src="' + qrUrl + '" alt="Código QR"></p>' +
                          '</body></html>';
      
      var blob = Utilities.newBlob(contenidoHTML, 'text/html', 'documento.html').getAs('application/pdf');
      blob.setName('DetalleUsuario_' + idUnico + '.pdf');
      
      // Guarda el archivo en tu Google Drive
      var archivoPDF = DriveApp.createFile(blob);
      var enlacePDF = archivoPDF.getUrl();
      
      // Coloca el enlace en la columna Q (índice 17)
      hoja.getRange(i + 1, 17).setValue(enlacePDF);
    }
    
    Logger.log('Los PDFs han sido generados y los enlaces han sido colocados en la columna Q.');
  }




  //// otro 

  function generarPDFsUsuarios() {
    // ID de la carpeta en Drive donde se guardarán los PDFs
    const CARPETA_ID = 'TU_ID_DE_CARPETA_AQUÍ'; // Reemplaza con tu ID de carpeta
    
    // Obtener la hoja activa
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getActiveSheet();
    
    // Obtener todos los datos
    const datos = hoja.getDataRange().getValues();
    
    // Obtener la carpeta por ID
    const carpeta = DriveApp.getFolderById(CARPETA_ID);
    
    // Procesar cada fila (empezando desde la fila 1 para saltar encabezados)
    for (let i = 1; i < datos.length; i++) {
      // Obtener datos específicos de cada usuario
      const nombreApellido = datos[i][1];  // Columna B
      const dni = datos[i][3];             // Columna D
      const id = datos[i][11];             // Columna L
      const qr = datos[i][12];             // Columna M
      
      try {
        // Crear el PDF directamente usando PDF App
        const contenido = "REGISTRO DE USUARIO\n\n" +
                         "Fecha: " + new Date().toLocaleDateString() + "\n\n" +
                         "DATOS DEL USUARIO:\n" +
                         "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                         "Nombre y Apellido: " + nombreApellido + "\n" +
                         "DNI: " + dni + "\n" +
                         "ID: " + id + "\n" +
                         "Código QR: " + qr + "\n\n" +
                         "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                         "¡Gracias por participar en nuestro campo!\n" +
                         "Esperamos que hayas disfrutado de esta experiencia única.\n" +
                         "¡Te esperamos pronto!\n\n" +
                         "Este documento fue generado automáticamente.";
        
        // Crear archivo temporal de texto
        const blob = Utilities.newBlob(contenido, 'text/plain', 'temp.txt');
        
        // Convertir a PDF usando la API de Drive
        const pdfFile = carpeta.createFile(blob);
        pdfFile.setName(`Datos_${nombreApellido}.pdf`);
        
        // Obtener y guardar el link en la columna Q
        const linkDescarga = pdfFile.getUrl();
        hoja.getRange(i + 1, 17).setValue(linkDescarga);  // Columna Q es 17
        
      } catch (error) {
        Logger.log(`Error al procesar usuario ${nombreApellido}: ${error.toString()}`);
        SpreadsheetApp.getUi().alert(`Error al procesar usuario ${nombreApellido}. Error: ${error.toString()}`);
        return;
      }
    }
    
    // Mostrar mensaje de finalización
    SpreadsheetApp.getUi().alert('PDFs generados exitosamente');
  }
  
  // Función para agregar menú
  function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Gestión Campo')
      .addItem('Generar PDFs Usuarios', 'generarPDFsUsuarios')
      .addToUi();
  }
  
  // Función auxiliar para obtener el ID de una carpeta por su URL
  function obtenerIDCarpeta() {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt(
      'Obtener ID de carpeta',
      'Pega la URL de tu carpeta de Drive:',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (response.getSelectedButton() == ui.Button.OK) {
      const url = response.getResponseText();
      // Extrae el ID de la URL
      const matches = url.match(/[-\w]{25,}/);
      if (matches) {
        ui.alert('ID de la carpeta: ' + matches[0]);
      } else {
        ui.alert('No se pudo encontrar el ID en la URL proporcionada');
      }
    }
  }
  
  // Función alternativa usando Google Docs para mejor formato
  function generarPDFsUsuariosConFormato() {
    // ID de la carpeta en Drive donde se guardarán los PDFs
    const CARPETA_ID = 'TU_ID_DE_CARPETA_AQUÍ'; // Reemplaza con tu ID de carpeta
    
    // Obtener la hoja activa
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getActiveSheet();
    
    // Obtener todos los datos
    const datos = hoja.getDataRange().getValues();
    
    // Obtener la carpeta por ID
    const carpeta = DriveApp.getFolderById(CARPETA_ID);
    
    // Procesar cada fila (empezando desde la fila 1 para saltar encabezados)
    for (let i = 1; i < datos.length; i++) {
      // Obtener datos específicos de cada usuario
      const nombreApellido = datos[i][1];  // Columna B
      const dni = datos[i][3];             // Columna D
      const id = datos[i][11];             // Columna L
      const qr = datos[i][12];             // Columna M
      
      try {
        // Crear un nuevo documento de Google Docs
        const doc = DocumentApp.create(`Datos_${nombreApellido}`);
        const body = doc.getBody();
        
        // Agregar contenido con formato
        body.clear();
        
        // Título
        const titulo = body.appendParagraph('REGISTRO DE USUARIO');
        titulo.setHeading(DocumentApp.ParagraphHeading.HEADING1);
        titulo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        
        // Fecha
        const fecha = body.appendParagraph(`Fecha: ${new Date().toLocaleDateString()}`);
        fecha.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
        
        body.appendParagraph(''); // Espacio
        
        // Datos del usuario con formato
        const datosHeader = body.appendParagraph('DATOS DEL USUARIO');
        datosHeader.setHeading(DocumentApp.ParagraphHeading.HEADING2);
        
        const datos = body.appendParagraph(
          `Nombre y Apellido: ${nombreApellido}\n` +
          `DNI: ${dni}\n` +
          `ID: ${id}\n` +
          `Código QR: ${qr}`
        );
        datos.setFontSize(12);
        
        body.appendParagraph(''); // Espacio
        
        // Mensaje de agradecimiento
        const mensaje = body.appendParagraph(
          '¡Gracias por participar en nuestro campo!\n' +
          'Esperamos que hayas disfrutado de esta experiencia única.\n' +
          '¡Te esperamos pronto!'
        );
        mensaje.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        mensaje.setBold(true);
        
        // Convertir a PDF
        const pdfBlob = doc.getAs('application/pdf');
        const pdfFile = carpeta.createFile(pdfBlob);
        pdfFile.setName(`Datos_${nombreApellido}.pdf`);
        
        // Obtener y guardar el link en la columna Q
        const linkDescarga = pdfFile.getUrl();
        hoja.getRange(i + 1, 17).setValue(linkDescarga);
        
        // Eliminar el documento temporal
        DriveApp.getFileById(doc.getId()).setTrashed(true);
        
      } catch (error) {
        Logger.log(`Error al procesar usuario ${nombreApellido}: ${error.toString()}`);
        SpreadsheetApp.getUi().alert(`Error al procesar usuario ${nombreApellido}. Error: ${error.toString()}`);
        return;
      }
    }
    
    // Mostrar mensaje de finalización
    SpreadsheetApp.getUi().alert('PDFs generados exitosamente');
  }



  /// otro 

  function generarPDFsUsuarios() {
    // ID de la carpeta en Drive donde se guardarán los PDFs
    const CARPETA_ID = 'TU_ID_DE_CARPETA_AQUÍ'; // Reemplaza con tu ID de carpeta
    
    // Obtener la hoja activa
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getActiveSheet();
    
    // Obtener todos los datos
    const datos = hoja.getDataRange().getValues();
    
    // Obtener la carpeta por ID
    const carpeta = DriveApp.getFolderById(CARPETA_ID);
    
    // Procesar cada fila (empezando desde la fila 1 para saltar encabezados)
    for (let i = 1; i < datos.length; i++) {
      try {
        // Obtener datos específicos de cada usuario
        const nombreApellido = datos[i][1];  // Columna B
        const dni = datos[i][3];             // Columna D
        const id = datos[i][11];             // Columna L
        const qr = datos[i][12];             // Columna M
        
        // Crear un nuevo documento
        const doc = DocumentApp.create(`Datos_${nombreApellido}`);
        const body = doc.getBody();
        
        // Limpiar el documento
        body.clear();
        
        // Agregar el título
        body.appendParagraph('REGISTRO DE USUARIO')
            .setHeading(DocumentApp.ParagraphHeading.HEADING1)
            .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        
        // Agregar línea en blanco
        body.appendParagraph('');
        
        // Agregar los datos del usuario
        body.appendParagraph('DATOS DEL USUARIO:')
            .setHeading(DocumentApp.ParagraphHeading.HEADING2);
        
        body.appendParagraph(`Nombre y Apellido: ${nombreApellido}`);
        body.appendParagraph(`DNI: ${dni}`);
        body.appendParagraph(`ID: ${id}`);
        body.appendParagraph(`Código QR: ${qr}`);
        
        // Agregar línea en blanco
        body.appendParagraph('');
        
        // Agregar mensaje
        body.appendParagraph('¡Gracias por participar en nuestro campo!')
            .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
            .setBold(true);
        
        // Guardar y cerrar el documento
        doc.saveAndClose();
        
        // Convertir a PDF
        const pdf = DriveApp.getFileById(doc.getId());
        const pdfBlob = pdf.getAs('application/pdf');
        
        // Guardar PDF en la carpeta especificada
        const pdfFile = carpeta.createFile(pdfBlob);
        pdfFile.setName(`Datos_${nombreApellido}.pdf`);
        
        // Obtener y guardar el link en la columna Q
        const linkDescarga = pdfFile.getUrl();
        hoja.getRange(i + 1, 17).setValue(linkDescarga);
        
        // Eliminar el documento temporal de Google Docs
        pdf.setTrashed(true);
        
      } catch (error) {
        Logger.log(`Error al procesar usuario ${datos[i][1]}: ${error.toString()}`);
        SpreadsheetApp.getUi().alert(`Error al procesar usuario ${datos[i][1]}. Error: ${error.toString()}`);
        continue;
      }
    }
    
    SpreadsheetApp.getUi().alert('PDFs generados exitosamente');
  }
  
  function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Gestión Campo')
      .addItem('Generar PDFs Usuarios', 'generarPDFsUsuarios')
      .addToUi();
  }
  
  function obtenerIDCarpeta() {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt(
      'Obtener ID de carpeta',
      'Pega la URL de tu carpeta de Drive:',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (response.getSelectedButton() == ui.Button.OK) {
      const url = response.getResponseText();
      const matches = url.match(/[-\w]{25,}/);
      if (matches) {
        ui.alert('ID de la carpeta: ' + matches[0]);
      } else {
        ui.alert('No se pudo encontrar el ID en la URL proporcionada');
      }
    }
  }