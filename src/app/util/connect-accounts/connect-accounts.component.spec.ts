import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectAccountsComponent } from './connect-accounts.component';

describe('ConnectAccountsComponent', () => {
  let component: ConnectAccountsComponent;
  let fixture: ComponentFixture<ConnectAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
