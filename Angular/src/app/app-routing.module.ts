import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './MyComponents/body/body.component';
import { LeftSideBarComponent } from './MyComponents/left-side-bar/left-side-bar.component';
import { UserDetailsPageComponent } from './MyComponents/user-details-page/user-details-page.component';


const routes: Routes = [
  {
    path: '',
    component: LeftSideBarComponent,
    children: [
      { path: '', component: BodyComponent },
      { path: 'user/:id', component: UserDetailsPageComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
