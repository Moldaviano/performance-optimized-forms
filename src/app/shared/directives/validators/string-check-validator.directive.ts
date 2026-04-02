import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[appStringCheckValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StringCheckValidatorDirective,
      multi: true,
    },
  ],
})
export class StringCheckValidatorDirective implements Validator {
  @Input('appStringCheckValidator') stringCheck = ' ';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.stringCheck
      ? stringCheckValidator(new RegExp(this.stringCheck, 'g'))(control)
      : null;
  }
}

export function stringCheckValidator(stringRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const string = stringRe.test(control.value);
    return string ? null : { validString: { value: control.value } };
  };
}
