#!/usr/bin/env python2

import requests
import sys
import re
import urlparse

import colmap.api.v1 as api

def get_urls_of(url):
	url_regexp = 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'

	try:
		request = requests.get(url)
	except Exception:
		return []
	m = re.findall(url_regexp, request.text)

	m = set(map(lambda x: urlparse.urlsplit(x), m))
	m = filter(lambda f: not f.netloc in url, m)
	return m

def geoip_lookup(url):
	res = requests.get("http://localhost:8080/json/" + url)
	try:
		jsn = res.json()
		return { "ip" : jsn["ip"], "x": jsn["latitude"], "y": jsn["longitude"] }
	except:
		return False

def propagate_url(context, recursion_depth, url, connect_to):
	if recursion_depth > 2: return
	print "N " + url.geturl()

	node = geoip_lookup(url.netloc)
	if node:
		# Geoip Lookup might fail
		payload = api.Request(auth=context.get_api_key())
		payload.set_node(node)

		handle = api.colmap_propagate(context, payload)
		if connect_to is not None:
			try:
				handle = handle[0][0]["ID(n)"]
			except: 
				print "E HDL: " + str(handle)
			try:
				connect_to = connect_to[0][0]["ID(n)"]
			except:
				print "E CNN: " + str(connect_to)

			payload = api.Request(auth=context.get_api_key())
			payload.set_edge([[connect_to, handle]])
			api.colmap_propagate(context,payload)

	urls = get_urls_of(url.geturl())
	for suburl in urls:
		propagate_url(context, recursion_depth + 1, suburl, handle)

def main(args):
	context = api.ColmapCtx("http://localhost:3001", "c221510b60e33")
	context = api.register_service(context, "testService", "script/oneshot")

	payload = api.Request(auth=context.get_api_key())

	if len(args) >= 2:
		propagate_url(context, 0, urlparse.urlsplit(args[1]), None)
	else:
		print "No Args!"


	#colmap_propagate(service_context, payload)


if __name__ == '__main__':
	main(sys.argv)


