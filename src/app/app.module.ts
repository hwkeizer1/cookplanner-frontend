import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './layout/home/home.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbdSortableHeader } from './directive/sortable.directive'

import { AlertComponent } from './layout/alert/alert.component';
import { TagListComponent } from './component/tag/tag-list/tag-list.component';
import { TagCreateComponent } from './component/tag/tag-create/tag-create.component';
import { TagUpdateComponent } from './component/tag/tag-update/tag-update.component';
import { MeasureUnitListComponent } from './component/measure_unit/measure_unit-list/measure_unit-list.component';
import { MeasureUnitCreateComponent } from './component/measure_unit/measure_unit-create/measure_unit-create.component';
import { MeasureUnitUpdateComponent } from './component/measure_unit/measure_unit-update/measure_unit-update.component';
import { IngredientNameCreateComponent } from './component/ingredient_name/ingredient-name-create/ingredient-name-create.component';
import { IngredientNameListComponent } from './component/ingredient_name/ingredient-name-list/ingredient-name-list.component';
import { IngredientNameUpdateComponent } from './component/ingredient_name/ingredient-name-update/ingredient-name-update.component';
import { DecimalPipe } from '@angular/common';
import { RecipeListComponent } from './component/recipe/recipe-list/recipe-list.component';
import { RecipeUpdateComponent } from './component/recipe/recipe-update/recipe-update.component';
import { RecipeCreateComponent } from './component/recipe/recipe-create/recipe-create.component';
import { RecipeDetailsComponent } from './component/recipe/recipe-details/recipe-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    FooterComponent,
    AlertComponent,
    TagListComponent,
    TagCreateComponent,
    TagUpdateComponent,
    MeasureUnitListComponent,
    MeasureUnitCreateComponent,
    MeasureUnitUpdateComponent,
    IngredientNameCreateComponent,
    IngredientNameListComponent,
    IngredientNameUpdateComponent,
    NgbdSortableHeader,
    RecipeListComponent,
    RecipeUpdateComponent,
    RecipeCreateComponent,
    RecipeDetailsComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
