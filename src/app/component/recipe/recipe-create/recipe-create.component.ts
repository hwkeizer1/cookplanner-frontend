import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class RecipeCreateComponent implements OnInit {
  createForm!: FormGroup;
  loading = false;
  submitted = false;
  tagList: TagItem[] = new Array;
  subscription?: Subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public recipeService: RecipeService,
    public tagService: TagService) { 
    }

  ngOnInit(): void {
    this.tagService.allAvailableTags.subscribe(
      data => {
        this.tagList = [];
        data.forEach(item => { this.tagList.push({value: item.name })});
      }
    )

    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      recipeType: ['', Validators.required],
      preparationTime: ['', Validators.min(0)],
      cookTime: ['', [Validators.min(0), Validators.required]],
      servings: ['', [Validators.min(0), Validators.required]],
      rating: ['', [Validators.min(1), Validators.max(10)]],
      tagList: this.formBuilder.array([])
    })
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
// TODO: submit the tags in the create method instead of the TagItems
    this.recipeService.create(this.createForm.value);
    this.router.navigate(['/recipes']);
  }

  get f() { return this.createForm.controls; }

}
