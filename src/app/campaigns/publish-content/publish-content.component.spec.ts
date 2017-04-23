import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishContentComponent } from './publish-content.component';

describe('PublishContentComponent', () => {
  let component: PublishContentComponent;
  let fixture: ComponentFixture<PublishContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
