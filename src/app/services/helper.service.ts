import { Injectable } from '@angular/core';
import { constantsX } from '../constants/constant';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  rowData: any = [];
  updatedColumn: any = [];
  accountName = [
    'Select Account..',
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
    'Accounts payable',
    'Wages Payable',
    'Interest Payable',
    'Notes Payable',
    'Deferred Revenue',
    'Bank Loan',
    'Bonds payable',
    'Other Liabilities',
    'Dividends payable',
    'Common stock',
    'Addnl. Paid in Capital',
    'Treasury stock',
    'Retained Earnings',
    'Revenue',
    'Investment Income',
    'Profit on Retirement of Bonds',
    'Dividend income',
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

  typesMap: any = {
    Cash: 'Assets',
    'Accounts Receivable': 'Assets',
    'Allowance for Bad Debts': 'XA',
    Inventory: 'Assets',
    'Pre Paid Asset': 'Assets',
    'Intangible Assets': 'Assets',
    'Other Assets': 'Assets',
    Investments: 'Assets',
    Goodwill: 'Assets',
    PPE: 'Assets',
    'Accumulated Depreciation': 'XA',
    'Accounts payable': 'Liability',
    'Wages Payable': 'Liability',
    'Interest Payable': 'Liability',
    'Notes Payable': 'Liability',
    'Deferred Revenue': 'Liability',
    'Bank Loan': 'Liability',
    'Bonds payable': 'Liability',
    'Other Liabilities': 'Liability',
    'Dividends payable': 'Liability',
    'Common stock': 'SHE',
    'Addnl. Paid in Capital': 'SHE',
    'Treasury stock': 'XE',
    'Retained Earnings': 'SHE',
    Revenue: 'IS-Rev',
    'Investment Income': 'IS-Rev',
    'Profit on Retirement of Bonds': 'IS-Rev',
    'Dividend income': 'IS-Rev',
    CoGS: 'IS-Exp',
    'Rent Expenses': 'IS-Exp',
    'Depreciation Expenses': 'IS-Exp',
    'Wage Expenses': 'IS-Exp',
    'Interest Expenses': 'IS-Exp',
    'Insurance Expenses': 'IS-Exp',
    'Bad debt Expenses': 'IS-Exp',
    'Selling & General Expenses': 'IS-Exp',
    'Other Expenses': 'IS-Exp',
    'Goodwill Amortization Expense': 'IS-Exp',
  };

  increaseDecrease = ['Increase', 'Decrease'];

  getAccountNames() {
    return this.accountName;
  }

  getType(accountName: any) {
    return this.typesMap[accountName];
  }

  getIncreaseDecrease() {
    return this.increaseDecrease;
  }

  getCreditDebit(increase: string, type: string) {
    switch (type) {
      case 'Assets': {
        return increase == 'Increase' ? 'Debit' : 'Credit';
      }
      case 'Liability': {
        return increase == 'Decrease' ? 'Debit' : 'Credit';
      }
      case 'SHE': {
        return increase == 'Decrease' ? 'Debit' : 'Credit';
      }
      case 'XA': {
        return increase == 'Decrease' ? 'Debit' : 'Credit';
      }
      case 'XL': {
        return increase == 'Increase' ? 'Debit' : 'Credit';
      }
      case 'XE': {
        return increase == 'Increase' ? 'Debit' : 'Credit';
      }
      case 'IS-Rev': {
        return increase == 'Decrease' ? 'Debit' : 'Credit';
      }
      case 'IS-Exp': {
        return increase == 'Increase' ? 'Debit' : 'Credit';
      }
    }
    return;
  }

  dataProvider() {}

  mergeColumns(data: any) {
    let columns: any = [];
    let orderCols: any = [0];
    data.forEach((item: any) => {
      item.forEach((itemx: any) => {
        if (!orderCols.includes(constantsX.accountName[itemx.selectedAccount]))
          orderCols.push(constantsX.accountName[itemx.selectedAccount]);
      });
    });
    orderCols
      .sort((a: number, b: number) => a - b)
      .forEach((index: number) => {
        for (let key in constantsX.accountName) {
          if (constantsX.accountName[key] == index) {
            columns.push(key);
          }
        }
      });
    this.updatedColumn = columns;
    return columns;
  }

  getRowX(rows: any) {
    let newRow = new Array(39).fill(0);
    newRow[0] = rows[0].Transaction;
    rows.forEach((row: any) => {
      newRow[constantsX.accountName[row.selectedAccount]] =
        row[row.selectedAccount];
    });
    this.rowData.push(newRow);
    return this.rowData;
  }

  getTotal(columnData: any, data: any) {
    let totalColumn = new Array(39).fill(0);
    columnData.forEach((column: any) => {
      let columnSum: number = 0;
      data.forEach((row: any) => {
        columnSum = columnSum + Number(row[constantsX.accountName[column]]);
      });
      totalColumn[constantsX.accountName[column]] = columnSum;
    });
    return this.balanceTheSheet(totalColumn);
  }

  balanceTheSheet(totalColumn: any) {
    let revenueTotal = 0;
    [
      'Revenue',
      'Investment Income',
      'Profit on Retirement of Bonds',
      'Dividend income',
    ].forEach((cols: any) => {
      revenueTotal = revenueTotal + totalColumn[constantsX.accountName[cols]];
    });
    let expencesTotal = 0;
    [
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
    ].forEach((cols: any) => {
      expencesTotal = expencesTotal + totalColumn[constantsX.accountName[cols]];
    });
    let retainedEarnings = Number(revenueTotal) - Number(expencesTotal);
    this.updateColumn(retainedEarnings);

    // if(retainedEarnings > 0)
    totalColumn[constantsX.accountName['Retained Earnings']] = retainedEarnings;
    totalColumn[constantsX.accountName['PPE']] =
      totalColumn[constantsX.accountName['PPE']] -
      totalColumn[constantsX.accountName['Accumulated Depreciation']];
    totalColumn[constantsX.accountName['Accounts receivable']] =
      totalColumn[constantsX.accountName['Accounts receivable']] -
      totalColumn[constantsX.accountName['Allowance for Bad Debts']];
    totalColumn[constantsX.accountName['Common stock']] =
      totalColumn[constantsX.accountName['Common stock']] -
      totalColumn[constantsX.accountName['Treasury stock']];
      // Special case where retained earnigs less than 0 or negative

    if (totalColumn[constantsX.accountName['Retained Earnings']] < 0) {
      totalColumn[constantsX.accountName['Common stock']] =
        totalColumn[constantsX.accountName['Common stock']] +
        totalColumn[constantsX.accountName['Retained Earnings']];
    }

    // console.log(totalColumn[constantsX.accountName['Retained Earnings']] ,totalColumn[constantsX.accountName['Common stock']] )
    return totalColumn;
  }

  getGraphTotal(columnData: any, data: any) {
    let barChartData: any = [];
    columnData.forEach((column: any) => {
      let columnSum: number = 0;
      data.forEach((row: any) => {
        columnSum = columnSum + Number(row[constantsX.accountName[column]]);
      });
      barChartData.push({
        label: column,
        data: [columnSum],
      });
    });
    return barChartData;
  }

  updateColumn(retainedEarnings: number) {
    if (
      retainedEarnings != 0 &&
      !this.updatedColumn?.includes('Retained Earnings')
    ) {
      this.updatedColumn.push('Retained Earnings');
    }

    let sortUpdatedColumns = this.updatedColumn?.map((item: any) => {
      return constantsX.accountName[item];
    });
    this.updatedColumn = [];
    console.log(sortUpdatedColumns, this.updatedColumn);
    sortUpdatedColumns
      .sort((a: number, b: number) => a - b)
      .forEach((index: number) => {
        for (let key in constantsX.accountName) {
          if (constantsX.accountName[key] == index) {
            this.updatedColumn.push(key);
          }
        }
      });
    return this.updatedColumn;
  }

  getUpdateColumn() {
    return this.updatedColumn;
  }

  getAssetsGraph1(columnData: any, data: any) {
    let assetsGraph: any = [];
    columnData.forEach((column: any) => {
      let columnSum: number = 0;
      if (
        [
          'Accounts receivable',
          'Cash',
          'Goodwill',
          'Investments',
          'Land',
          'PPE',
          'Unbilled Revenue',
        ].includes(column.toString())
      ) {
        data.forEach((row: any) => {
          columnSum = columnSum + Number(row[constantsX.accountName[column]]);
        });
        assetsGraph.push({
          label: column,
          data: [columnSum, 0],
        });
      }
    });
    return assetsGraph;
  }

  getAssetsGraph(data: any) {
    let assetsGraph: any = [];
    [
      'Cash',
      'Accounts Receivable',
      'Inventory',
      'Pre Paid Asset',
      'Intangible Assets',
      'Other Assets',
      'Investments',
      'Goodwill',
      'PPE',
    ].forEach((col: string) => {
      let columnSum: number = 0;
      columnSum = columnSum + Number(data[constantsX.accountName[col]]);
      if (columnSum != 0) {
        assetsGraph.push({
          label: col,
          data: [columnSum, 0],
        });
      }
    });
    return assetsGraph;
  }

  getLiabilityGraph(data: any) {
    let LiabilityGraph: any = [];
    [
      'Accounts payable',
      'Wages Payable',
      'Interest Payable',
      'Notes Payable',
      'Deferred Revenue',
      'Bank Loan',
      'Bonds payable',
      'Other Liabilities',
      'Dividends payable',
      'Common stock',
      'Addnl. Paid in Capital',
      'Retained Earnings',
    ].forEach((col: string) => {
      let columnSum: number = 0;
      columnSum = columnSum + Number(data[constantsX.accountName[col]]);
      if (columnSum != 0) {
        LiabilityGraph.push({
          label: col,
          data: [0, columnSum],
        });
      }
    });
    return LiabilityGraph;
  }

  getRevenueGraph(columnData: any, data: any) {
    let RevenueGraph: any = [];
    columnData.forEach((column: any) => {
      let columnSum: number = 0;
      if (
        [
          'Revenue',
          'Investment Income',
          'Profit on Retirement of Bonds',
          'Dividend income',
        ].includes(column.toString())
      ) {
        data.forEach((row: any) => {
          columnSum = columnSum + Number(row[constantsX.accountName[column]]);
        });
        RevenueGraph.push({
          label: column,
          data: [columnSum, 0],
        });
      }
    });
    return RevenueGraph;
  }

  getExpensesGraph(columnData: any, data: any) {
    let ExpensesGraph: any = [];
    columnData.forEach((column: any) => {
      let columnSum: number = 0;
      if (
        [
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
        ].includes(column.toString())
      ) {
        data.forEach((row: any) => {
          columnSum = columnSum + Number(row[constantsX.accountName[column]]);
        });
        ExpensesGraph.push({
          label: column,
          data: [0, columnSum],
        });
      }
    });
    return ExpensesGraph;
  }
  addOpeningBalance() {
    let openingBalance = new Array(39).fill(0);
    openingBalance[0] = 'Opening Balance';
    this.rowData.push(openingBalance);
  }

  isCreditEqualToDebit(rows: any) {
    let creditSum: number = 0;
    let debitSum: number = 0;
    rows.forEach((row: any) => {
      if (row.debitCredit == 'Credit') {
        creditSum = creditSum + Number(row.amount);
      } else if (row.debitCredit == 'Debit') {
        debitSum = debitSum + Number(row.amount);
      }
    });
    if (creditSum == debitSum) {
      return false;
    } else {
      return true;
    }
  }
}
