import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCesRequestComponent } from './add-ces-request.component';

describe('AddCesRequestComponent', () => {
  let component: AddCesRequestComponent;
  let fixture: ComponentFixture<AddCesRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCesRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
