import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[cepFormat]'
})
export class CepFormatDirective {
  private maxLength = 8;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(_: Event): void {
    const input = this.el.nativeElement;
    let value = input.value.replace(/\D/g, ''); // remove non-numeric chars

    if (value.length >= this.maxLength) {
      value = value.slice(0, this.maxLength);
    }

    if (value.length >= 8) {
      value = value.replace(/^(\d{5})(\d+)/, '$1-$2');
    } 
    input.value = value;
  }
}