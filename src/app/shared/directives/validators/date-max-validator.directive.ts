import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[appDateMaxValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DateMaxValidatorDirective,
      multi: true,
    },
  ],
})
export class DateMaxValidatorDirective {
  @Input('appDateMaxValidator') dateCheck = ' ';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.dateCheck ? dateMaxValidator(this.dateCheck)(control) : null;
  }
}

export function dateMaxValidator(date: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let data = new Date(date);
    return data < new Date(control.value)
      ? { validDate: { value: control.value } }
      : null;
  };
}
