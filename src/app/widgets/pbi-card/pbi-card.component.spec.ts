import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbiCardComponent } from './pbi-card.component';

describe('PbiCardComponent', () => {
  let component: PbiCardComponent;
  let fixture: ComponentFixture<PbiCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbiCardComponent ]
    })
    .compileComponents();
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
