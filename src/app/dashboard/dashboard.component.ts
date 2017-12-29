import { TfsService } from './../services/tfs.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'kb-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    projects: Array<any> = new Array<any>();

    constructor(
        private tfsService: TfsService
    ) { }

    ngOnInit() {
        this.tfsService.getProjects().subscribe((data) => {
            this.projects = data;
        });
    }

}
