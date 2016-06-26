import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  injectAsync
} from '@angular/core/testing';
import { PerferenceService, CStorage } from './preferences';
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

	it('should be able to get preferences', inject([PerferenceService], (pref) => {
		return pref
	}));
});
