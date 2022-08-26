import * as fs from 'fs';
import * as os from 'os';

const osType = (() => {
    const ostype = os.type();
    switch (ostype) {
        case 'Windows_NT':
        case 'Darwin':
            return ostype;
        default:
            console.error(ostype + ' is not supported.');
            return '';
    }
})();

export const logPath = (() => {
    let logpath = os.homedir();
    switch(osType) {
        case 'Windows_NT':
            logpath += '/AppData/Roaming/Code/logs/';
        case 'Darwin':
            logpath += '/Library/Application Support/Code/logs/';
        default:
            '';
    }
    const logDirs = fs.readdirSync(logpath);
    const targetLogDir = logDirs[logDirs.length-1];
    const files = fs.readdirSync(logpath + targetLogDir + '/');

    let maxRendererLogNum = 0;
    let targetFileIndex = 0;
    for(var i = files.length-1; i >= 0; --i) {
        if(files[i].indexOf('renderer') !== -1) {
            const rendererLogNum = Number(files[i].substring(8, files[i].length-4));
            if(rendererLogNum> maxRendererLogNum) {
                maxRendererLogNum = rendererLogNum;
                targetFileIndex = i;
            }
        }
    }
    logpath += targetLogDir + '/' + files[targetFileIndex];
    return logpath;
})();

export const userKeybindingsPath = (() => {
    let userLogPath = os.homedir();
    switch (osType) {
        case 'Windows_NT':
            return userLogPath + 'AppData/Roaming/Code/User/keybindings.json';
        case 'Darwin':
            return userLogPath + '/Library/Application Support/Code/User/keybinding.json';
        default:
            return '';
    }
})();

export const keybindingsPath = (() => {
    switch (osType) {
        case 'Windows_NT':
            return './defaultKeybindingsWin.json';
        case 'Darwin':
            return './defaultKeybindingsMac.json';
        default:
            return '';
    }
})();