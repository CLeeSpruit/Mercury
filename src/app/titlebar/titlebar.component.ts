import * as ElectronTitlebarWindows from 'electron-titlebar-windows';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ElectronService } from '@shared/services/electron.service';
import { ConfigService } from 'config/services/config.service';
import { ConfigSettings } from 'config/models/config.model';

@Component({
    selector: 'hg-titlebar',
    styleUrls: ['../../../node_modules/electron-titlebar-windows/css/titlebar.css', 'titlebar.component.scss'],
    template: ''
})
export class TitlebarComponent implements OnInit {
    private electronTitlebar: typeof ElectronTitlebarWindows;
    private titlebar: any;
    constructor(
        private electronSerivce: ElectronService,
        private elementRef: ElementRef,
        private configService: ConfigService
    ) {
        //
    }

    ngOnInit() {
        this.electronTitlebar = window.require('electron-titlebar-windows');
        this.configService.getConfig().subscribe((config: ConfigSettings) => {
            const options = {
                darkMode: config.isDarkMode,
                backgroundColor: config.titlebarColor || '#e35d5b',
                draggable: true,
                fullscreen: false
            };

            if (this.titlebar) {
                // Titlebar.destory doesn't work in this instance, so we'll have to do it manually
                this.elementRef.nativeElement.innerHTML = '';
            }

            this.titlebar = new this.electronTitlebar(options);
            this.titlebar.appendTo(this.elementRef.nativeElement);

            this.titlebar.on('close', () => {
                this.electronSerivce.ipcRenderer.send('app:quit');
            });

            this.titlebar.on('minimize', () => {
                this.electronSerivce.ipcRenderer.send('app:minimize');
            });

            this.titlebar.on('maximize', () => {
                this.electronSerivce.ipcRenderer.send('app:maximize');
            });

            this.titlebar.on('fullscreen', () => {
                this.electronSerivce.ipcRenderer.send('app:fullscreen');
            });
        });
    }
}
