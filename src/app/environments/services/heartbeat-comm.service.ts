import { Injectable } from '@angular/core';
import { FileStoreService } from '@shared/services/file-store.service';
import { Release } from '@environments/models/release.model';
import { HeartbeatSettings } from '@environments/models/heartbeat-settings.model';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class HeartbeatCommService {
    private settings: Array<HeartbeatSettings>;
    private fileStore = new FileStoreService();
    private storageKey = 'heartbeat-settings';
    private settingsChanged: Subject<any> = new Subject<any>();

    constructor() {
        this.settings = this.fetchSettings() || new Array<HeartbeatSettings>();
    }

    fetchSettings() {
        return this.fileStore.read(this.storageKey, '.json');
    }

    getSettings() {
        return this.settings;
    }

    getSettingsChangedEvent(): Observable<any> {
        // TODO: Send settings info accross so this doesn't have to re-instance everytime
        return this.settingsChanged.asObservable();
    }

    // Associated Build
    setAssociatedBuild(releaseDefinition: string, buildName: string) {
        if (!this.settings || !this.settings.length) {
            this.newAssociatedBuild(releaseDefinition, buildName);
            return;
        }
        const foundIndex = this.settings.findIndex(setting => setting.releaseName === releaseDefinition);
        if (foundIndex === -1) {
            this.newAssociatedBuild(releaseDefinition, buildName);
        } else {
            this.settings[foundIndex].associatedBuildName = buildName;
            this.saveSettings();
        }
    }

    private newAssociatedBuild(release: string, buildName: string) {
        const setting = <HeartbeatSettings>{
            releaseName: release,
            associatedBuildName: buildName,
        };

        this.settings.push(setting);
        this.saveSettings();
    }

    removeAssociatedBuild(releaseDefinition: string) {
        this.setAssociatedBuild(releaseDefinition, null);
    }

    // Favorite
    toggleFavorite(releaseDefinition: string) {
        if (!this.settings || !this.settings.length) {
            this.newFavorite(releaseDefinition);
        }
        const foundIndex = this.settings.findIndex(setting => setting.releaseName === releaseDefinition);
        if (foundIndex === -1) {
            this.newFavorite(releaseDefinition);
        } else {
            this.settings[foundIndex].favorite = !this.settings[foundIndex].favorite;
            this.saveSettings();
        }
    }

    private newFavorite(release: string) {
        const setting = <HeartbeatSettings>{
            releaseName: release,
            favorite: true
        };

        this.settings.push(setting);
        this.saveSettings();
    }

    private saveSettings() {
        this.fileStore.write(this.storageKey, '.json', this.settings);
        this.settingsChanged.next();
    }
}
