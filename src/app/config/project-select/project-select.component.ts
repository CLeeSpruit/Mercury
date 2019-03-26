import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { Subscription } from 'rxjs';
import { Project } from '@shared/models/project.class';

@Component({
    selector: 'hg-project-select',
    styleUrls: ['project-select.component.scss'],
    templateUrl: 'project-select.component.html'
})
export class ProjectSelectComponent implements OnInit, OnDestroy {
    currentProject: string;
    projects: Array<Project> = new Array<Project>();

    private subscriptions: Array<Subscription> = new Array<Subscription>();
    constructor(
        private configService: ConfigService,
    ) { }

    ngOnInit() {
        this.subscriptions.push(this.configService.getCurrentProject().subscribe(project => {
            console.log(this.currentProject);
            this.currentProject = project;
        }));
        this.subscriptions.push(this.configService.getProjects().subscribe(projects => this.projects = projects));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    changeProject($event: any) {
        const index = $event.target.options.selectedIndex;
        this.configService.setCurrentProject(this.projects[index].name);
        this.configService.closeSettingModal();
    }
}
