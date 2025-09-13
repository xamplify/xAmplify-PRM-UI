import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseEmailtemplateComponent } from './choose-emailtemplate.component';

describe('ChooseEmailtemplateComponent', () => {
  let component: ChooseEmailtemplateComponent;
  let fixture: ComponentFixture<ChooseEmailtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseEmailtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseEmailtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
