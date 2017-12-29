import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbiListComponent } from './pbi-list.component';

describe('PbiListComponent', () => {
  let component: PbiListComponent;
  let fixture: ComponentFixture<PbiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
