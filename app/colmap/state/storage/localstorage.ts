import { Storage } from '../preferences';
import { Injectable } from '@angular/core';

/* Normally would be something like "T implements Serializable",
   but since every JS Object is -- in this simple case, anyways -- serializable,
   i've left that part out
   TODO implement runtime checking, expiration checking, etc.
   TODO implement storage capabilities priority checking
*/
@Injectable()
export class LocalStorage implements Storage {
	constructor(){
		if (typeof(Storage) === "undefined"){
			throw "LocalStorage unsupported";
		}
	}
	load() : Object {
		return JSON.parse(window.localStorage.getItem("preferences"));
	}

	save(anything : Object){
		window.localStorage.setItem("preferences", JSON.stringify(anything));
	}
}