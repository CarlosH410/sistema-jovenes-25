document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Capturando los valores de los campos del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Puedes implementar lógica para almacenar los datos o enviarlos a un servidor aquí
    
    // Mostrando un mensaje de éxito
    document.getElementById('successMessage').classList.remove('hidden');
    
    // Limpiando el formulario después de registrarse
    document.getElementById('registerForm').reset();
  });
  



  function onFormSubmit(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
  
    // Generar un ID único basado en el timestamp (marca de tiempo)
    var idUnico = "USR-" + new Date().getTime(); 
    sheet.getRange(lastRow, 5).setValue(idUnico); // Columna 5: ID único
  
    // Generar el código QR usando la API de QuickChart
    var qrUrl = "https://quickchart.io/qr?text=" + encodeURIComponent(idUnico) + "&size=150";
    sheet.getRange(lastRow, 6).setFormula('=IMAGE("' + qrUrl + '")'); // Columna 6: Código QR
  }
  


  function onFormSubmit(e) {
    var sheet = e.source.getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    // Obtener el DNI de la columna D (columna 4)
    var dni = sheet.getRange(lastRow, 4).getValue();
    
    // Generar un ID único basado en el DNI
    var idUnico = dni + '-' + new Date().getTime(); // Combina el DNI con un timestamp
    sheet.getRange(lastRow, 5).setValue(idUnico); // Columna E: ID único
    
    // Generar el código QR usando la API de QuickChart
    var qrUrl = "https://quickchart.io/qr?text=" + encodeURIComponent(idUnico) + "&size=150";
    sheet.getRange(lastRow, 6).setFormula('=IMAGE("' + qrUrl + '")'); // Columna F: Código QR
  }  



  //CODIGO APP.GS

  function onFormSubmit(e) {
    // Verifica si el evento está definido
    if (!e || !e.range) {
      Logger.log("El evento no está definido.");
      return; // Salir si no hay evento
    }
    
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var fila = e.range.getRow(); // Obtener la fila donde se ingresó el formulario
    var dni = hoja.getRange(fila, 4).getValue(); // Leer el DNI de la columna D
    
    // Solo generar ID y QR si hay un DNI
    if (dni) {
      var nuevoID = generarIDBasadoEnDNI(); // Generar un ID aleatorio
      hoja.getRange(fila, 5).setValue(nuevoID); // Asignar el nuevo ID a la columna E
      
      // Generar el código QR con QuickChart.io
      var codigoQRUrl = 'https://quickchart.io/qr?text=' + nuevoID + '&size=500';
      hoja.getRange(fila, 6).setFormula('=IMAGE("' + codigoQRUrl + '")'); // Asignar el QR a la columna F
    }
  }
  
  // Función para generar un ID aleatorio de 3 letras y 3 números
  function generarIDBasadoEnDNI() {
    var letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var id = '';
    
    // Generar 3 letras aleatorias
    for (var i = 0; i < 3; i++) {
      id += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    
    // Generar 3 números aleatorios
    for (var i = 0; i < 3; i++) {
      id += Math.floor(Math.random() * 10); // Genera un número entre 0 y 9
    }
    
    return id; // Retorna el ID formado por letras y números
  }
  
  
  /// funcion busqueda
  function buscarUsuario(busqueda) {
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var datos = hoja.getDataRange().getValues(); // Obtener todos los datos de la hoja
    
    // Recorrer los datos y buscar por ID o DNI
    for (var i = 1; i < datos.length; i++) { // Comenzar en 1 para omitir la cabecera
      if (datos[i][4] == busqueda || datos[i][3] == busqueda) { // Columna E (ID) o columna D (DNI)
        return {
          nombre: datos[i][1], // Columna B (Nombre)
          email: datos[i][2], // Columna C (Email)
          dni: datos[i][3], // Columna D (DNI)
          id: datos[i][4] // Columna E (ID único)
        };
      }
    }
    return null; // Retorna null si no se encuentra el usuario
  }
  
  function actualizarEstadoAsistencia(busqueda) {
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var datos = hoja.getDataRange().getValues(); // Obtener todos los datos de la hoja
  
    // Recorrer los datos y buscar por ID o DNI
    for (var i = 1; i < datos.length; i++) { // Comenzar en 1 para omitir la cabecera
      if (datos[i][4] == busqueda || datos[i][3] == busqueda) { // Columna E (ID) o columna D (DNI)
        hoja.getRange(i + 1, 7).setValue("Asistido"); // Marcar en la columna G (7) como "Asistido"
        return true; // Retornar true si se actualiza correctamente
      }
    }
    return false; // Retorna false si no se encuentra el usuario
  }
  


