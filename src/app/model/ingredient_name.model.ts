export class IngredientName {
    id!: string;
    name!: string;
    pluralName!: string;
    stock: boolean = false;
    shopType?: string;
    ingredientType?: string;
}