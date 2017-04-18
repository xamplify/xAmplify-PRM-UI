import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraFaqComponent } from './extra-faq.component';

describe('ExtraFaqComponent', () => {
  let component: ExtraFaqComponent;
  let fixture: ComponentFixture<ExtraFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
