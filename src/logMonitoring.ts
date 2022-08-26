import * as chokidar from 'chokidar';
import { logPath } from './paths';
import { geteKeybindings } from './keybindings';
import * as fs from 'fs';
import * as vscode from 'vscode';

export class LogMonitoring {
    constructor() {
        vscode.commands.executeCommand('workbench.action.setLogLevel');
    }

    startMonitoring() {
        console.log("logPath:"+logPath);
        const keybindingsMap = geteKeybindings();
        const watcher = chokidar.watch(logPath, {
            ignored:/[\/\\]\./,
            persistent: true,
            usePolling: true
        });
        let preUsedKeybindingsSet = new Set();
        let preLogLength = 0;
        watcher.on('ready', () => {
            console.log("ready watching by chokidar")
            watcher.on('change', (path) => {
                console.log("path:"+path)
                fs.readFile(path, 'utf-8', (err, logData) => {
                    if(err) throw err;
                    const logArray = logData.split(/\n/);
                    const readLength = logArray.length-preLogLength;
                    const usedKeybindingsSet = new Set();
                    preLogLength = logArray.length;
                    for(var i = 0; i < readLength; ++i) {
                        const lineOfLog = logArray[logArray.length-2+i-readLength].split(/\s/);
                        console.log("LOG:"+lineOfLog[lineOfLog.length-1])
                        if(lineOfLog[lineOfLog.length-3] === 'KeybindingService#dispatch') {
                            usedKeybindingsSet.add(lineOfLog[lineOfLog.length-1]);
                        }
                        if(!usedKeybindingsSet.has(lineOfLog[lineOfLog.length-1]) && !preUsedKeybindingsSet.has(lineOfLog[lineOfLog.length-1]) && keybindingsMap.has(lineOfLog[lineOfLog.length-1])) {
                            vscode.window.showInformationMessage('「'+keybindingsMap.get(lineOfLog[lineOfLog.length-1])+'」　が代わりに使用できます');
                        }
                    }
                    preUsedKeybindingsSet = usedKeybindingsSet;
                });
            });
        });
    }

    
    
}