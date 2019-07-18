import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddsavethenewcommentPage } from './addsavethenewcomment.page';

const routes: Routes = [
  {
    path: '',
    component: AddsavethenewcommentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddsavethenewcommentPage]
})
export class AddsavethenewcommentPageModule {}
