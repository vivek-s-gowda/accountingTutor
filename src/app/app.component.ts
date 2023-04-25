import { Component, OnInit } from '@angular/core';
import { constantsX } from './constants/constant';
import { HelperService } from './services/helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'accounting-tutor';
  columns: any = [];
  gridRows: any = [];
  total: any = [];
  transaction: string = '';
  showError: boolean = false;
  errorMessage: string = '';
  rows: any = [
    {
      names: this.helperService.getAccountNames(),
      selectedAccount: 'Select Account..',
      selectedType: 'XA',
      increaseDecrease: this.helperService.getIncreaseDecrease(),
      selectedIncreaseDecrease: 'Increase',
      amount: 0,
      'Accm. Depn': 0,
      debitCredit: 'Credit',
      Transaction: '',
    },
    {
      names: this.helperService.getAccountNames(),
      selectedAccount: 'Select Account..',
      selectedType: 'XA',
      increaseDecrease: this.helperService.getIncreaseDecrease(),
      selectedIncreaseDecrease: 'Increase',
      amount: 0,
      'Accm. Depn': 0,
      debitCredit: 'Credit',
      Transaction: '',
    },
  ];

  public barChartOptionsLiability = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Liability',
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
  };
  public barChartLabelsLiability = ['Liability'];
  public barChartTypeLiability = 'bar';
  public barChartLegendLiability = true;
  public barChartDataLiability: any = [{ data: [], label: '' }];

  public barChartOptionsAssets = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Balance Sheet',
      },
    },
    scales: {
      x: {
        stacked: true,
        // display: false,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
  };
  public barChartLabelsAssets = ['Assets', 'Liability'];
  public barChartTypeAssets = 'bar';
  public barChartLegendAssets = true;
  public barChartDataAssets: any = [];

  public barChartOptionsRevenue = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Income Statement',
      },
    },
    scales: {
      x: {
        stacked: true,
        // display: false,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
  };
  public barChartLabelsRevenue = ['Revenue', 'Expenses'];
  public barChartTypeRevenue = 'bar';
  public barChartLegendRevenue = true;
  public barChartDataRevenue: any = [];

  public barChartOptionsExpenses = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Expenses',
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
  };
  public barChartLabelsExpenses = ['Expenses'];
  public barChartTypeExpenses = 'bar';
  public barChartLegendExpenses = true;
  public barChartDataExpenses: any = [{ data: [], label: '' }];

  showGrid: boolean = false;
  resultGrid: any = [];

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.helperService.addOpeningBalance();
  }

  accountChanges(index: number) {
    this.rows[index].selectedType = this.helperService.getType(
      this.rows[index].selectedAccount
    );
    this.rows[index].debitCredit = this.helperService.getCreditDebit(
      this.rows[index].selectedIncreaseDecrease,
      this.rows[index].selectedType
    );
    if (this.rows[index].selectedIncreaseDecrease !== 'Increase')
      this.rows[index][this.rows[index].selectedAccount] =
        this.rows[index].amount * -1;
    else
      this.rows[index][this.rows[index].selectedAccount] =
        this.rows[index].amount;
  }

  increaseDecreaseChange(index: number) {
    this.rows[index].debitCredit = this.helperService.getCreditDebit(
      this.rows[index].selectedIncreaseDecrease,
      this.rows[index].selectedType
    );
    if (this.rows[index].selectedIncreaseDecrease !== 'Increase')
      this.rows[index][this.rows[index].selectedAccount] =
        this.rows[index].amount * -1;
    else
      this.rows[index][this.rows[index].selectedAccount] =
        this.rows[index].amount;
  }

  addRow() {
    this.rows.push({
      names: this.helperService.getAccountNames(),
      selectedAccount: 'Select Account..',
      selectedType: 'XA',
      increaseDecrease: this.helperService.getIncreaseDecrease(),
      selectedIncreaseDecrease: 'Increase',
      amount: 0,
      'Accm. Depn': 0,
      debitCredit: 'Credit',
      Transaction: '',
    });
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
  }

  submit() {
    this.barChartDataAssets = [];
    this.barChartDataRevenue = [];
    if (this.transaction === '') {
      this.showError = true;
      this.errorMessage = 'Please fill value for transaction ';
      return;
    }
    if (this.helperService.isCreditEqualToDebit(this.rows)) {
      this.showError = true;
      this.errorMessage =
        'Error.  Sum of debtis does not equal sum of credits. ';
      return;
    }
    this.showGrid = true;
    this.barChartDataLiability = [];
    this.rows.map((row: any) => (row.Transaction = this.transaction));
    this.resultGrid.push(this.rows);

    this.columns = this.helperService.mergeColumns(this.resultGrid);
    this.gridRows = this.helperService.getRowX(this.rows);
    // this.barChartDataAssets = [...this.barChartDataAssets,this.helperService.getLiabilityGraph(
    //   this.columns,
    //   this.gridRows
    // )];
    // this.barChartDataAssets = [...this.barChartDataAssets,this.helperService.getAssetsGraph(
    //   this.columns,
    //   this.gridRows
    // )];


    this.columns = this.helperService.getUpdateColumn()
    this.total = this.helperService.getTotal(this.columns, this.gridRows); /// need to work

    this.helperService
      .getLiabilityGraph(this.total)
      .forEach((liabilityGraph: any) => {
        this.barChartDataAssets = [...this.barChartDataAssets, liabilityGraph];
      });
    this.helperService
      .getAssetsGraph(this.columns, this.gridRows)
      .forEach((assetGraph: any) => {
        this.barChartDataAssets = [...this.barChartDataAssets, assetGraph];
      });
    // console.log(this.barChartDataAssets, "barChartDataAssets")

    // this.barChartDataExpenses = this.helperService.getExpensesGraph(
    //   this.columns,
    //   this.gridRows
    // );
    // this.barChartDataRevenue = this.helperService.getRevenueGraph(
    //   this.columns,
    //   this.gridRows
    // );

    this.helperService
      .getRevenueGraph(this.columns, this.gridRows)
      .forEach((RevenueGraph: any) => {
        this.barChartDataRevenue = [...this.barChartDataRevenue, RevenueGraph];
      });

    this.helperService
      .getExpensesGraph(this.columns, this.gridRows)
      .forEach((expensesGraph: any) => {
        this.barChartDataRevenue = [...this.barChartDataRevenue, expensesGraph];
      });
    this.rows = [
      {
        names: this.helperService.getAccountNames(),
        selectedAccount: 'Select Account..',
        selectedType: 'XA',
        increaseDecrease: this.helperService.getIncreaseDecrease(),
        selectedIncreaseDecrease: 'Increase',
        amount: 0,
        'Accm. Depn': 0,
        debitCredit: 'Credit',
        Transaction: '',
      },
      {
        names: this.helperService.getAccountNames(),
        selectedAccount: 'Select Account..',
        selectedType: 'XA',
        increaseDecrease: this.helperService.getIncreaseDecrease(),
        selectedIncreaseDecrease: 'Increase',
        amount: 0,
        'Accm. Depn': 0,
        debitCredit: 'Credit',
        Transaction: '',
      },
    ];

    this.transaction = '';
  }

  onAmountChange(index: number) {
    if (this.rows[index].selectedIncreaseDecrease !== 'Increase')
      this.rows[index][this.rows[index].selectedAccount] =
        this.rows[index].amount * -1;
    else
      this.rows[index][this.rows[index].selectedAccount] =
        this.rows[index].amount;
  }

  getAccountNameIndexAndValue(row: any, columnName: string) {
    return row[constantsX.accountName[columnName]];
  }

  totalHeader(row: any, index: number) {
    if (index != 0) return row;
  }
  getTotalValue(row: any, index: number, columnName: string) {
    row[0] = 'Total';
    return row[constantsX.accountName[columnName]];
  }
}