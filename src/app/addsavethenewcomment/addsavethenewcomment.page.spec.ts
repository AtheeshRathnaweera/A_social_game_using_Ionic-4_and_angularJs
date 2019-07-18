import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsavethenewcommentPage } from './addsavethenewcomment.page';

describe('AddsavethenewcommentPage', () => {
  let component: AddsavethenewcommentPage;
  let fixture: ComponentFixture<AddsavethenewcommentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsavethenewcommentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsavethenewcommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
