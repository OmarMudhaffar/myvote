import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ReverbPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'reverb',
})
export class ReverbPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Array<any>, ...args) {
    if(value){
      return value.slice().reverse();
    }
    return null;
  }
}
