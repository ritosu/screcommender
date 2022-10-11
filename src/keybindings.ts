import { keybindingsPath, userKeybindingsPath, commandTitlePath } from "./paths";
import * as fs from 'fs';

export function geteKeybindings() : Map<string, string> {
    const keybindingsMap = new Map<string, string>();
    
    const keybindingsjsonData = require(keybindingsPath);
    keybindingsjsonData.forEach(data => {
        if(!data.when || data.when.indexOf('notebook') === -1) {
            keybindingsMap.set(data.command, data.key);
        }
    });

    if(fs.existsSync(userKeybindingsPath)) {
        const usreKeybindingsjsonData = require(userKeybindingsPath);
        usreKeybindingsjsonData.forEach(data => {
            if(!data.when || data.when.indexOf('notebook') === -1) {
                keybindingsMap.set(data.command, data.key);
            }
        });
    }

    return keybindingsMap;
}

export function getCommandTitles() : Map<string, string> {
    const commandTitleMap = new Map<string, string>();
    const commandTitlejsonData = require(commandTitlePath);
    commandTitlejsonData.forEach(data => {
        commandTitleMap.set(data.command, data.title);
    });

    return commandTitleMap;
}