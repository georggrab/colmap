import { Storage } from '../preferences';
import { Injectable } from '@angular/core';

/* Normally would be something like "T implements Serializable",
   but since every JS Object is -- in this simple case, anyways -- serializable,
   i've left that part out
*/
@Injectable()
export class LocalStorage<T> implements Storage<T> {
	load() : T {
		return null;
	}

	save(anything : T){

	}
}