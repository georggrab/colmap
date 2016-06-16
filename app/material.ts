declare var componentHandler: any;

export class MaterialTemplate {
	ngAfterViewInit(){
		componentHandler.upgradeAllRegistered();
	}
}