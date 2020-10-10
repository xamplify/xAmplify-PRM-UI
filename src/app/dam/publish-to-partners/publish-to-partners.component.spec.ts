import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishToPartnersComponent } from './publish-to-partners.component';

describe('PublishToPartnersComponent', () => {
  let component: PublishToPartnersComponent;
  let fixture: ComponentFixture<PublishToPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishToPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishToPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
