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
    'Accm. Depn',
    'Accounts payable',
    'Accounts receivable',
    'Addnl. Paid in Capital',
    'Allowance for Uncollectables or Bad debt',
    'Bad debt Expense',
    'Bond discount',
    'Bond premium',
    'Bonds payable',
    'Cash',
    'Common stock',
    'Depreciation Expense',
    'Dividend/Investment income',
    'Goodwill',
    'Goodwill Amortization Expense',
    'Interest expense',
    'Investments',
    'Investment Income',
    'Land',
    'Loss',
    'PPE',
    'Profit on retirement of bonds',
    'Realized gain',
    'Retained Earnings',
    'Revenue',
    'Treasury stock',
    'Unbilled Revenue',
    'Unearned Revenue',
    'Unrealized Gain',
    'Unrealized Loss',
    'Realized loss',
    'Gain',
    'Dividend payables',
    'Insurance Expense',
    'Notes payable',
    'Interest payable',
  ];

  typesMap: any = {
    'Accm. Depn': 'XA',
    'Accounts payable': 'Liability',
    'Accounts receivable': 'Assets',
    'Addnl. Paid in Capital': 'SHE',
    'Allowance for Uncollectables or Bad debt': 'XA',
    'Bad debt Expense': 'IS-Exp',
    'Bond discount': 'XL',
    'Bond premium': 'XL',
    'Bonds payable': 'Liability',
    Cash: 'Assets',
    'Common stock': 'SHE',
    'Depreciation Expense': 'IS-Exp',
    'Dividend/Investment income': 'IS-Rev',
    Goodwill: 'Assets',
    'Goodwill Amortization Expense': 'IS-Exp',
    'Interest expense': 'IS-Exp',
    Investments: 'Assets',
    'Investment Income': 'IS-Rev',
    Land: 'Assets',
    Loss: 'IS-Exp',
    PPE: 'Assets',
    'Profit on retirement of bonds': 'IS-Rev',
    'Realized gain': 'IS-Rev',
    'Retained Earnings': 'SHE',
    Revenue: 'IS-Rev',
    'Treasury stock': 'XE',
    'Unbilled Revenue': 'Assets',
    'Unearned Revenue': 'Liability',
    'Unrealized Gain': 'SHE',
    'Unrealized Loss': 'SHE',
    'Realized loss': 'IS-Exp',
    Gain: 'IS-Rev',
    'Dividend payables': 'Liability',
    'Insurance Expense': 'IS-Exp',
    'Notes payable': 'Liability',
    'Interest payable': 'Liability',
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
    let newRow = new Array(37).fill(0);
    newRow[0] = rows[0].Transaction;
    rows.forEach((row: any) => {
      newRow[constantsX.accountName[row.selectedAccount]] =
        row[row.selectedAccount];
    });
    this.rowData.push(newRow);
    return this.rowData;
  }

  getTotal(columnData: any, data: any) {
    let totalColumn = new Array(37).fill(0);
    columnData.forEach((column: any) => {
      let columnSum: number = 0;
      data.forEach((row: any) => {
        columnSum = columnSum + Number(row[constantsX.accountName[column]]);
      });
      totalColumn[constantsX.accountName[column]] = columnSum;
    });
    return this.balanceTheSheet(totalColumn);
  }

  updateTotalWithContra() {

  }

  balanceTheSheet(totalColumn: any) {
    let revenueTotal = 0;
    [
      'Dividend/Investment income',
      'Investment Income',
      'Profit on retirement of bonds',
      'Realized gain',
      'Revenue',
      'Gain',
    ].forEach((cols: any) => {
      revenueTotal = revenueTotal + totalColumn[constantsX.accountName[cols]];
    });
    let expencesTotal = 0;
    [
      'Bad debt Expense',
      'Depreciation Expense',
      'Goodwill Amortization Expense',
      'Interest expense',
      'Loss',
      'Realized loss',
      'Insurance Expense',
    ].forEach((cols: any) => {
      expencesTotal = expencesTotal + totalColumn[constantsX.accountName[cols]];
    });
    let retainedEarnings = Number(revenueTotal) - Number(expencesTotal);
    this.updateColumn(retainedEarnings);

    totalColumn[constantsX.accountName['Retained Earnings']] = retainedEarnings;
    totalColumn[constantsX.accountName['PPE']] = totalColumn[constantsX.accountName['PPE']] - (totalColumn[constantsX.accountName['Accm. Depn']]);
    totalColumn[constantsX.accountName['Accounts receivable']] = totalColumn[constantsX.accountName['Accounts receivable']] - (totalColumn[constantsX.accountName['Allowance for Uncollectables or Bad debt']]);
    totalColumn[constantsX.accountName['Bonds payable']] = totalColumn[constantsX.accountName['Bonds payable']] - (totalColumn[constantsX.accountName['Bond discount']]);
    totalColumn[constantsX.accountName['Bonds payable']] = totalColumn[constantsX.accountName['Bonds payable']] - (totalColumn[constantsX.accountName['Bond premium']]);
    totalColumn[constantsX.accountName['Common stock']] = totalColumn[constantsX.accountName['Common stock']] - (totalColumn[constantsX.accountName['Treasury stock']]);
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

    let sortUpdatedColumns = this.updatedColumn?.map((item:any)=>{
      return constantsX.accountName[item];
    });
    this.updatedColumn = [];
    console.log(sortUpdatedColumns, this.updatedColumn)
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
      'Accounts receivable',
      'Cash',
      'Goodwill',
      'Investments',
      'Land',
      'PPE',
      'Unbilled Revenue',
    ].forEach((col: string) => {
      let columnSum: number = 0;
      console.log(col, "the col details")
      columnSum = columnSum + Number(data[constantsX.accountName[col]]);
      if (columnSum != 0) {
        assetsGraph.push({
          label: col,
          data: [columnSum,0],
        });
      }
    });
    return assetsGraph;
  }

  getLiabilityGraph(data: any) {
    let LiabilityGraph: any = [];
    [
      'Accounts payable',
      'Bonds payable',
      'Unearned Revenue',
      'Dividend payables',
      'Notes payable',
      'Interest payable',
      'Addnl. Paid in Capital',
      'Common stock',
      'Retained Earnings',
      'Unrealized Gain',
      'Unrealized Loss',
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
          'Dividend/Investment income',
          'Investment Income',
          'Profit on retirement of bonds',
          'Realized gain',
          'Revenue',
          'Gain',
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
          'Bad debt Expense',
          'Depreciation Expense',
          'Goodwill Amortization Expense',
          'Interest expense',
          'Loss',
          'Realized loss',
          'Insurance Expense',
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
    let openingBalance = new Array(37).fill(0);
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
