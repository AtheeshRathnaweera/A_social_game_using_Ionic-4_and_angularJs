import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddacommentPage } from './addacomment.page';

describe('AddacommentPage', () => {
  let component: AddacommentPage;
  let fixture: ComponentFixture<AddacommentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddacommentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddacommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
