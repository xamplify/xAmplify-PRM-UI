import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTracksOrPlaybooksComponent } from './share-tracks-or-playbooks.component';

describe('ShareTracksOrPlaybooksComponent', () => {
  let component: ShareTracksOrPlaybooksComponent;
  let fixture: ComponentFixture<ShareTracksOrPlaybooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareTracksOrPlaybooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTracksOrPlaybooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
