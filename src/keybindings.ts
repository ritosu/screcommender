import { keybindingsPath, userKeybindingsPath } from "./paths";
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
