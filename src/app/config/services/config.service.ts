import { Injectable, ComponentRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Project } from '@shared/models/project.class';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Injectable()
export class ConfigService {
    private lsCurrentProject = 'current-project';
    private apiUrl = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    private currentProjectSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private projects: Array<Project> = new Array<Project>();
    private currentProjectsSub: BehaviorSubject<Array<Project>> = new BehaviorSubject<Array<Project>>(this.projects);
    private projectUrlSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private modalSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private options = {
        headers: new HttpHeaders({
            'cache-control': 'no-cache',
            'Content-Type': 'application/json-patch+json'
        })
    };
    private settingsModal: ComponentRef<SettingsModalComponent>;

    constructor(
        private http: HttpClient,
        private dynamicComponentService: DynamicComponentService
    ) { }

    init() {
        const currentProject = window.localStorage.getItem(this.lsCurrentProject);
        if (currentProject) {
            this.setCurrentProject(currentProject);
        }
    }

    hasCurrentProject(): boolean {
        // Used as a quick check if the stored in LS
        return !!(window.localStorage.getItem(this.lsCurrentProject));
    }

    getCurrentProject(): Observable<string> {
        return this.currentProjectSub.asObservable().filter(proj => !!proj);
    }

    setCurrentProject(project: string) {
        window.localStorage.setItem(this.lsCurrentProject, project);
        this.setProjectApiUrl(project);
        this.currentProjectSub.next(project);
    }

    private fetchProjects(): Observable<Array<Project>> {
        return this.http.get<Array<Project>>(`${this.apiUrl}projects`, this.options)
            .map((data: any) => {
                return data.value;
            });
    }

    getProjects(): Observable<Array<Project>> {
        try {
            if (!this.currentProjectsSub.getValue().length) {
                throw new Error('no projects');
            }
        } catch (e) {
            this.fetchProjects().subscribe(data => this.currentProjectsSub.next(data));
        }
        return this.currentProjectsSub.asObservable().filter(projs => !!(projs) && !!(projs.length));
    }

    getProjectApiUrl(): Observable<string> {
        return this.projectUrlSub.asObservable().filter(url => !!url);
    }

    getApiUrl(): string {
        return this.apiUrl;
    }

    private setProjectApiUrl(project: string) {
        this.projectUrlSub.next(`http://tfs2013-mn:8080/tfs/DefaultCollection/${project}/_apis/`);
    }

    // Settings modal
    openSettingsModal(): void {
        this.dynamicComponentService.addComponent(SettingsModalComponent).subscribe((comp: ComponentRef<SettingsModalComponent>) => {
            this.settingsModal = comp;
            comp.instance.componentRefDestroy = comp.destroy;
            comp.changeDetectorRef.detectChanges();
            this.modalSub.next(true);
        });
    }

    closeSettingModal(): void {
        if (this.settingsModal) {
            this.settingsModal.instance.close();
        }

        this.modalSub.next(false);
    }

    getModalStatus(): Observable<boolean> {
        return this.modalSub.asObservable();
    }
}
