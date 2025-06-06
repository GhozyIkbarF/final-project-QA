const dayjs = require("dayjs");
require("cypress-xpath");

class AgodaPage {
	visit() {
		cy.visit(Cypress.env("AGODA_URL"));
	}

	clickFlightsTab() {
		cy.contains("Flights").click();
	}

	fillDepartureCity(city) {
		cy.get('input[aria-label="Flying from"]').type(`${city}{enter}`);
		cy.get(".AutocompleteList, .AutocompleteSearch__AutocompleteList")
			.contains(city)
			.click();
	}

	fillArrivalCity(city) {
		cy.get('input[aria-label="Flying to"]').type(`${city}{enter}`);
		cy.get(".AutocompleteList, .AutocompleteSearch__AutocompleteList")
			.contains(city)
			.click();
	}

	selectTomorrowDate() {
		cy.get('[data-selenium="range-picker-date"]').click();
		cy.get("[class*='DayPicker']", { timeout: 10000 }).should("be.visible");

		const besok = dayjs().add(1, "day").format("D");

		cy.get('[role="grid"]').then(($grid) => {
			if ($grid.find(`button:contains(${besok})`).length) {
				cy.wrap($grid)
					.contains(new RegExp(`^${besok}$`))
					.click();
			} else {
				cy.get('[aria-label="Next Month"]').click();
				cy.get('[role="grid"]')
					.contains(new RegExp(`^${besok}$`))
					.click();
			}
		});

		cy.get("[class*='DayPicker']").should("not.exist");
	}

	SearchFlights() {
		cy.get('button').contains('SEARCH FLIGHTS').click();
	}

	waitForFlightResults() {
		cy.get('[data-testid="flightCard-flight-detail"]', {
			timeout: 20000,
		}).should("exist");
	}

	filter() {
		cy.xpath(
			`//button[contains(.,'Show all') and contains(.,'airlines')]`
		).click();


		cy.get('[data-element-name="flight-filter-airline-item"]').then(
			($airlines) => {
				const airlineLabels = [...$airlines].map((el) =>
					el.getAttribute("data-element-value")
				);

				// check Malaysia Airlines
				if (airlineLabels.includes("Malaysia Airlines")) {
					cy.contains("[data-element-value]", "Malaysia Airlines")
						.find('input[type="checkbox"]')
						.check({ force: true });

				} else if (airlineLabels.includes("Batik Air (Malaysia)")) {
					cy.contains("[data-element-value]", "Batik Air (Malaysia)")
						.find('input[type="checkbox"]')
						.check({ force: true });

				} else if (airlineLabels.includes("Jetstar Asia")) {
					cy.contains("[data-element-value]", "Jetstar Asia")
						.find('input[type="checkbox"]')
						.check({ force: true });
				} else {
					cy.log("Tidak ada maskapai yang cocok ditemukan.");
				}
			}
		);
	}

	sortbyDepartureTime() {
		cy.xpath(`//button[contains(.,'Sort by')]`).click();
		cy.get('[data-testid="floater-container"]').should("be.visible");
		cy.get('ul[role="listbox"] li').eq(3).find("button").click();
	}

	selectFlightSchedule() {
		cy.wait(5000);
		cy.get('[data-testid="flightCard-flight-detail"]').eq(0).click();

		cy.get('[data-testid="departure-time"]').invoke("text").as('departureTime')
		cy.get('[data-testid="arrival-time"]').invoke('text').as('arrivalTime')

		cy.wait(5000);
		cy.get('[data-component="flight-card-bookButton"]')
			.should("be.visible")
			.click();
	}

	contactDetailsForm() {
		cy.wait(10000);
		
		cy.get('[data-component="mob-flight-price-total-desc"]')
			.invoke("text")
			.as("selectedPrice");

		cy.fixture("contactDetails.json").as("contact");
		cy.get("@contact").then((contactData) => {
			
			cy.get('[data-testid="contact.contactFirstName"]').type(
				contactData.first_name
			);
			
			cy.get('[data-testid="contact.contactLastName"]').type(
				contactData.last_name
			);

			cy.get('[data-testid="contact.contactEmail"]').type(contactData.email);

			cy.get(
				'[data-testid="contact.contactPhoneNumber-PhoneNumberDataTestId"]'
			).type(contactData.phone_number);
			cy.get('input[aria-label="Male"]').check({ force: true });
		});
	}

