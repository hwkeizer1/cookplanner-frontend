import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient_name.service';

function removeEmptyProperties(properties: any) {
  if (properties.ingredientType == '') delete properties["ingredientType"]
  if (properties.shopType == '') delete properties["shopType"]
}

@Component({
  selector: 'app-ingredient-name-create',
  templateUrl: './ingredient-name-create.component.html',
  styleUrls: ['./ingredient-name-create.component.css']
})
export class IngredientNameCreateComponent implements OnInit {
  createForm!: FormGroup;
  loading = false;
  submitted = false;

  ingredientTypes!: string[];
  shopTypes!: string[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public ingredientNameService: IngredientNameService) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      pluralName: ['', Validators.required],
      stock: [''],
      shopType: [''],
      ingredientType: ['']
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid) {
      return
    }

  removeEmptyProperties(this.createForm.value) 
  
  this.ingredientNameService.create(this.createForm.value);
  this.router.navigate(['/ingredientNames']);
  }

   get f() { return this.createForm.controls; }

}
