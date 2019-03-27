/* Electron-only Service */

import { app, remote } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export class FileStoreService {
    private userDataPath: string;
    private defaultTextEncoding = 'utf8';

    constructor() {
        this.userDataPath = (app || remote.app).getPath('userData');
    }

    // Returns a data object
    read(fileName: string, extension: string): any {
        return this.parseDataJsonFile(this.getFilePath(fileName, extension));
    }

    write(fileName: string, extension: string, data: any): void {
        fs.writeFile(this.getFilePath(fileName, extension), JSON.stringify(data),
            (err) => { if (err) { console.log('Error reading file', fileName); } }
        );
    }

    private getFilePath(fileName: string, extension: string): string {
        return path.join(this.userDataPath, fileName + extension);
    }

    private parseDataJsonFile(filePath: string) {
        try {
            return JSON.parse(fs.readFileSync(filePath, this.defaultTextEncoding));
        } catch (e) {
            // TODO: Throw error
            return '';
        }
    }
}
