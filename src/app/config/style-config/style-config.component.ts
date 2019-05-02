import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'config/services/config.service';

@Component({
    selector: 'hg-style-config',
    styleUrls: ['style-config.component.scss'],
    templateUrl: 'style-config.component.html'
})
export class StyleConfigComponent implements OnInit {
    isDark = false;
    titlebarColor = '#000';
    constructor(private configService: ConfigService) {
        //
    }

    ngOnInit() {
        this.configService.getConfig().subscribe(config => {
            this.isDark = config.isDarkMode;
            this.titlebarColor = config.titlebarColor;
        });
    }

    toggleDark() {
        this.configService.setDarkMode(!this.isDark);
    }

    setTitleBarColor(color: string) {
        this.configService.setTitleBarColor(color);
    }
}
