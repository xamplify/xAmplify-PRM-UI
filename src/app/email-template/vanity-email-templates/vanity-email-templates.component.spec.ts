import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanityEmailTemplatesComponent } from './vanity-email-templates.component';

describe('VanityEmailTemplatesComponent', () => {
  let component: VanityEmailTemplatesComponent;
  let fixture: ComponentFixture<VanityEmailTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanityEmailTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanityEmailTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
