import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbiColumnComponent } from './pbi-column.component';

describe('PbiColumnComponent', () => {
  let component: PbiColumnComponent;
  let fixture: ComponentFixture<PbiColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbiColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbiColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
