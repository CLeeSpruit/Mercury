import { Injectable } from '@angular/core';
import { ElectronService } from '@shared/services/electron.service';

@Injectable()
export class NotificationService {
    constructor(private electronService: ElectronService) {
        //
    }

    sendNotification(title: string, message: string) {
        console.log('Notification sent for', title);
        const notification = new Notification(title, { body: message });
    }
}
