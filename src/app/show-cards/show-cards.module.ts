import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowCardsRoutingModule } from './show-cards-routing.module';
import { ShowCardsComponent } from './show-cards.component';


@NgModule({
  declarations: [
    ShowCardsComponent
  ],
  imports: [
    CommonModule,
    ShowCardsRoutingModule
  ]
})
export class ShowCardsModule { }
