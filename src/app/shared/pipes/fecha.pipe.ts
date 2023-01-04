import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

export const meses = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
export const dias_semana = [
  '',
  'Lunes',
  'martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

@Pipe({
  name: 'fecha',
})
export class FechaPipe implements PipeTransform {
  transform(date: Date, ...args: unknown[]): unknown {
    const newDate = new Date(date);
    const dateFormated = DateTime.fromJSDate(newDate);
    return (
      dias_semana[dateFormated.weekday] +
      ', ' +
      dateFormated.day +
      ' de ' +
      meses[dateFormated.month] +
      ' de ' +
      dateFormated.year
    );
  }
}
