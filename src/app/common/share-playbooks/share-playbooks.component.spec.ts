import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePlaybooksComponent } from './share-playbooks.component';

describe('SharePlaybooksComponent', () => {
  let component: SharePlaybooksComponent;
  let fixture: ComponentFixture<SharePlaybooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePlaybooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePlaybooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
