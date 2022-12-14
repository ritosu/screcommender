import * as fs from 'fs';
import * as os from 'os';
import * as vscode from 'vscode';

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

export function makeLogPath(logUri: string) {
    let logpath = os.homedir();
    switch(osType) {
        case 'Windows_NT':
            logpath += '/AppData/Roaming/Code/logs/';
            break;
        case 'Darwin':
            logpath += '/Library/Application Support/Code/logs/';
            break;
        default:
            '';
    }
    const logDirs = fs.readdirSync(logpath);
    let targetLogDir = logDirs[logDirs.length-1];
    if(logDirs[logDirs.length-1]==='hkrecommender') targetLogDir = logDirs[logDirs.length-2];
    targetLogDir += logUri.substring(logUri.indexOf('/window'), logUri.indexOf('/exthost'));
    const files = fs.readdirSync(logpath + targetLogDir + '/');

    let lastModifiedLogDate = new Date('1995-12-17T03:24:00');
    let targetFileIndex = 0;
    for(var i = files.length-1; i >= 0; --i) {
        if(files[i].indexOf('renderer') !== -1) {
            const rendererLogNum = Number(files[i].substring(8, files[i].length-4));
            const stat = fs.statSync(logpath+targetLogDir+'/'+files[i]);
            console.log(files[i]+":"+stat.atime)
            if(stat.atime > lastModifiedLogDate) {
                lastModifiedLogDate = stat.atime;
                targetFileIndex = i;
            }
        }
    }
    
    logpath += targetLogDir + '/' + files[targetFileIndex];
    return logpath;
};

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
            return '../data/defaultKeybindingsWin.json';
        case 'Darwin':
            return '../data/defaultKeybindingsMac.json';
        default:
            return '';
    }
})();

export const commandTitlePath = '../data/commandTitle.json';