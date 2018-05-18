import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SprintComponent } from './sprint.component';
import { SprintService } from '../services/sprint.service';
import { SprintServiceMock } from '../services/sprint.service.mock';
import { TfsService } from '../services/tfs.service';
import { TfsServiceMock } from '../services/tfs.service.mock';
import { TaskStatus } from '../shared/task-status';
import { WorkItem } from '../models/work-item';

describe('SprintComponent', () => {
    let component: SprintComponent;
    let fixture: ComponentFixture<SprintComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SprintComponent],
            providers: [
                { provide: SprintService, useClass: SprintServiceMock },
                { provide: TfsService, useClass: TfsServiceMock }
            ], schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprintComponent);
        component = fixture.componentInstance;
        component.columns[TaskStatus.todo] = new Array<WorkItem>();
        component.columns[TaskStatus.inProgress] = new Array<WorkItem>();
        component.columns[TaskStatus.testing] = new Array<WorkItem>();
        component.columns[TaskStatus.done] = new Array<WorkItem>();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
