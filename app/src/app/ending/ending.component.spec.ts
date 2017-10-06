import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndingComponent } from './ending.component';

describe('EndingComponent', () => {
  let component: EndingComponent;
  let fixture: ComponentFixture<EndingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EndingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
