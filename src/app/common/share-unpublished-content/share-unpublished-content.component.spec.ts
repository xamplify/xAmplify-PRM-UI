import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareUnpublishedContentComponent } from './share-unpublished-content.component';

describe('ShareUnpublishedContentComponent', () => {
  let component: ShareUnpublishedContentComponent;
  let fixture: ComponentFixture<ShareUnpublishedContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareUnpublishedContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareUnpublishedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
