import { Pipe, PipeTransform } from '@angular/core'
import * as _moment from 'moment'
const moment = _moment

@Pipe({
  name: 'pipeRelativeTime',
})
export class PipeRelativeTimePipe implements PipeTransform {
  transform(value: number): string {
    if (value) {
      return moment((new Date(value))).fromNow()
    }
    return moment().startOf('hour').fromNow()
  }
}
