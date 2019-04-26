import * as ElectronTitlebarWindows from 'electron-titlebar-windows';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ElectronService } from '@shared/services/electron.service';

@Component({
    selector: 'hg-titlebar',
    styleUrls: ['../../../node_modules/electron-titlebar-windows/css/titlebar.css', 'titlebar.component.scss'],
    template: ''
})
export class TitlebarComponent implements OnInit {
    private electronTitlebar: typeof ElectronTitlebarWindows;
    constructor(
        private electronSerivce: ElectronService,
        private elementRef: ElementRef
    ) {
        //
    }

    ngOnInit() {
        const options = {
            darkMode: false,
            color: '#ffffff',
            backgroundColor: '#e35d5b',
            draggable: true,
            fullscreen: false
        };

        this.electronTitlebar = window.require('electron-titlebar-windows');
        const titlebar = new this.electronTitlebar(options);
        titlebar.appendTo(this.elementRef.nativeElement);

        titlebar.on('close', () => {
            this.electronSerivce.ipcRenderer.send('app:quit');
        });

        titlebar.on('minimize', () => {
            this.electronSerivce.ipcRenderer.send('app:minimize');
        });

        titlebar.on('maximize', () => {
            this.electronSerivce.ipcRenderer.send('app:maximize');
        });

        titlebar.on('fullscreen', () => {
            this.electronSerivce.ipcRenderer.send('app:fullscreen');
        });
    }
}
