import { Injectable, ComponentRef } from '@angular/core';
import { BehaviorSubject, Observable, AsyncSubject } from 'rxjs';
import { Project } from '@shared/models/project.class';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { filter, map } from 'rxjs/operators';
import { FileStoreService } from '@shared/services/file-store.service';
import { ConfigSettings } from 'config/models/config.model';
@Injectable()
export class ConfigService {
    private lsCurrentProject = 'current-project';
    private apiUrl = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    private fileStore = new FileStoreService();
    private storageToken = 'config';
    private config: ConfigSettings;

    private currentProjectSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private projects: Array<Project> = new Array<Project>();
    private currentProjectsSub: BehaviorSubject<Array<Project>> = new BehaviorSubject<Array<Project>>(this.projects);
    private projectUrlSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private modalSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private darkSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private options = {
        headers: new HttpHeaders({
            'cache-control': 'no-cache',
            'Content-Type': 'application/json-patch+json'
        })
    };
    private settingsModal: ComponentRef<SettingsModalComponent>;
    private settingsLoadedSub: AsyncSubject<boolean> = new AsyncSubject<boolean>();

    constructor(
        private http: HttpClient,
        private dynamicComponentService: DynamicComponentService
    ) { }

    init() {
        this.config = this.fetchConfig();
        if (this.config) {
            this.setDarkMode(this.config.isDarkMode, true);
            this.setCurrentProject(this.config.currentProject, true);
        }
        this.settingsLoadedSub.next(true);
        this.settingsLoadedSub.complete();
        return this.settingsLoadedSub.asObservable();
    }

    hasCurrentProject(): boolean {
        return !!(this.config.currentProject);
    }

    getCurrentProject(): Observable<string> {
        return this.currentProjectSub.asObservable().pipe(filter(proj => !!proj));
    }

    setCurrentProject(project: string, doNotSave?: boolean) {
        this.projectUrlSub.next(`http://tfs2013-mn:8080/tfs/DefaultCollection/${project}/_apis/`);
        this.currentProjectSub.next(project);
        this.config.currentProject = project;
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

    getDarkMode(): Observable<boolean> {
        return this.darkSub.asObservable();
    }

    // fs store
    private saveConfig() {
        this.fileStore.write(this.storageToken, '.json', this.config);
    }

    private fetchConfig(): ConfigSettings {
        try {
            return this.fileStore.read(this.storageToken, '.json');
        } catch (e) {
            return <ConfigSettings>{};
        }
    }
}
