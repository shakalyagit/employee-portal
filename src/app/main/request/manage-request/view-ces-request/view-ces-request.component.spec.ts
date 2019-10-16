import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCesRequestComponent } from './view-ces-request.component';

describe('ViewCesRequestComponent', () => {
  let component: ViewCesRequestComponent;
  let fixture: ComponentFixture<ViewCesRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCesRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
