import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/service/recipe/recipe.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  createForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      recipeType: ['', Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid) {
      return
    }
  
  this.recipeService.create(this.createForm.value);
  this.router.navigate(['/recipes']);
  }

   get f() { return this.createForm.controls; }

}
