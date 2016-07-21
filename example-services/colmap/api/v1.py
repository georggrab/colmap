import requests

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
			return resp.json()
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
