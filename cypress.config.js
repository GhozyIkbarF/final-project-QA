const { defineConfig } = require("cypress");

module.exports = defineConfig({
	viewportWidth: 1920,
	viewportHeight: 1080,
	e2e: {
		env: {
			SEARCH_QUERY: "chair",
			YOUTUBE_URL: "https://www.youtube.com/",
			AMAZON_URL: "https://www.amazon.com/",
			AGODA_URL: "https://www.agoda.com/",
		},
		setupNodeEvents(on, config) {
			require("cypress-mochawesome-reporter/plugin")(on);
		},
		specPattern: "cypress/e2e/*.cy.js",
		supportFile: "cypress/support/e2e.js",
		video: true,
	},
	reporter: "cypress-mochawesome-reporter",
	reporterOptions: {
		reportDir: "cypress/reports",
		overwrite: false,
		html: true,
		json: false,
	},
});