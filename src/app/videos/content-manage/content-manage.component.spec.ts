import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentManageComponent } from './content-manage.component';

describe('ContentManageComponent', () => {
  let component: ContentManageComponent;
  let fixture: ComponentFixture<ContentManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
