import { Injectable } from '@angular/core';
import { ElectronService } from '@shared/services/electron.service';
import { FileStoreService } from '@shared/services/file-store.service';

@Injectable()
export class AuthorizationService {
    storageToken = 'mercury-auth';
    private electronService = new ElectronService();
    private fileStore = new FileStoreService();

    authorize(pat: string) {
        if (this.electronService.isElectron) {
            this.fileStore.write(this.storageToken, '.json', pat);
        } else {
            this.setCookie(this.storageToken, pat);
        }
    }

    getAuthorization() {
        const token = this.readAuthorization();

        if (!token) {
            // TODO: Navigate to auth page if token doesn't exist
            return;
        }
        return this.createAuthorization(token);
    }

    logout() {
        if (this.electronService.isElectron) {
            this.fileStore.write(this.storageToken, '.json', null);
        } else {
            this.clearCookie(this.storageToken);
        }
    }

    // Reads either from localstorage or file
    readAuthorization() {
        if (this.electronService.isElectron) {
            return this.fileStore.read(this.storageToken, '.json');
        } else {
            return this.getCookie(this.storageToken);
        }
    }

    // Returns a string for tfs to read
    private createAuthorization(token: string) {
        const buff = new Buffer(`:${token}`);
        return buff.toString('base64');
    }

    private setCookie(key: string, value: string) {
        const age = 60 * 60 * 24 * 365; // A year

        document.cookie = `${key}=${value}; Max-Age=${age}; path=/`;
    }

    private getCookie(key: string): string {
        if (!this.hasCookie(key)) { return; }

        const cookies = document.cookie;
        const foundCookies: Array<string> = cookies.split(';').filter(cookie => cookie.includes(`${key}=`));
        const value = foundCookies[0].split('=')[1]; // key=value

        return value;
    }

    private hasCookie(key: string): boolean {
        const cookies = document.cookie;
        const foundCookies: Array<string> = cookies.split(';').filter(cookie => cookie.includes(`${key}=`));
        return !!foundCookies.length;
    }

    private clearCookie(key: string) {
        document.cookie = `${key}=; Max-Age=0; path=/`;
    }
}
