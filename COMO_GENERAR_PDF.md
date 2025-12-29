# Cómo Generar Archivos PDF en tus Proyectos

Esta guía explica cómo se generan los archivos PDF en este repositorio, utilizando las librerías `jspdf` y `jspdf-autotable`. Siguiendo estos pasos, podrás replicar esta funcionalidad en tus propios proyectos de React.

## 1. Librerías Utilizadas

Para la generación de PDFs, se utilizan dos librerías principales:

- **jsPDF**: Es una librería para generar archivos PDF en JavaScript. Permite crear documentos desde cero, agregar texto, formas, imágenes y más.
- **jspdf-autotable**: Es un plugin para `jsPDF` que simplifica la creación de tablas en los documentos PDF.

### Instalación

Para utilizar estas librerías en tu proyecto, primero debes instalarlas a través de npm o yarn:

```bash
npm install jspdf jspdf-autotable
```

## 2. Proceso Detallado de Generación de PDF

El proceso de generación de PDF se encuentra en el archivo `components/Reports.tsx`. A continuación, se detalla el flujo de trabajo implementado en la función `generatePDF`:

### Paso 1: Importar las librerías

Primero, importa las librerías en el archivo donde generarás el PDF:

```javascript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
```

### Paso 2: Crear una instancia de `jsPDF`

Dentro de la función que genera el PDF, crea una nueva instancia de `jsPDF`:

```javascript
const doc = new jsPDF();
```

### Paso 3: Añadir contenido al PDF

Una vez que tienes la instancia del documento, puedes comenzar a agregar contenido:

- **Texto y Encabezados**: Utiliza los métodos `setFontSize()` y `text()` para añadir títulos y párrafos.

  ```javascript
  doc.setFontSize(20);
  doc.text('Reporte de Análisis', 14, 22);
  ```

- **Tablas con `jspdf-autotable`**: Para crear tablas, se utiliza el método `autoTable()`. Este método requiere que definas las cabeceras (`head`) y el cuerpo (`body`) de la tabla.

  ```javascript
  const summaryData = [
    ['Modelo A', 'Canal 1', '25.5', '30.1', '5'],
    ['Modelo B', 'Canal 2', '22.3', '28.9', '2'],
  ];

  autoTable(doc, {
    startY: 45, // Posición vertical donde comienza la tabla
    head: [['Modelo', 'Canal', 'Promedio', 'Máximo', 'Anomalías']],
    body: summaryData,
  });
  ```

### Paso 4: Guardar el archivo PDF

Finalmente, para generar y descargar el archivo, utiliza el método `save()`:

```javascript
doc.save('nombre_del_archivo.pdf');
```

## 3. Ejemplo de Código Completo

A continuación, se muestra un ejemplo simplificado que puedes adaptar a tu proyecto:

```javascript
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GeneradorDeReportes = () => {

  const generarPDF = () => {
    // 1. Crear instancia del documento
    const doc = new jsPDF();

    // 2. Añadir encabezado
    doc.setFontSize(20);
    doc.text('Título del Reporte', 14, 22);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    // 3. Preparar datos para la tabla
    const datosDeTabla = [
      ['Dato 1', 'Dato 2', 'Dato 3'],
      ['Dato 4', 'Dato 5', 'Dato 6'],
    ];

    // 4. Añadir tabla al documento
    autoTable(doc, {
      startY: 40,
      head: [['Columna 1', 'Columna 2', 'Columna 3']],
      body: datosDeTabla,
    });

    // 5. Guardar el PDF
    doc.save('reporte_ejemplo.pdf');
  };

  return (
    <div>
      <button onClick={generarPDF}>
        Descargar Reporte en PDF
      </button>
    </div>
  );
};

export default GeneradorDeReportes;
```

## 4. Replicación en Otros Proyectos

Para replicar esta funcionalidad en tus propios proyectos, sigue estos pasos:

1.  **Instala las dependencias**: `jspdf` y `jspdf-autotable`.
2.  **Crea un componente**: Diseña un componente de React (por ejemplo, un botón) que active la función de generación de PDF.
3.  **Implementa la lógica de generación**: Crea una función que siga los pasos descritos anteriormente:
    -   Importa las librerías.
    -   Crea una instancia de `jsPDF`.
    -   Añade el contenido que necesites (títulos, texto, tablas).
    -   Utiliza el método `save()` para descargar el archivo.

Con estos pasos, podrás integrar la generación de PDFs en cualquier proyecto de React de manera sencilla y eficiente.