	passengersForm() {
		cy.wait(5000);
		cy.fixture("passenger.json").as("passenger");
		cy.get("@passenger").then((passengerData) => {
			
			cy.get(
				'[data-testid="flight.forms.i0.units.i0.passengerFirstName"]'
			).type(passengerData.first_middle_name);

			cy.get('[data-testid="flight.forms.i0.units.i0.passengerLastName"]').type(
				passengerData.last_name
			);

			cy.wrap(
				`${passengerData.first_middle_name} ${passengerData.last_name}`
			).as("fullName");

			cy.get(
				'[data-testid="flight.forms.i0.units.i0.passengerDateOfBirth-DateInputDataTestId"]'
			).type(passengerData.day_birth);

			cy.get(
				'[data-testid="flight.forms.i0.units.i0.passengerDateOfBirth-MonthInputDataTestId"]'
			).click();
			cy.get('[data-testid="floater-container"]').should("be.visible");
			cy.get('[name="dropdown-list-item"]');
			cy.get("li").contains(passengerData.month_birth).click();

			cy.get(
				'[datatestid="flight.forms.i0.units.i0.passengerDateOfBirth-YearInputDataTestId"]'
			).type(passengerData.year_birth);
			cy.get(
				'[data-testid="flight.forms.i0.units.i0.passengerNationality"]'
			).click();
			cy.get("li").contains(passengerData.nationality).click();

			//Check apakah field passport ada atau tidak
			cy.get("body").then(($body) => {
				// cek apakah elemen passport number ada
				if (
					$body.find(
						'input[data-testid="flight.forms.i0.units.i0.passportNumber"]'
					).length > 0
				) {
					cy.get('input[data-testid="flight.forms.i0.units.i0.passportNumber"]')
						.type(passengerData.passport)
						.invoke("val")
						.then((val) => {
							// simpan sebagai alias di luar chaining
							Cypress.env("passengerPassport", val);
						});

					cy.get(
						'[data-testid="flight.forms.i0.units.i0.passportCountryOfIssue"]'
					).click();
					cy.get("li").contains(passengerData.region_issue).click();
					cy.get(
						'[datatestid="flight.forms.i0.units.i0.passportExpiryDate-DateInputDataTestId"]'
					).type(passengerData.day_expire);
					// Klik dropdown bulan
					cy.get(
						'[data-testid="flight.forms.i0.units.i0.passportExpiryDate-MonthInputDataTestId"] button'
					).click();

					// Pilih bulan july
					cy.get("li").contains(passengerData.month_expire).click();
					cy.get(
						'[data-testid="flight.forms.i0.units.i0.passportExpiryDate-YearInputDataTestId"]'
					).type(passengerData.year_expire);
				} else {
					cy.log("Passport number field not present – skipping");
				}
			});
		});
	}

	payment() {
		cy.get('[data-component="flight-continue-to-addOns-button"]')
			.should('be.visible')
			.click({ force: true });

		cy.get('[data-testid="continue-to-payment-button"]').click();
		cy.get("body").then(($body) => {
			if (
				$body.find("[data-component='last-chance-accept-button']").length >
				0
			) {
				cy.get("[data-component='last-chance-accept-button']")
					.should("be.visible")
					.click();
			} else {
				cy.log("The pop up is not present – skipping");
			}
		});
	}

	details() {
		cy.get('[data-component="mob-flight-slice-toggle-button"]').click()

		//price
		cy.get("@selectedPrice").then((selectedPrice) => {
			cy.get('[data-component="mob-flight-price-total-desc"]')
				.invoke("text")
				.should("include", selectedPrice);
		});

		//passenger details
		cy.get("@fullName").then((fullName) => {
			cy.get('[data-component="name-container-name"]')
				.invoke("text")
				.should("include", fullName);
		});

		//passport
		cy.get("body").then(($body) => {
			if ($body.find('[data-testid="review-passport-number"]').length > 0) {
				const storedPassport = Cypress.env("passengerPassport");
				cy.get('[data-testid="review-passport-number"]')
					.invoke("text")
					.should("include", storedPassport);
			} else {
				cy.log("Passport number tidak muncul di review page – skip check");
			}
		});

		//arrival time
		cy.get('@departureTime').then((departureTime) => {
			cy.get('[data-component="mob-flight-segment-departure"]').should('contain', departureTime);
		});

		cy.get('@arrivalTime').then((arrivalTime) => {
			cy.get('[data-component="mob-flight-segment-arrival"]').should('contain', arrivalTime);
		});

	}
}

module.exports = new AgodaPage();