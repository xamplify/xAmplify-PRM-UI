import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPartnersComponent } from './preview-partners.component';

describe('PreviewPartnersComponent', () => {
  let component: PreviewPartnersComponent;
  let fixture: ComponentFixture<PreviewPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
