import { Injectable } from '@angular/core';

@Injectable()
export class AuthorizationService {
    tokenCookie = 'mercury-auth';

    authorize(pat: string) {
        this.setCookie(this.tokenCookie, pat);
    }

    getAuthorization() {
        if (!this.hasCookie(this.tokenCookie)) {
            // TODO: redirect to auth page if no cookie found
            return;
        }

        return this.createAuthorization(this.getCookie(this.tokenCookie));
    }

    logout() {
        this.clearCookie(this.tokenCookie);
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
