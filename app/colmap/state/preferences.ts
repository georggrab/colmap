import { Component, Injectable, ReflectiveInjector, Inject } from '@angular/core';

declare var ol: any;

export interface Storage<T>{
	save(T): void;
	load(): T;
}

export class Preference {
	ChosenMap: any = ol.source.OSM;
}

export var PREFERENCE_DEFAULT = new Preference();

@Injectable()
export class PerferenceService {
	private pref: Preference = PREFERENCE_DEFAULT;

	constructor(private StorageDevice : Storage<Preference>){

	}

	getPreferences(): Preference {
		this.pref = this.StorageDevice.load();
		return this.pref;
	}

	setPreferences(pref : Preference){
		this.pref = pref;
		this.StorageDevice.save(this.pref);
	}

	setPreference(key : string, val : any){
		// Fallback to JS for this
		if (this.pref.hasOwnProperty(key)){
			this.pref[key] = val;
		} else {
			throw "PreferenceService: Unknown Preference key ${key}";
		}
	}
}