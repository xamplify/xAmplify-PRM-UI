import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeeTemplateUtilComponent } from './bee-template-util.component';

describe('BeeTemplateUtilComponent', () => {
  let component: BeeTemplateUtilComponent;
  let fixture: ComponentFixture<BeeTemplateUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeeTemplateUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeeTemplateUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
