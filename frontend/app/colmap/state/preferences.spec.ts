import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { PerferenceService, CStorage, Preference } from './preferences';
import { provide, Injectable, Provider } from '@angular/core';

export class MockStorageDevice {
	thing : Object = { ChosenMap : "something", SomethingElse : false };

	load() : Object { return this.thing }
	save(object : Object) : void { this.thing = object; }
}

describe('Preference Subsystem', () => {

	beforeEachProviders(() => [
		{provide: PerferenceService, useClass : PerferenceService},	
		{provide: CStorage, useClass : MockStorageDevice}]
	);

	it('should be able to get preferences', inject([PerferenceService], (pref : PerferenceService) => {
		let p = pref.getPreferences();
		expect(p.ChosenMap).toEqual("something");
	}));

	it('should be able to get specific preference', inject([PerferenceService], (pref : PerferenceService) => {
		let p = pref.getPreference("ChosenMap");
		expect(p).toEqual("something");
	}));

	it('should be able to set preferences', inject([PerferenceService], (pref : PerferenceService) => {
		let l : Preference = new Preference();
		l.ChosenMap = 'lul';
		pref.setPreferences(l);
		expect(pref.getPreferences().ChosenMap).toEqual("lul");
	}));

	it('should be able to set specific preference', inject([PerferenceService], (pref : PerferenceService) => {
		pref.setPreference("ChosenMap", "sup");
		expect(pref.getPreference("ChosenMap")).toEqual("sup");
	}));
});
