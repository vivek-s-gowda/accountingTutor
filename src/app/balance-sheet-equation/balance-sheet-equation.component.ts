import { Component, OnInit } from '@angular/core';
import { constantsX } from '../constants/constant';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-balance-sheet-equation',
  templateUrl: './balance-sheet-equation.component.html',
  styleUrls: ['./balance-sheet-equation.component.scss'],
})
export class BalanceSheetEquationComponent implements OnInit {
  title = 'accounting-tutor';
  columns: any = [];
  gridRows: any = [];
  total: any = [];
  transaction: string = '';
  showError: boolean = false;
  errorMessage: string = '';
  updatedOpeningBalanceAccountName: string = 'Select Account..';
  updetedOpeningList: any = this.helperService.getAccountNames();
  isUpdateOpeningBalance: boolean = false;
  updatedOpeningBalanceAccountValue: string = '';
  selectView = 'summary';
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
        ticks: {
          color: 'red',
        },
      },
      y: {
        stacked: true,
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
      },
      y: {
        stacked: true,
      },
    },
  };
  public barChartLabelsAssets = ['ASSETS', 'LIABILITY + EQUITY'];
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
      },
      y: {
        stacked: true,
      },
    },
  };
  public barChartLabelsRevenue = ['REVENUE', 'EXPENSES + INCOME'];
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
      },
      y: {
        stacked: true,
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

  removeDetailRow(index: number) {
    this.gridRows.splice(index, 1);
    this.total = this.helperService.getTotal(this.columns, this.gridRows); /// need to work

    this.barChartDataAssets = [];
    this.barChartDataRevenue = [];
    this.helperService
      .getLiabilityGraph(this.total)
      .forEach((liabilityGraph: any) => {
        this.barChartDataAssets = [...this.barChartDataAssets, liabilityGraph];
      });
    this.helperService.getAssetsGraph(this.total).forEach((assetGraph: any) => {
      this.barChartDataAssets = [...this.barChartDataAssets, assetGraph];
    });

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

    this.columns = [
      ...this.columns,
      this.helperService.mergeColumns(this.resultGrid),
    ];
    this.gridRows = this.helperService.getRowX(this.rows, false);
    this.total = this.helperService.getTotal(this.columns, this.gridRows);
    console.log(this.columns, 'the total ');
    console.log(this.total, 'the total ');
    console.log(this.columns, 'the total ');
    this.columns = this.helperService.getUpdateColumn();
    // this.columns = this.helperService.mergeColumns(this.resultGrid);

    this.helperService
      .getLiabilityGraph(this.total)
      .forEach((liabilityGraph: any) => {
        this.barChartDataAssets = [...this.barChartDataAssets, liabilityGraph];
      });
    this.helperService.getAssetsGraph(this.total).forEach((assetGraph: any) => {
      this.barChartDataAssets = [...this.barChartDataAssets, assetGraph];
    });
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

  updateOpeningBalance() {
    this.barChartDataAssets = [];
    this.barChartDataRevenue = [];
    console.log(
      'the opening balance ',
      this.updatedOpeningBalanceAccountName,
      this.updatedOpeningBalanceAccountValue
    );
    if (!this.columns.includes(this.updatedOpeningBalanceAccountName)) {
      if (!this.columns.includes('Transaction'))
        this.columns.push('Transaction');
      this.columns.push(this.updatedOpeningBalanceAccountName);
      this.gridRows = this.helperService.getRowX(
        [
          {
            names: this.helperService.getAccountNames(),
            selectedAccount: this.updatedOpeningBalanceAccountName,
            selectedType: 'XA',
            increaseDecrease: this.helperService.getIncreaseDecrease(),
            selectedIncreaseDecrease: 'Increase',
            amount: 0,
            'Accm. Depn': 0,
            debitCredit: 'Credit',
            Transaction: '',
          },
        ],
        true
      );
      // this.total = this.helperService.getTotal(this.columns, this.gridRows);
      // this.columns = this.helperService.getUpdateColumn();

      console.log(this.total, 'before');
    }

    console.log(this.gridRows);
    this.gridRows[0][constantsX.accountName['Transaction']] = 'Opening Balance';
    this.gridRows[0][
      constantsX.accountName[this.updatedOpeningBalanceAccountName]
    ] = parseInt(this.updatedOpeningBalanceAccountValue);
    this.total = this.helperService.getTotal(this.columns, this.gridRows);
    // this.columns = this.helperService.getUpdateColumn();

    console.log(this.total, 'after');

    this.helperService
      .getLiabilityGraph(this.total)
      .forEach((liabilityGraph: any) => {
        this.barChartDataAssets = [...this.barChartDataAssets, liabilityGraph];
      });
    this.helperService.getAssetsGraph(this.total).forEach((assetGraph: any) => {
      this.barChartDataAssets = [...this.barChartDataAssets, assetGraph];
    });
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

    this.showGrid = true;
    console.log(this.columns, 'columns');
  }

  getCellClass(columnName: string) {
    let assetList = [
      'Cash',
      'Accounts Receivable',
      'Allowance for Bad Debts',
      'Inventory',
      'Pre Paid Asset',
      'Intangible Assets',
      'Other Assets',
      'Investments',
      'Goodwill',
      'PPE',
      'Accumulated Depreciation',
    ];

    let LiabilityList = [
      'Accounts payable',
      'Wages Payable',
      'Interest Payable',
      'Notes Payable',
      'Deferred Revenue',
      'Bank Loan',
      'Bonds payable',
      'Other Liabilities',
      'Dividends payable',
    ];

    let equityList = [
      'Common stock',
      'Addnl. Paid in Capital',
      'Treasury stock',
      'Retained Earnings',
    ];

    let RevenueList = [
      'Revenue',
      'Investment Income',
      'Profit on Retirement of Bonds',
      'Dividend income',
    ];

    let expensesList = [
      'CoGS',
      'Rent Expenses',
      'Depreciation Expenses',
      'Wage Expenses',
      'Interest Expenses',
      'Insurance Expenses',
      'Bad debt Expenses',
      'Selling & General Expenses',
      'Other Expenses',
      'Goodwill Amortization Expense',
    ];

    if (assetList.includes(columnName)) {
      return {
        display: 'block',
        width: '100%',
        background: '#EDF5E6',
      };
    }

    if (LiabilityList.includes(columnName)) {
      return {
        display: 'block',
        width: '100%',
        background: '#E6F3F5',
      };
    }

    if (equityList.includes(columnName)) {
      return {
        display: 'block',
        width: '100%',
        background: '#EDEBFA',
      };
    }

    if (RevenueList.includes(columnName)) {
      return {
        display: 'block',
        width: '100%',
        background: '#F5EAE6',
      };
    }

    if (expensesList.includes(columnName)) {
      return {
        display: 'block',
        width: '100%',
        background: '#F5F0E6',
      };
    }

    return;
  }

  switch(view: string) {
    this.selectView = view;
  }
}
