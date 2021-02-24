import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators'

import { IngredientName } from 'src/app/model/ingredient_name';
import { AlertService } from 'src/app/service/alert/alert.service';
import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient-name.service';

@Component({
  selector: 'app-ingredient-name-list',
  templateUrl: './ingredient-name-list.component.html',
  styleUrls: ['./ingredient-name-list.component.css']
})
export class IngredientNameListComponent implements OnInit {
  ingredientNames!: IngredientName[];

  constructor(
    private ingredientNameService: IngredientNameService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.ingredientNameService.getAll()
      .pipe(first())
      .subscribe(ingredientNames => this.ingredientNames = ingredientNames)
  }

  deleteIngredientName(id: string) {
    const measureUnit = this.ingredientNames.find(x => x.id === id);
    if (!measureUnit) return;
    measureUnit.isDeleting = true;
    this.ingredientNameService.delete(id)
      .pipe(first())
      .subscribe(data => {
        this.alertService.success(`Ingrediënt ${data.name} verwijderd`, { keepAfterRouteChange: true })
        this.ingredientNames = this.ingredientNames.filter(x => x.id !== id)
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      });
  }

}
