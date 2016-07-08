export class Utils {
	static defined(o : Object, keys : [string]) : boolean {
		for (let key of keys){
			if (o[key] === undefined) return false;
		}
		return true;
	}
}