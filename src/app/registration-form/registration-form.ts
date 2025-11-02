import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchableSelectComponent } from '../shared/searchable-select/searchable-select';

@Component({
  selector: 'app-registration-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SearchableSelectComponent
  ],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
})
export class RegistrationForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix'
  ];
  protected readonly hobbies = [
    'Reading',
    'Cooking',
    'Traveling',
    'Photography',
    'Gardening'
  ];
  protected readonly countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany'
  ];
  protected readonly selectErrors = {
    city: { required: 'City is required' },
    hobby: { required: 'Hobby is required' },
    country: { required: 'Country is required' }
  } as const;

  protected readonly submitted = signal(false);
  protected readonly today = new Date();

  protected readonly registrationForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^\+?[0-9\s()-]{7,15}$/)]
    ],
    dob: [null, Validators.required],
    city: ['', Validators.required], // Chicago
    hobby: ['', Validators.required],
    country: ['', Validators.required]
  });

  protected readonly formControls = computed(() => this.registrationForm.controls);

  constructor() {
    this.registrationForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.submitted.set(false));
  }
  ngOnInit(): void {
    setTimeout(()=>{
      this.registrationForm.patchValue({"city": "Chicago"});
    },100);
  }
  protected submit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.submitted.set(false);
      return;
    }

    this.submitted.set(true);
  }
}
