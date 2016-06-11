export class MaterialTemplate {
	ngAfterViewInit(){
		componentHandler.upgradeAllRegistered();
	}
}