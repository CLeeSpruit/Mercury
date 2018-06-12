import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Project } from '@shared/models/project.class';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
    private lsCurrentProject = 'current-project';
    private apiUrl = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    private currentProjectSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private currentProjectsSub: BehaviorSubject<Array<Project>> = new BehaviorSubject<Array<Project>>(this.projects);
    private projectUrlSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private options = {
        headers: new HttpHeaders({
            'cache-control': 'no-cache',
            'Content-Type': 'application/json-patch+json'
        })
    };

    constructor(
        private http: HttpClient
    ) { }

    init() {
        const currentProject = window.localStorage.getItem(this.lsCurrentProject);
        if (currentProject) {
            this.setCurrentProject(currentProject);
        }
    }

    getCurrentProject(): Observable<string> {
        return this.currentProjectSub.asObservable().filter(proj => !!proj);
    }

    setCurrentProject(project: string) {
        window.localStorage.setItem(this.lsCurrentProject, project);
        this.setProjectApiUrl(project);
        this.currentProjectSub.next(project);
    }

    getProjects(): Observable<Array<Project>> {
        return this.http.get<Array<Project>>(`${this.apiUrl}projects`, this.options)
            .map((data: any) => {
                return data.value;
            });
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
}
