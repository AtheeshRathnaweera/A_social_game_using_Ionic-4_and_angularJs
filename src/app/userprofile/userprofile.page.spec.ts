import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprofilePage } from './userprofile.page';

describe('UserprofilePage', () => {
  let component: UserprofilePage;
  let fixture: ComponentFixture<UserprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
