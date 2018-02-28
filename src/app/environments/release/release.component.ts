import { Component, OnInit, Input } from '@angular/core';
import { Release } from '../models/release.model';

import { TfsEnvironmentService } from '../services/tfs-environment.service';

@Component({
    selector: 'hg-release',
    templateUrl: './release.component.html',
    styleUrls: ['./release.component.scss']
})
export class ReleaseComponent implements OnInit {
    @Input() release: Release;

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService
    ) { }

    ngOnInit() {

    }
}
