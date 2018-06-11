import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Project } from '@shared/models/project.class';

@Injectable()
export class ConfigService {
    private lsCurrentProject = 'current-project';
    // TODO: Grab this with TFS
    private projects: Array<Project> = [
        <Project>{ id: 1, title: 'OPUS'},
        <Project>{ id: 2, title: 'TRAC'}
    ];
    private currentProjectSub: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private currentProjectsSub: BehaviorSubject<Array<Project>> = new BehaviorSubject<Array<Project>>(this.projects);

    constructor(
    ) {
        const currentProject = window.localStorage.getItem(this.lsCurrentProject);
        if (currentProject) {
            this.currentProjectSub.next(currentProject);
        }
    }

    getCurrentProject(): Observable<string> {
        return this.currentProjectSub.asObservable().filter(proj => !!proj);
    }

    setCurrentProject(project: string) {
        window.localStorage.setItem(this.lsCurrentProject, project);
        this.currentProjectSub.next(project);
    }

    getProjects(): Observable<Array<Project>> {
        return this.currentProjectsSub.asObservable();
    }
}
