const { defineConfig } = require("cypress");
// require("dotenv").config();

module.exports = defineConfig({
	e2e: {
		env: {
			SEARCH_QUERY: "chair",
			YOUTUBE_URL: "https://www.youtube.com/",
			AMAZON_URL: "https://www.amazon.com/",
			AGODA_URL: "https://www.agoda.com/",
		},
		setupNodeEvents(on, config) {
		},
		specPattern: "cypress/e2e/*.cy.js",
		video: true,
		supportFile: "cypress/support/e2e.js",
	},
	viewportWidth: 1920,
	viewportHeight: 1080,
});