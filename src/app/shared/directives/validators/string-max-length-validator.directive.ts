import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[appStringMaxLengthValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StringMaxLengthValidatorDirective,
      multi: true,
    },
  ],
})
export class StringMaxLengthValidatorDirective {
  @Input('appStringMaxLengthValidator') maxLength = 0;

  validate(control: AbstractControl): ValidationErrors | null {
    return this.maxLength
      ? stringMaxLengthValidator(this.maxLength)(control)
      : null;
  }
}
/**
 * Controlla che il testo del campo rispetti la lunghezza massima fornita
 *
 * @param {number} maxLength - Lunghezza massima della stringa da rispettare affinchè il campo sia valido
 */
export function stringMaxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return maxLength > control.value.length
      ? null
      : { validString: { value: control.value } };
  };
}
