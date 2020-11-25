import { Directive, Input } from '@angular/core';
import {
  AbstractControl,

  NG_VALIDATORS, ValidationErrors, Validator,



  ValidatorFn
} from '@angular/forms';
import { Subscription } from 'rxjs';


export function compareValidator(controlNameToCompare: string): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (c.value === null || c.value.length === 0) {
      return null; // don't validate empty value
    }
    const controlToCompare = c.root.get(controlNameToCompare);
    if (controlToCompare) {
      const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
        c.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return controlToCompare && controlToCompare.value !== c.value ? { appCompareValidator: true } : null;
  };
}

@Directive({
  selector: '[appCompareValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CompareValidatorDirective, multi: true }]
})
export class CompareValidatorDirective implements Validator {
  @Input() controlNameToCompare: string;

  validate(c: AbstractControl): ValidationErrors | null {
    return compareValidator(this.controlNameToCompare)(c);
  }

}
