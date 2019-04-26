import { Component, OnInit } from '@angular/core';
import { Change } from '../models/change.class';
import { MetaService } from '../services/meta.service';
import { Router } from '@angular/router';

@Component({
    selector: 'hg-meta-modal',
    templateUrl: 'meta-modal.component.html',
    styleUrls: ['meta-modal.component.scss']
})
export class MetaModalComponent implements OnInit {
    version = '2.0.0';
    changes: Array<Change> = new Array<Change>();

    constructor(
        private metaService: MetaService,
        private router: Router
    ) { }

    ngOnInit() {
        this.metaService.getChangelog().subscribe(data => {
            this.changes = data;
        });
    }

    navigate() {
        this.router.navigate(['settings']);
    }
}
