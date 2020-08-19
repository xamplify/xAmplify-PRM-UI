import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMdfRequestComponent } from './create-mdf-request.component';

describe('CreateMdfRequestComponent', () => {
  let component: CreateMdfRequestComponent;
  let fixture: ComponentFixture<CreateMdfRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMdfRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMdfRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
