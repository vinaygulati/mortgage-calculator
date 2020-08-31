import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { MortgageCalculatorComponent } from './mortgage-calculator/mortgage-calculator.component';
import { CurrencyMaskDirective } from './directives/currency-mask.directive';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    MortgageCalculatorComponent,
    CurrencyMaskDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule
  ],
  exports: [
    CurrencyMaskDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
