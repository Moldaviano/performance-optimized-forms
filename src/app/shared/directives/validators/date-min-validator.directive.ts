import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[appDateMinValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DateMinValidatorDirective,
      multi: true,
    },
  ],
})
export class DateMinValidatorDirective {
  @Input('appDateMaxValidator') dateCheck = ' ';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.dateCheck ? dateMinValidator(this.dateCheck)(control) : null;
  }
}

export function dateMinValidator(date: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let data = new Date(date);
    return data > new Date(control.value)
      ? { validDate: { value: control.value } }
      : null;
  };
}
