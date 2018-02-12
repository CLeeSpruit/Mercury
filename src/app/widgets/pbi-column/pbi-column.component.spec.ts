import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PbiColumnComponent } from './pbi-column.component';

describe('PbiColumnComponent', () => {
    let component: PbiColumnComponent;
    let fixture: ComponentFixture<PbiColumnComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PbiColumnComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(PbiColumnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
