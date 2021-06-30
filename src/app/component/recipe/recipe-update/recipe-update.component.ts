import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IngredientName } from 'src/app/model/ingredient_name.model';
import { MeasureUnit } from 'src/app/model/measure_unit.model';
import { Recipe } from 'src/app/model/recipe.model';
import { Tag } from 'src/app/model/tag.model';
import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient_name.service';
import { MeasureUnitService } from 'src/app/service/measure_unit/measure_unit.service';
import { RecipeService } from 'src/app/service/recipe/recipe.service';
import { TagService } from 'src/app/service/tag/tag.service';
import { IngredientNameCreateComponent } from '../../ingredient_name/ingredient-name-create/ingredient-name-create.component';

@Component({
  selector: 'app-recipe-update',
  templateUrl: './recipe-update.component.html',
  styleUrls: ['./recipe-update.component.css']
})
export class RecipeUpdateComponent implements OnInit, OnDestroy {
  updateForm!: FormGroup;
  id!: string;
  submitted = false;
  loading = false;
  allTags: Tag[] = new Array;
  allTagsSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public recipeService: RecipeService,
    public tagService: TagService,
    public measureUnitService: MeasureUnitService,
    public ingredientNameService: IngredientNameService) {
    this.measureUnitService.loadAll();
    this.ingredientNameService.loadAll();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.allTagsSubscription = this.tagService.allAvailableTags.subscribe(
      data => {
        this.allTags = [];
        data.forEach(item => { this.allTags.push(item) });
      }
    )

    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      recipeType: ['', Validators.required],
      preparationTime: ['', Validators.min(0)],
      cookTime: ['', [Validators.min(0), Validators.required]],
      servings: ['', [Validators.min(0), Validators.required]],
      rating: ['', [Validators.min(1), Validators.max(10)]],
      ingredients: this.fb.array([]),
      tagList: this.fb.array([]),
      preparations: [''],
      directions: ['']
    })

    let recipe: Recipe = this.recipeService.load(this.id)
    if (recipe) {
      this.updateForm.patchValue(recipe);

      recipe.ingredients.forEach(ingredient => {
        const ingredientForm = this.fb.group({
          amount: ['', Validators.required],
          measureUnit: [''],
          ingredientName: ['', Validators.required]
        });
        
        ingredientForm.patchValue(ingredient);
        console.log(ingredientForm.value)
        this.ingredients.push(ingredientForm)
      })
      console.log(this.updateForm.value)
    }
  }

  ngOnDestroy(): void {
    this.allTagsSubscription?.unsubscribe();
  }

  onTagCheckboxChange(e: any) {
    const tagList: FormArray = this.updateForm.get('tagList') as FormArray;
    if (e.target.checked) {
      tagList.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      tagList.controls.forEach((item) => {
        if (item.value == e.target.value) {
          tagList.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  addIngredient() {
    const ingredientForm = this.fb.group({
      amount: ['', Validators.required],
      measureUnit: [''],
      ingredientName: ['', Validators.required]
    });
    this.ingredients.push(ingredientForm);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  public compareIngredientNames(a: IngredientName, b: IngredientName): boolean {
    return a.id === b.id
  }

  public compareMeasureUnits(a: MeasureUnit, b: MeasureUnit): boolean {
    return a.id === b.id
  }

  onSubmit() {
    this.submitted = true;

    if (this.updateForm.invalid) {
      return
    }
    this.recipeService.update(this.id, this.updateForm.value)
    this.router.navigate(['/recipes']);
  }

  get f() { return this.updateForm.controls; }
  get ingredients() { return this.updateForm.controls["ingredients"] as FormArray; }

}
