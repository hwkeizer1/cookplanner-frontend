import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TagService } from 'src/app/service/tag/tag.service';

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
    private tagService: TagService) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid) {
      alert("Invalid");
      return
    }

    this.tagService.create(this.createForm.value);
    this.router.navigate(['/tags']);

  }

  get f() { return this.createForm.controls; }

}
