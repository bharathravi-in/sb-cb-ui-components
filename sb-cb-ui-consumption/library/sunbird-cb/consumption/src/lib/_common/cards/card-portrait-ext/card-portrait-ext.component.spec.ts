import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPortraitExtComponent } from './card-portrait-ext.component';

describe('CardPortraitExtComponent', () => {
  let component: CardPortraitExtComponent;
  let fixture: ComponentFixture<CardPortraitExtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPortraitExtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPortraitExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
