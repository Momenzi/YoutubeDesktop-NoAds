const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('extensions', {
    load: () => console.log("Extensions loaded from main process.")
});
