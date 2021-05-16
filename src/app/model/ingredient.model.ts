import { IngredientName } from "./ingredient_name.model";
import { MeasureUnit } from "./measure_unit.model";
import { Recipe } from "./recipe.model";

export class Ingredient {
  id!: string;
  recipe!: Recipe;
  amount!: number;
  measureUnit!: MeasureUnit;
  ingredientName!: IngredientName;
}