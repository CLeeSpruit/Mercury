import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'config/services/config.service';

@Component({
    selector: 'hg-notification-settings',
    templateUrl: 'notification-settings.component.html',
    styleUrls: ['notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit {
    projectName = '';
    isNotificationsOn = true;
    intervalValue = 60;

    constructor(private configService: ConfigService) {
        //
    }

    ngOnInit() {
        this.configService.getBuildSettings().subscribe(settings => {
            this.intervalValue = settings.buildMonitorInterval;
            this.isNotificationsOn = settings.notificationsOn;
            this.projectName = settings.projectName;
        });
    }

    toggleNotifications() {
        this.configService.setNotifications(!this.isNotificationsOn);
    }

    saveInterval(interval: number) {
        this.configService.setMonitorInterval(interval);
    }
}
