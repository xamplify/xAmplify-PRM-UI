import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAssetsComponent } from './share-assets.component';

describe('ShareAssetsComponent', () => {
  let component: ShareAssetsComponent;
  let fixture: ComponentFixture<ShareAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
