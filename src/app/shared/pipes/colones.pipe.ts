import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colones',
})
export class ColonesPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
