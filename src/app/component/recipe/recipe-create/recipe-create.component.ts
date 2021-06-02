import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from 'src/app/model/recipe.model';
import { Tag } from 'src/app/model/tag.model';
import { RecipeService } from 'src/app/service/recipe/recipe.service';
import { TagService } from 'src/app/service/tag/tag.service';

interface TagItem {
  value: string;
}

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
    private formBuilder: FormBuilder,
    public recipeService: RecipeService,
    public tagService: TagService) { 
    }

  ngOnInit(): void {
    this.allTagsSubscription = this.tagService.allAvailableTags.subscribe(
      data => {
        this.allTags = [];
        data.forEach(item => { this.allTags.push(item)});
      }
    )

    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      recipeType: ['', Validators.required],
      preparationTime: ['', Validators.min(0)],
      cookTime: ['', [Validators.min(0), Validators.required]],
      servings: ['', [Validators.min(0), Validators.required]],
      rating: ['', [Validators.min(1), Validators.max(10)]],
      ingredients: [],
      tagList: this.formBuilder.array([]),
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

}
