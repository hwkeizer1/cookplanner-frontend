import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { RecipeService } from 'src/app/service/recipe/recipe.service';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public recipeService: RecipeService) {
    this.recipeService.loadAll();
    this.headers = new QueryList;
   }

   onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.recipeService.sortColumn = column;
    this.recipeService.sortDirection = direction;
  }

  deleteRecipe(id: string) {
    this.recipeService.remove(id);
  }

}
