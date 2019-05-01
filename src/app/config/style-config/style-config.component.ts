import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'config/services/config.service';

@Component({
    selector: 'hg-style-config',
    styleUrls: ['style-config.component.scss'],
    templateUrl: 'style-config.component.html'
})
export class StyleConfigComponent implements OnInit {
    isDark = false;
    constructor(private configService: ConfigService) {
        //
    }

    ngOnInit() {
        this.configService.getDarkMode().subscribe(isDark => {
            this.isDark = isDark;
        });
    }

    toggleDark() {
        this.configService.setDarkMode(!this.isDark);
    }
}
