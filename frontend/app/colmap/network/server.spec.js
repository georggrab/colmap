"use strict";
var testing_1 = require('@angular/core/testing');
var server_1 = require('./server');
testing_1.describe('Server Connection', function () {
    testing_1.beforeEachProviders(function () { return [
        { provide: server_1.BackendService, useClass: server_1.BackendService }
    ]; });
    testing_1.it('should be able to connect to endpoint', testing_1.inject([server_1.BackendService], function (server) {
        testing_1.expect(server.connect('endpoint').connected).toBe(true);
    }));
    testing_1.it('should be able to retrieve a graphnetwork from server', testing_1.inject([server_1.BackendService], function (server) {
        var g = server.downloadNetwork();
        testing_1.expect(g.directConnection("node1", "node2")).toBe(true);
    }));
    testing_1.it('should be able to retrieve delta update since date from server', testing_1.inject([server_1.BackendService], function (server) {
        var g = server.retrieveDelta(0);
        testing_1.expect(g.nodesUpdated >= 0).toBeTruthy();
    }));
});
//# sourceMappingURL=server.spec.js.map