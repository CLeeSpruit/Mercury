import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PbiCardComponent } from './pbi-card.component';
import { SprintService } from '../../services/sprint.service';
import { SprintServiceMock } from '../../services/sprint.service.mock';

describe('PbiCardComponent', () => {
    let component: PbiCardComponent;
    let fixture: ComponentFixture<PbiCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PbiCardComponent],
            providers: [
                { provide: SprintService, useClass: SprintServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PbiCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
