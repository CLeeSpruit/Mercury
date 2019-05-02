import { Injectable, ComponentRef } from '@angular/core';
import { BehaviorSubject, Observable, AsyncSubject } from 'rxjs';
import { Project } from '@shared/models/project.class';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { filter, map } from 'rxjs/operators';
import { FileStoreService } from '@shared/services/file-store.service';
import { ConfigSettings } from 'config/models/config.model';
import { ProjectSettings } from 'config/models/project-config.model';
import { stringify } from '@angular/core/src/util';
@Injectable()
export class ConfigService {
    private apiUrl = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    private fileStore = new FileStoreService();
    private storageToken = 'config';
    private config: ConfigSettings;

    private configSub: BehaviorSubject<ConfigSettings> = new BehaviorSubject<ConfigSettings>(<ConfigSettings>{});
    private currentProjectSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private projects: Array<Project> = new Array<Project>();
    private currentProjectsSub: BehaviorSubject<Array<Project>> = new BehaviorSubject<Array<Project>>(this.projects);
    private projectUrlSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private darkSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private buildSettingsSub: BehaviorSubject<ProjectSettings> = new BehaviorSubject<ProjectSettings>(<ProjectSettings>{});

    private options = {
        headers: new HttpHeaders({
            'cache-control': 'no-cache',
            'Content-Type': 'application/json-patch+json'
        })
    };

    private settingsLoadedSub: AsyncSubject<boolean> = new AsyncSubject<boolean>();

    constructor(
        private http: HttpClient
    ) { }

    init() {
        this.config = this.fetchConfig();
        if (this.config) {
            this.setConfig(this.config, true);
        }
        this.settingsLoadedSub.next(true);
        this.settingsLoadedSub.complete();
        return this.settingsLoadedSub.asObservable();
    }

    hasCurrentProject(): boolean {
        return !!(this.config && this.config.currentProject);
    }

    getCurrentProject(): Observable<string> {
        return this.currentProjectSub.asObservable().pipe(filter(proj => !!proj));
    }

    setCurrentProject(project: string, doNotSave?: boolean) {
        this.projectUrlSub.next(`http://tfs2013-mn:8080/tfs/DefaultCollection/${project}/_apis/`);
        this.currentProjectSub.next(project);
        this.config.currentProject = project;
        this.setBuildSettings();
        if (!doNotSave) {
            this.saveConfig();
        }
    }

    private fetchProjects(): Observable<Array<Project>> {
        return this.http.get<Array<Project>>(`${this.apiUrl}projects`, this.options).pipe(
            map((data: any) => {
                return data.value;
            }));
    }

    getProjects(): Observable<Array<Project>> {
        try {
            if (!this.currentProjectsSub.getValue().length) {
                throw new Error('no projects');
            }
        } catch (e) {
            this.fetchProjects().subscribe(data => this.currentProjectsSub.next(data));
        }
        return this.currentProjectsSub.asObservable().pipe(filter(projs => !!(projs) && !!(projs.length)));
    }

    getProjectApiUrl(): Observable<string> {
        return this.projectUrlSub.asObservable().pipe(filter(url => !!url));
    }

    getApiUrl(): string {
        return this.apiUrl;
    }

    setDarkMode(isDark: boolean, doNotSave?: boolean) {
        this.config.isDarkMode = isDark;
        this.darkSub.next(isDark);
        if (!doNotSave) {
            this.saveConfig();
        }
    }

    setTitleBarColor(color: string, doNotSave?: boolean) {
        this.config.titlebarColor = color;

        if (!doNotSave) {
            this.saveConfig();
        }
    }

    getDarkMode(): Observable<boolean> {
        return this.darkSub.asObservable();
    }

    getConfig(): Observable<ConfigSettings> {
        return this.configSub.asObservable();
    }

    setConfig(config: ConfigSettings, doNotSave?: boolean) {
        this.configSub.next(config);
        this.setDarkMode(config.isDarkMode, doNotSave);
        this.setCurrentProject(config.currentProject, doNotSave);
    }

    setBuildSettings() {
        if (!this.config.projectSettings) {
            this.config.projectSettings = new Map<string, ProjectSettings>();
        }
        let project = this.config.projectSettings.get(this.config.currentProject);
        if (!project) {
            this.config.projectSettings.set(this.config.currentProject, this.createDefaultProjectSetting(this.config.currentProject));
            project = this.config.projectSettings.get(this.config.currentProject);
        }

        this.buildSettingsSub.next(project);
    }

    getBuildSettings(): Observable<ProjectSettings> {
        return this.buildSettingsSub.asObservable();
    }

    private createDefaultProjectSetting(projectName: string) {
        return <ProjectSettings>{
            projectName,
            notificationsOn: true,
            buildMonitorInterval: 30
        };
    }

    private setProjectSetting(settingProp: string, value: any, doNotSave?: boolean) {
        if (!this.config.projectSettings) {
            this.config.projectSettings = new Map<string, ProjectSettings>();
        }

        const project = this.config.projectSettings.get(this.config.currentProject) || this.createDefaultProjectSetting(this.config.currentProject);
        project[settingProp] = value;

        this.config.projectSettings.set(this.config.currentProject, project);
        this.setBuildSettings();

        if (!doNotSave) {
            this.saveConfig();
        }
    }

    setNotifications(notificationsOn: boolean, doNotSave?: boolean) {
        this.setProjectSetting('notificationsOn', notificationsOn, doNotSave);
    }

    setMonitorInterval(interval: number, doNotSave?: boolean) {
        this.setProjectSetting('buildMonitorInterval', interval, doNotSave);
    }

    // fs store
    private saveConfig() {
        const mapped = {
            ...this.config,
            projectSettings: Array.from(this.config.projectSettings.values())
        };

        this.fileStore.write(this.storageToken, '.json', mapped);
        this.configSub.next(this.config);
    }

    private fetchConfig(): ConfigSettings {
        try {
            const config: ConfigSettings = this.fileStore.read(this.storageToken, '.json');
            const jsonSettings = config.projectSettings;
            config.projectSettings = new Map<string, ProjectSettings>();
            jsonSettings.forEach(key => {
                config.projectSettings.set(key.projectName, key);
            });
            return config;
        } catch (e) {
            return <ConfigSettings>{};
        }
    }
}
