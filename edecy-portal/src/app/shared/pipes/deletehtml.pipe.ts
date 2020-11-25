import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deletehtml'
})
export class DeletehtmlPipe implements PipeTransform {

  transform(value: string): any {
    return value.replace(/<.*?>/g, ''); // replace tags
  }

}
