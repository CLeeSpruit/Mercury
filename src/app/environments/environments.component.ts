import { Component, OnInit } from '@angular/core';
import { Build } from './models/build.model';
import { TfsEnvironmentService } from './services/tfs-environment.service';
import { BuildDefinition } from './models/build-definition.model';

@Component({
    selector: 'hg-environments',
    templateUrl: './environments.component.html',
    styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {
    builds: Array<Build> = new Array<Build>();
    mostRecentBuilds: Array<Build> = new Array<Build>();
    definitions: Array<BuildDefinition> = new Array<BuildDefinition>();

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService
    ) { }

    ngOnInit() {
        this.tfsEnvironmentService.getBuilds().subscribe((data: Array<Build>) => {
            this.builds = data;
            this.tfsEnvironmentService.getDefinitions().subscribe((definitionData: Array<BuildDefinition>) => {
                this.definitions = definitionData;
                this.mostRecentBuilds = this.getMostRecentBuilds(data);
            });
        });
    }

    private getMostRecentBuilds(builds: Array<Build>): Array<Build> {
        return this.definitions
            .map(def => builds.find(build => build.definition.name === def.name))
            .filter(build => build); // Remove undefines
    }
}
