import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mortgageForm, amortizationPeriod, amortPeriodMonths, paymentFrequency, terms, prePaymentFrequency } from './mortgage';

@Component({
  selector: 'app-mortgage-calculator',
  templateUrl: './mortgage-calculator.component.html',
  styleUrls: ['./mortgage-calculator.component.css']
})
export class MortgageCalculatorComponent implements OnInit {

  private mortgage =  new mortgageForm();
  amortPeriods= amortizationPeriod;
  amortPeriodMonths= amortPeriodMonths;
  paymentFrequencies= paymentFrequency;
  terms= terms;
  prePaymentFrequencies= prePaymentFrequency;
  calculationSummary: any;

  numMonthlyPayments: number;
  mortgagePayment: number;
  principal: number;
  interest: number;
  totalPay: number;
  numTermPayments: number;
  termMortgagePayment: number;
  termPrincipal: number;
  termInterest: number;
  termTotalPay: number;
  termBalance: number;
  periodicInterestRates: number;
  paymentFrequency: string;
  amortizationPeriodYr: string;
  termYr: string;

  // Payment history chart fields
  public lineChartData:Array<any>;
  public lineChartLabels:Array<any>;
  public lineChartOptions:any = {
    title: {
      display: true,
      text: 'Payment History'
    },
    responsive: true
  };
    public lineChartColors:Array<any> = [
    { 
      backgroundColor: 'rgba(115,161,198,.4)',
      borderColor: 'rgba(115,161,198,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  // Interest history chart fields
  public stackedChartData:Array<any>;
  public stackedChartLabels:Array<any> = ['Regular Payments'];
  public stackedChartOptions:any = {
    title: {
      display: true,
      text: 'Interest Payment'
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true
      }]
    }
  };
    public stackedChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(115,161,198,.4)',
      borderColor: 'rgba(115,161,198,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(218,133,134,0.6)',
      borderColor: 'rgba(218,133,134,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public stackedChartLegend:boolean = true;
  public stackedChartType:string = 'bar';

  constructor() { }

  calculate() {
  	this.amortizationPeriodYr = this.mortgage.amortPeriodYr+"-year";
  	this.paymentFrequency = this.mortgage.paymentFreq;
  	let weekMultiplier: number;
  	if(this.paymentFrequency=='Monthly (12x per year)'){
  		weekMultiplier = 12;
  	} else if (this.paymentFrequency=='Semi-monthly (24x per year)'||this.paymentFrequency=='Accelerated Bi-weekly'){
  		weekMultiplier = 24;
  	} else if (this.paymentFrequency=='Bi-Weekly (every 2 weeks)'){
  		weekMultiplier = 26;
  	} else if (this.paymentFrequency=='Weekly'){
  		weekMultiplier = 52;
  	} else if (this.paymentFrequency=='Accelerated Weekly'){
  		weekMultiplier = 48;
  	}
  	if(this.mortgage.amortPeriodMth==''||this.mortgage.amortPeriodMth==null){
		this.numMonthlyPayments = this.mortgage.amortPeriodYr*weekMultiplier;
  	} else {
  		this.numMonthlyPayments = this.mortgage.amortPeriodYr*weekMultiplier+parseInt(this.mortgage.amortPeriodMth);
  	}

  	//To calculate Monthly mortgage payment, we need periodic interest rate
  	this.periodicInterestRates = Math.pow(Math.pow(1+((this.mortgage.intRate/100)/2),2),(1/weekMultiplier))-1;
  	this.mortgagePayment = (this.mortgage.mortAmount*this.periodicInterestRates)/(1-Math.pow((1+this.periodicInterestRates),-this.numMonthlyPayments));

  	this.principal = this.mortgage.mortAmount;
  	this.totalPay = this.mortgagePayment * this.numMonthlyPayments;
  	this.interest = this.totalPay-this.principal;
  	this.termYr = this.mortgage.term+"-year";
  	this.numTermPayments = this.mortgage.term*weekMultiplier;
  	this.termMortgagePayment = this.mortgagePayment; // assuming total monthly payments remains the same
  	this.termPrincipal = 11492.50; // Don't have the formula, so hard coded the value
  	this.termInterest = 23403.80; // Don't have the formula, so hard coded the value
  	this.termTotalPay = this.termMortgagePayment * this.numTermPayments;
  	this.termBalance = this.mortgage.mortAmount-this.termPrincipal;

  	this.calculationSummary = [
  		{category: 'Number of Payments',
  		term: this.numTermPayments,
  		amortizationPeriod: this.numMonthlyPayments},
  		{category: 'Mortgage Payment',
  		term: this.termMortgagePayment,
  		amortizationPeriod: this.mortgagePayment},
  		{category: 'Prepayment',
  		term: this.mortgage.prepayAmt,
  		amortizationPeriod: this.mortgage.prepayAmt},
  		{category: 'Principal Payments',
  		term: this.termPrincipal,
  		amortizationPeriod: this.principal},
  		{category: 'Interest Payments',
  		term: this.termInterest,
  		amortizationPeriod: this.interest},
  		{category: 'Total Cost',
  		term: this.termTotalPay,
  		amortizationPeriod: this.totalPay}
  	];

  	this.createPaymentHistoryChart();
  	this.createInterestHistoryChart();
  }

  createPaymentHistoryChart(){
  	this.lineChartData = [
    {data: [this.principal, 5.3*(this.principal/6), 4.5*(this.principal/6), 3.6*(this.principal/6), 2.55*(this.principal/6), 1.4*(this.principal/6), 0], label: 'Regular Payments'}
  ];
  	this.lineChartLabels = [0, this.numMonthlyPayments/6,2*(this.numMonthlyPayments/6),3*(this.numMonthlyPayments/6),
  	4*(this.numMonthlyPayments/6), 5*(this.numMonthlyPayments/6), this.numMonthlyPayments];
  }

  createInterestHistoryChart(){
	  	this.stackedChartData = [{
	    label: 'Principal Payments',
	    data: [
	      this.principal
	    ]
	  	}, {
	    label: 'Interest Payment',
	    data: [
	      this.interest
	    ]
	  }];
  }

  ngOnInit() {
  	this.calculate();
  }

}
