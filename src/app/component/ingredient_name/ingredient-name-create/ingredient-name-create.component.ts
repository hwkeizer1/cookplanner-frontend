import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators'

import { AlertService } from 'src/app/service/alert/alert.service';
import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient-name.service';

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
    private ingredientNameService: IngredientNameService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      pluralName: ['', Validators.required],
      stock: [''],
      shopType: [''],
      ingredientType: ['']
    })
    this.ingredientNameService.getAvailableShopTypes()
      .pipe(first())
      .subscribe(shopTypes => {this.shopTypes = shopTypes});
  }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.createForm.invalid) {
      alert("Invalid");
      return
    }

  removeEmptyProperties(this.createForm.value) 
  
    this.loading = true;
    this.ingredientNameService.create(this.createForm.value)
      .pipe(first())
      .subscribe(data => {
        this.alertService.success(`Ingrediënt ${data.name} toegevoegd`, { keepAfterRouteChange: true })
        this.router.navigate(['/ingredientNames']);
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
        this.router.navigate(['/ingredientNames']);
      })
      .add(() => this.loading = false);
  }

   // Convenience getter for easy access to form fields
   get f() { return this.createForm.controls; }

}
