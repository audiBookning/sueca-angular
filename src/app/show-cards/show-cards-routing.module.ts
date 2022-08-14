import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCardsComponent } from './show-cards.component';

const routes: Routes = [{ path: '', component: ShowCardsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowCardsRoutingModule { }
