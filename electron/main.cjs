const { app, BrowserWindow } = require('electron');
const path = require('path');

// Mantener referencia global del objeto window
let mainWindow;

function createWindow() {
    // Crear la ventana del navegador
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, '../resources/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        autoHideMenuBar: true, // Ocultar barra de menú para apariencia más limpia
        show: false // No mostrar hasta que esté listo
    });

    // Cargar la aplicación compilada
    if (app.isPackaged) {
        // En producción, cargar desde la carpeta dist
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        // En desarrollo, cargar desde el servidor de Vite
        mainWindow.loadURL('http://localhost:5173');
    }

    // Mostrar ventana cuando esté lista para evitar parpadeo
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Limpiar referencia cuando se cierre la ventana
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Cuando Electron esté listo
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// En macOS, recrear ventana al hacer clic en el dock
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
