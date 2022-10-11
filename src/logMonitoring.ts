import * as chokidar from 'chokidar';
import { logPath } from './paths';
import { getCommandTitles, geteKeybindings } from './keybindings';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as os from 'os';

export class LogMonitoring {
    constructor() {
        vscode.commands.executeCommand('workbench.action.setLogLevel');

    }

    startMonitoring() {
        console.log("logPath:"+logPath);
        const keybindingsMap = geteKeybindings();
        const commandTitleMap = getCommandTitles();
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
                fs.readFile(path, 'utf-8', (err, logData) => {
                    if(err) throw err;
                    const logArray = logData.split(/\n/);
                    const readLength = logArray.length-preLogLength;
                    const usedKeybindingsSet = new Set();
                    const logIndexDiff = (() => {
                        const ostype = os.type();
                        switch(ostype) {
                            case 'Windows_NT':
                                return 2;
                            case 'Darwin':
                                return 1;
                            default:
                                return 1;
                        }
                    })();
                    preLogLength = logArray.length;
                    for(var i = 0; i < readLength; ++i) {
                        const lineOfLog = logArray[logArray.length-1+i-readLength].split(/\s/);
                        console.log("LOG:"+i+" "+lineOfLog[lineOfLog.length-logIndexDiff])
                        if(lineOfLog[lineOfLog.length-2-logIndexDiff] === 'KeybindingService#dispatch') {
                            usedKeybindingsSet.add(lineOfLog[lineOfLog.length-logIndexDiff]);
                        }
                        if(!usedKeybindingsSet.has(lineOfLog[lineOfLog.length-logIndexDiff]) &&
                            !preUsedKeybindingsSet.has(lineOfLog[lineOfLog.length-logIndexDiff]) &&
                            keybindingsMap.has(lineOfLog[lineOfLog.length-logIndexDiff]) &&
                            lineOfLog[lineOfLog.length-logIndexDiff] !== 'notification.clear') {
                                var title = '';
                                if(commandTitleMap.has(lineOfLog[lineOfLog.length-logIndexDiff])) {
                                    title = '「' + commandTitleMap.get(lineOfLog[lineOfLog.length-logIndexDiff]) + '」 の実行に';
                                }
                                vscode.window.showInformationMessage(title + ' 「'+keybindingsMap.get(lineOfLog[lineOfLog.length-logIndexDiff])+'」 を代わりに使用できます。');
                        }
                    }
                    preUsedKeybindingsSet = usedKeybindingsSet;
                });
            });
        });
    }
}