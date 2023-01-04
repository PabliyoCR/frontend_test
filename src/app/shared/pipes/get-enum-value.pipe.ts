import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getEnumValue',
})
export class GetEnumValuePipe implements PipeTransform {
  transform(value: string, enumerable: any): unknown {
    return enumerable[value];
  }
}
