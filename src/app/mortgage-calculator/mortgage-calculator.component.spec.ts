import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser";
import { MortgageCalculatorComponent } from './mortgage-calculator.component';

describe('MortgageCalculatorComponent', () => {
  it('Validation - Amortization Period should be atleast 1 year ', () => {
    const comp = new MortgageCalculatorComponent();
    comp.calculate();
    expect(comp.numMonthlyPayments).toBeGreaterThanOrEqual(12);
  });

  it('Validation - Mortgage Amount to be greater than 0 ', () => {
    const comp = new MortgageCalculatorComponent();
    comp.calculate();
    expect(comp.principal).toBeGreaterThan(0);
  });

  it('Calculation test - Total Cost of Amortization Period is sum of Total Principal and Total Interest over the period ', () => {
    const comp = new MortgageCalculatorComponent();
    comp.calculate();
    expect(comp.totalPay).toBe(comp.interest+comp.principal);
  });
});
