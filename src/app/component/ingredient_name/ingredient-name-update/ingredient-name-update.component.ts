import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { IngredientName } from 'src/app/model/ingredient_name.model';
import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient_name.service';

function removeEmptyProperties(properties: any) {
  if (properties.ingredientType == '') delete properties["ingredientType"]
  if (properties.shopType == '') delete properties["shopType"]
}

@Component({
  selector: 'app-ingredient-name-update',
  templateUrl: './ingredient-name-update.component.html',
  styleUrls: ['./ingredient-name-update.component.css']
})
export class IngredientNameUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  id!: string
  loading = false;
  submitted = false;

  shopTypes!: string[];
  ingredientTypes!: string[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public ingredientNameService: IngredientNameService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      pluralName: ['', Validators.required],
      stock: [''],
      shopType: [''],
      ingredientType: ['']
    })

    let ingredientName: IngredientName = this.ingredientNameService.load(this.id)
    if (ingredientName) {
      this.updateForm.patchValue(ingredientName);
    }
  }

  get f() { return this.updateForm.controls}

  onSubmit() {
    this.submitted = true;

    if (this.updateForm.invalid) {
      return;
    }

    removeEmptyProperties(this.updateForm.value);

    this.ingredientNameService.update(this.id, this.updateForm.value)
    this.router.navigate(['/ingredientNames']);
  }
}
