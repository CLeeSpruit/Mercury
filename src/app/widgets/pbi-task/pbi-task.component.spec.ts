import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PbiTaskComponent } from './pbi-task.component';
import { TfsService } from '../../services/tfs.service';
import { TfsServiceMock } from '../../services/tfs.service.mock';
import { SprintService } from '../../services/sprint.service';
import { SprintServiceMock } from '../../services/sprint.service.mock';

describe('Pbi task Component', () => {
    let fixture: ComponentFixture<PbiTaskComponent>;
    let component: PbiTaskComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ PbiTaskComponent ],
            providers: [
                { provide: SprintService, useClass: SprintServiceMock },
                { provide: TfsService, TfsServiceMock }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();

        fixture = TestBed.createComponent(PbiTaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('init', () => {
        expect(component).toBeTruthy();
    });
});
