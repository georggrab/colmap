import { Component } from '@angular/core';
import { MaterialTemplate } from './material';

@Component({
	selector: 'create',
	template: `
		<form action="#">
		  <div class="mdl-textfield mdl-js-textfield">
		    <input class="mdl-textfield__input" type="text" id="sample1">
		    <label class="mdl-textfield__label" for="sample1">Text...</label>
		  </div>
		  <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
  create
</button>
		</form>

	`
}) export class AppComponent extends MaterialTemplate {
}