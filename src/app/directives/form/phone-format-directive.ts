import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[phoneFormat]'
})
export class PhoneFormatDirective {
  private maxLength = 11;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(_: Event): void {
    const input = this.el.nativeElement;
    let value = input.value.replace(/\D/g, ''); // remove non-numeric chars

    if (value.length > this.maxLength) {
      value = value.slice(0, this.maxLength);
    }

    if (value.length >= 8) {
      value = value.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2 - $3');
    } 
    if (value.length >= 2 && value.length) {
      value = value.replace(/^(\d{2})(\d+)/, '($1) $2');
    } else if (value.length > 7) {
      value = value.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2 - $3');
    }
    input.value = value;
  }
}