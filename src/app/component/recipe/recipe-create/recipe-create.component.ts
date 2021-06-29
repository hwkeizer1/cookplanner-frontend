import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/model/ingredient.model';
import { Recipe } from 'src/app/model/recipe.model';
import { Tag } from 'src/app/model/tag.model';
import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient_name.service';
import { MeasureUnitService } from 'src/app/service/measure_unit/measure_unit.service';
import { RecipeService } from 'src/app/service/recipe/recipe.service';
import { TagService } from 'src/app/service/tag/tag.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit, OnDestroy {
  createForm!: FormGroup;
  loading = false;
  submitted = false;
  allTags: Tag[] = new Array;
  allTagsSubscription?: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public recipeService: RecipeService,
    public tagService: TagService,
    public measureUnitService: MeasureUnitService,
    public ingredientNameService: IngredientNameService) {
      this.measureUnitService.loadAll();
      this.ingredientNameService.loadAll();
    }

  ngOnInit(): void {
    this.allTagsSubscription = this.tagService.allAvailableTags.subscribe(
      data => {
        this.allTags = [];
        data.forEach(item => { this.allTags.push(item)});
      }
    )

    this.createForm = this.fb.group({
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
  }

  ngOnDestroy(): void {
    this.allTagsSubscription?.unsubscribe();
  }

  onTagCheckboxChange(e: any) {
    const tagList: FormArray = this.createForm.get('tagList') as FormArray;
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

  onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid) {
      return
    }
    let recipe = new Recipe();
    Object.keys(this.createForm.value).forEach( key => {if (key in recipe) recipe[key] = this.createForm.value[key]} );
    
    this.createForm.value.tagList.forEach(tagName => {
      let tag = this.allTags.find(item => item.name.toString() == tagName)
      if (tag) recipe.tags.push(tag)
    });

    this.recipeService.create(recipe);
    this.router.navigate(['/recipes']);
  }

  get f() { return this.createForm.controls; }
  get ingredients() { return this.createForm.controls["ingredients"] as FormArray; }

}
