import YouTubePage from "../support/pages/youtubePage";

describe("YouTube Trending Movies Test", () => {
	it("Go to trending movies and validate third video", () => {
		YouTubePage.visit();
		YouTubePage.clickMenuButton();
		YouTubePage.clickTrendingMenu();
		YouTubePage.clickMoviesTab();
		YouTubePage.getVideoByIndex(2)
			.scrollIntoView()
			.should("be.visible")
			.as("thirdVideo");
		YouTubePage.getVideoTitle("@thirdVideo")
			.invoke("text")
			.then((titleVideo) => {
				YouTubePage.getVideoChannel("@thirdVideo")
					.invoke("text")
					.then((channelName) => {
						YouTubePage.clickVideoTitle("@thirdVideo");
						YouTubePage.getPlayerTitle().should("contain.text", titleVideo.trim());
						YouTubePage.getPlayerChannel().should(
							"contain.text",
							channelName.trim()
						);
					});
			});
	});
});