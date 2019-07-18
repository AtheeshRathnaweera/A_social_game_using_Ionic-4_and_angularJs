import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'userprofile', loadChildren: './userprofile/userprofile.module#UserprofilePageModule' },
  { path: 'addacomment', loadChildren: './addacomment/addacomment.module#AddacommentPageModule' },
  { path: 'viewthestory', loadChildren: './viewthestory/viewthestory.module#ViewthestoryPageModule' },
  { path: 'addsavethenewcomment', loadChildren: './addsavethenewcomment/addsavethenewcomment.module#AddsavethenewcommentPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
