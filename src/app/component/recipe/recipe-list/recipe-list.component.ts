import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { RecipeService } from 'src/app/service/recipe/recipe.service';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public recipeService: RecipeService,
    private router: Router) {
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

  showDetails(id: string) {
    this.router.navigate([`/recipe-details/${id}`])
  }

  deleteRecipe(id: string) {
    this.recipeService.remove(id);
  }

  updateRecipe(id: string) {
    this.router.navigate([`/recipe-update/${id}`]);
  }

}
