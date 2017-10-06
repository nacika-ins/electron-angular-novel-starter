import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDataComponent } from './select-data.component';

describe('SelectDataComponent', () => {
  let component: SelectDataComponent;
  let fixture: ComponentFixture<SelectDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectDataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
