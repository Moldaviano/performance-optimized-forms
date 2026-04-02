import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[appStringMinLengthValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StringMinLengthValidatorDirective,
      multi: true,
    },
  ],
})
export class StringMinLengthValidatorDirective {
  @Input('appStringMinLengthValidator') minLength = 0;

  validate(control: AbstractControl): ValidationErrors | null {
    return this.minLength
      ? stringMinLengthValidator(this.minLength)(control)
      : null;
  }
}

export function stringMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return minLength < control.value.length
      ? null
      : { validString: { value: control.value } };
  };
}
