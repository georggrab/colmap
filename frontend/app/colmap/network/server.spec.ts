import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { provide, Injectable, Provider } from '@angular/core';
import { GeoGraphNetwork, GraphNetworkUpdate } from '../graph/graphnetwork';
import { BackendService} from './server';

describe('Server Connection', () => {

	beforeEachProviders(() => [
		{provide: BackendService, useClass : BackendService}	
	]);

	it('should be able to connect to endpoint', inject([BackendService], (server) => {
		expect(server.connect('endpoint').connected).toBe(true);
	}));

	it('should be able to retrieve a graphnetwork from server', inject([BackendService], (server) => {
		let g : GeoGraphNetwork = server.downloadNetwork();
		expect(g.directConnection("node1", "node2")).toBe(true);
	}))

	it('should be able to retrieve delta update since date from server', inject([BackendService], (server) => {
		let g : GraphNetworkUpdate = server.retrieveDelta(0);
		expect(g.nodesUpdated >= 0).toBeTruthy();
	}))

});
