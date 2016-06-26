import { LocalStorage } from './localstorage';
import { Preference, PREFERENCE_DEFAULT } from '../preferences';


describe('LocalStorage Storage Device', () => {
	let localStorage : LocalStorage;

	beforeEach(() => {
		localStorage = new LocalStorage();
	});

	it('should be able to save preferences to localstorage', () => {
		let preference = new Preference();
		localStorage.save(preference);
		expect(
			(<Preference>localStorage.load()).ChosenMap)
			.toEqual(preference.ChosenMap);
	});
});