import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators'

import { TagService } from 'src/app/service/tag/tag.service';
import { AlertService } from 'src/app/service/alert/alert.service';

@Component({
  selector: 'app-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.css']
})
export class TagCreateComponent implements OnInit {
  createForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tagService: TagService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.createForm.invalid) {
      alert("Invalid");
      return
    }

    // this.loading = true;
    this.tagService.create(this.createForm.value);
    this.router.navigate(['/tags']);
    // this.loading = false;

      // .subscribe(data => {
      //   this.alertService.success(`Categorie ${data.name} toegevoegd`, { keepAfterRouteChange: true })
      //   this.router.navigate(['/tags']);
      // },
      // error => {
      //   this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      //   this.router.navigate(['/tags']);
      // })
      // .add(() => this.loading = false);
  }

  // Convenience getter for easy access to form fields
  get f() { return this.createForm.controls; }

}
