import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { TagListComponent } from './component/tag/tag-list/tag-list.component';
import { TagCreateComponent } from './component/tag/tag-create/tag-create.component';
import { TagUpdateComponent } from './component/tag/tag-update/tag-update.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tags', component: TagListComponent},
  { path: 'tag-create', component: TagCreateComponent},
  { path: 'tag-update/:id', component: TagUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
