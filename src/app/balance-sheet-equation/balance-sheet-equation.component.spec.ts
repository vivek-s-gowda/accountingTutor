import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetEquationComponent } from './balance-sheet-equation.component';

describe('BalanceSheetEquationComponent', () => {
  let component: BalanceSheetEquationComponent;
  let fixture: ComponentFixture<BalanceSheetEquationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceSheetEquationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceSheetEquationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
