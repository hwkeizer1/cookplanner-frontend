import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { TagListComponent } from './component/tag/tag-list/tag-list.component';
import { TagCreateComponent } from './component/tag/tag-create/tag-create.component';
import { TagUpdateComponent } from './component/tag/tag-update/tag-update.component';
import { MeasureUnitListComponent } from './component/measure_unit/measure_unit-list/measure_unit-list.component';
import { MeasureUnitCreateComponent } from './component/measure_unit/measure_unit-create/measure_unit-create.component';
import { MeasureUnitUpdateComponent } from './component/measure_unit/measure_unit-update/measure_unit-update.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tags', component: TagListComponent },
  { path: 'tag-create', component: TagCreateComponent },
  { path: 'tag-update/:id', component: TagUpdateComponent },
  { path: 'measureUnits', component: MeasureUnitListComponent },
  { path: 'measureUnit-create', component: MeasureUnitCreateComponent },
  { path: 'measureUnit-update/:id', component: MeasureUnitUpdateComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
