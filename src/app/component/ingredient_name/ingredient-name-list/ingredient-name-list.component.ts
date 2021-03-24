import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient_name.service';

@Component({
  selector: 'app-ingredient-name-list',
  templateUrl: './ingredient-name-list.component.html',
  styleUrls: ['./ingredient-name-list.component.css']
})
export class IngredientNameListComponent {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public ingredientNameService: IngredientNameService) {
    this.ingredientNameService.loadAll();
    this.headers = new QueryList;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.ingredientNameService.sortColumn = column;
    this.ingredientNameService.sortDirection = direction;
  }

  deleteIngredientName(id: string) {
    this.ingredientNameService.remove(id);
  }

}
