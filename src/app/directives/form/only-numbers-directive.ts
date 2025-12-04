import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]'
})
export class OnlyNumbersDirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    // Allow only numbers
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
}