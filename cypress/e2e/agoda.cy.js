const AgodaPage = require("../support/pages/agodaPage");

Cypress.on('uncaught:exception', () => false);

describe('Agoda Flight Booking Test - Jakarta to Singapore', () => {
	it('Search and select earliest Malaysia Airlines flight for tomorrow', () => {
		AgodaPage.visit();
		AgodaPage.clickFlightsTab();
		AgodaPage.fillDepartureCity("Jakarta");
		AgodaPage.fillArrivalCity("Singapore");
		AgodaPage.selectTomorrowDate();
		AgodaPage.SearchFlights();
		AgodaPage.waitForFlightResults();
		AgodaPage.filter(); 
		AgodaPage.sortbyDepartureTime()
		AgodaPage.selectFlightSchedule()
		AgodaPage.contactDetailsForm()
		AgodaPage.passengersForm()
		AgodaPage.payment()
		AgodaPage.details()
	});
});