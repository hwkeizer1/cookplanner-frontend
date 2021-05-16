import { Ingredient } from "./ingredient.model";
import { Tag } from "./tag.model";

export class Recipe {
  id!: string;
  name: string = '';
  servingTips?: string;
  notes?: string;
  ingredients?: Ingredient[];
  image?: string;
  recipeType: string = '';
  tags: Tag[] = new Array;
  preparationTime: number = 0;
  cookTime: number = 0;
  servings: number = 0;
  timesServed?: number;
  lastServed?: Date;
  preparations?: string;
  directions?: string;
  rating?: number;
  tagString?: string;
  isDeleting: boolean = false;
}