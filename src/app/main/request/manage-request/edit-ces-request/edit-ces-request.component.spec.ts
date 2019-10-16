import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCesRequestComponent } from './edit-ces-request.component';

describe('EditCesRequestComponent', () => {
  let component: EditCesRequestComponent;
  let fixture: ComponentFixture<EditCesRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCesRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
