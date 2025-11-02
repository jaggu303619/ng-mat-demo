import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, computed, inject, Input, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.scss'
})
export class SearchableSelectComponent implements ControlValueAccessor {
  private static nextId = 0;

  @Input() label = '';
  @Input() placeholder = '';
  @Input() searchPlaceholder = 'Search';
  @Input() noOptionsText = 'No options found';
  @Input() hint = '';
  @Input() appearance: 'outline' | 'fill' = 'outline';
  @Input() errorMessages: Record<string, string> = {};
  @Input() set options(value: readonly string[]) {
    this._options = [...value];
    this.resetFilteredOptions();
  }

  protected readonly searchTerm = signal('');
  protected readonly filteredOptions = signal<string[]>([]);
  protected readonly errorKeys = computed(() => Object.keys(this.errorMessages));
  protected readonly searchInputClass = `searchable-select-input-${SearchableSelectComponent.nextId++}`;
  protected value: string | null = null;
  protected isDisabled = signal(false);

  private _options: string[] = [];
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly document = inject(DOCUMENT);

  constructor(@Optional() @Self() private readonly ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.resetFilteredOptions();
  }

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onSearch(term: string): void {
    this.searchTerm.set(term);
    const normalized = term.trim().toLowerCase();

    if (!normalized) {
      this.resetFilteredOptions();
      return;
    }

    this.filteredOptions.set(
      this._options.filter((option) => option.toLowerCase().includes(normalized))
    );
  }

  protected onPanelToggled(open: boolean): void {
    if (!open) {
      this.onSearch('');
      this.onTouched();
      return;
    }

    queueMicrotask(() => {
      const input = this.document.querySelector<HTMLInputElement>(`.${this.searchInputClass}`);
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  protected onValueChange(value: string | null): void {
    this.value = value;
    this.onChange(value);
  }

  protected hasError(key: string): boolean {
    const control = this.ngControl?.control;
    return !!control?.hasError(key) && (control.touched || control.dirty);
  }

  private resetFilteredOptions(): void {
    this.filteredOptions.set([...this._options]);
  }
}
