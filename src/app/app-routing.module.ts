import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalanceSheetEquationComponent } from './balance-sheet-equation/balance-sheet-equation.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: 'understand-balance-sheet-equation',
    component: BalanceSheetEquationComponent,
  },
  {
    path: '',
    redirectTo: '/understand-balance-sheet-equation',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
