import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective {
  private maxLength = 8;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(_: Event): void {
    const input = this.el.nativeElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > this.maxLength) {
      value = value.slice(0, this.maxLength);
    }

    if (value.length > 4) {
      value = value.replace(/^(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d+)/, '$1/$2');
    }

    input.value = value;
  }
}