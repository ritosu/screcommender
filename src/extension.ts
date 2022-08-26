import { LogMonitoring } from './logMonitoring';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const monitor = new LogMonitoring; 
    monitor.startMonitoring();
}

export function deactivate() {}
