#!/usr/bin/env python2

import requests
import sys

class ColmapCtx(object):
	def __init__(self, host, mapid):
		if not host.endswith("/"): host += "/"
		self.host = host
		self.map = mapid

	def get_url(self, type_):
		return self.host + "map/" + self.map + "/" + type_

	def set_api_key(self, serviceid, accesskey):
		self.auth = (serviceid, accesskey)

	def get_api_key(self): 
		return self.auth

class Request(object):
	def __init__(self, auth=None):
		if not auth:
			self.propagate = {}
		else:
			self.propagate = { "key" : auth[0] , "serviceid" : auth[1] }

	def get_propagate(self): return self.propagate

	def set_node(self, node):
		if not "addNode" in self.propagate:
			self.propagate["addNode"] = []
		self.propagate["addNode"] += [node]
		return self

	def set_edge(self, edge):
		self.propagate["addEdge"] = edge
		return self

	def set_hl_edge(self, edge):
		self.propagate["highlightEdge"] = edge
		return self

	def set_hl_node(self, node):
		self.propagate["highlightEdge"] = node
		return self

	def rm_node(self, node):
		self.propagate["rmNode"] = node
		return self

def colmap_propagate(context, request):
	if context.get_api_key != None:
		print request.get_propagate()
		resp = requests.post(context.get_url("propagate"), json=request.get_propagate())
		if resp.status_code == 200:
			print "Propagate OK."
			print resp.text
		else:
			raise Exception("Propagate failed!")

	else:
		raise Exception("Propagate: No Auth!")


def register_service(context, name, type):
	url = context.get_url("register")
	res = requests.post(url, json={
		"trigger" : name,
		"type" : "script/oneshot"
	})
	json = res.json()
	if res.status_code == 200 and json:
		if json["success"]:
			context.set_api_key(json["serviceAccessKey"], json["serviceID"])
			return context
		else:
			raise Exception("Register failed");
	else:
		raise Exception("Connection error");

def get_urls_of(url):
	return []

def geoip_lookup(url):
	res = requests.get("http://localhost:8080/json/" + url)
	jsn = res.json()
	return { "ip" : jsn["ip"], "x": jsn["latitude"], "y": jsn["longitude"] }

def propagate_url(context, recursion_depth, url, connect_to):
	node = geoip_lookup(url)

	payload = Request(auth=context.get_api_key())
	payload.set_node(node)

	handle = colmap_propagate(context, payload)

	urls = get_urls_of(url)
	for suburl in urls:
		propagate_url(recursion_depth + 1, suburl, node)

def main(args):
	context = ColmapCtx("http://localhost:3001", "c221510b60e33")
	context = register_service(context, "testService", "script/oneshot")

	payload = Request(auth=context.get_api_key())

	if len(args) >= 2:
		propagate_url(context, 0, args[1], None)
	else:
		print "No Args!"


	#colmap_propagate(service_context, payload)


if __name__ == '__main__':
	main(sys.argv)


