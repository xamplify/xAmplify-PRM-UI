import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAssetsComponent } from './delete-assets.component';

describe('DeleteAssetsComponent', () => {
  let component: DeleteAssetsComponent;
  let fixture: ComponentFixture<DeleteAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
