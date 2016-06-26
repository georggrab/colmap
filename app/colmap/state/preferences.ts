import { Component, Injectable, Inject } from '@angular/core';

declare var ol: any;

export class CStorage{}
export interface CStorage {
	save(thing : Object): void;
	load(): Object;
}

export class Preference {
	ChosenMap: any = "ol.source.OSM";
}

export var PREFERENCE_DEFAULT = new Preference();

@Injectable()
export class PerferenceService {
	private pref: Preference = PREFERENCE_DEFAULT;

	constructor(private StorageDevice : CStorage){
		// Initialize Storage Device with default preferences
		// if it is empty.
		if (this.StorageDevice.load() == null){
			let p = new Preference();
			this.StorageDevice.save(p);
		}
	}

	getPreferences(): Preference {
		this.pref = <Preference> this.StorageDevice.load();
		return this.pref;
	}

	getPreference(key : string) {
		let pref = this.StorageDevice.load();
		if (pref.hasOwnProperty(key)){
			return pref[key];
		} else {
			return null;
		}
	}

	setPreferences(pref : Preference){
		this.pref = pref;
		this.StorageDevice.save(this.pref);
	}

	setPreference(key : string, val : any){
		if (this.pref.hasOwnProperty(key)){
			this.pref[key] = val;
			this.StorageDevice.save(this.pref);
		} else {
			throw "PreferenceService: Unknown Preference key ${key}";
		}
	}
}