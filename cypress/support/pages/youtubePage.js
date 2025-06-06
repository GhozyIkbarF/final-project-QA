require("cypress-xpath");

class YouTubePage {
	visit() {
		cy.visit(Cypress.env("YOUTUBE_URL"));
	}

	clickMenuButton() {
		cy.get("#start #guide-button").click();
	}

	clickTrendingMenu() {
		cy.get("ytd-guide-entry-renderer")
			.contains("Trending")
			.scrollIntoView()
			.should("exist")
			.click({ force: true });
	}

	clickMoviesTab() {
		cy.get("yt-tab-shape", { timeout: 10000 })
			.contains("Movies")
			.click({ force: true });
	}

	getVideoByIndex(index) {
		return cy.get("ytd-video-renderer", { timeout: 10000 }).eq(index);
	}

	getVideoTitle(videoAlias) {
		return cy.get(videoAlias).find("#video-title");
	}

	getVideoChannel(videoAlias) {
		return cy.get(videoAlias).find("yt-formatted-string.ytd-channel-name");
	}

	clickVideoTitle(videoAlias) {
		cy.get(videoAlias).find("#video-title").click();
	}

	getPlayerTitle() {
		return cy.get("h1.title", { timeout: 10000 });
	}

	getPlayerChannel() {
		return cy.get("a.yt-simple-endpoint", { timeout: 10000 });
	}
}

export default new YouTubePage();