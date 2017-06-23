import { AbstractControl } from '@angular/forms';

export function cscNumberValidator(control: AbstractControl) {
  const value: number = control.value;
  const notValid: boolean = isNaN(value) || Math.round(value) !== value;
  return notValid ? { cscNumberValid: true } : null;
}
