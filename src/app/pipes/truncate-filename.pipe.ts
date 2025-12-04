import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateFilename',
  standalone: true,
})
export class TruncateFilenamePipe implements PipeTransform {
  transform(value: string, maxLength: number = 8): string {
    if (!value) {
      return '';
    }

    const lastDotIndex = value.lastIndexOf('.');
    if (lastDotIndex === -1 || value.length <= maxLength + 4) { // +4 for '... ' and extension
      return value;
    }

    const filename = value.substring(0, lastDotIndex);
    const extension = value.substring(lastDotIndex);

    if (filename.length > maxLength) {
      return `${filename.substring(0, maxLength)}... ${extension}`;
    }

    return value;
  }
}