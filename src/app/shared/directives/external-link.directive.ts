import { Directive, HostListener, HostBinding, Input, OnInit } from '@angular/core';
import { ElectronService } from '@shared/services/electron.service';
import { shell } from 'electron';

/* This grabs all outgoing links and throws it into a browser window if this is electron */

@Directive({
    selector: 'a:not([routerLink])'
})
export class ExternalLinkDirective {
    constructor(private electronService: ElectronService) {
        //
    }

    @HostListener('click', ['$event'])
    navigate(event: MouseEvent) {
        if (this.electronService.isElectron) {
            // Open a new browser
            event.preventDefault();
            const target = (<any>event.target).href;
            if (!target) {
                throw Error('No destiantion link found.');
            }

            shell.openExternal(target);
        }
    }
}
