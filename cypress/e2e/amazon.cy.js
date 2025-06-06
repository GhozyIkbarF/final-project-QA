import AmazonPage from "../support/pages/amazonPage";

let itemName = "";
let itemPrice = "";

describe("Amazon Search Test", () => {
	it("Search and verify item on Amazon", () => {
		AmazonPage.visitAmazon();
		AmazonPage.searchItem(Cypress.env("SEARCH_QUERY"));
		AmazonPage.sortByHighToLow();
		cy.wait(3000);
		AmazonPage.getItem().eq(4).should("be.visible").scrollIntoView().as("selectedItem");
		AmazonPage.getItemName("@selectedItem")
			.invoke("text")
			.then((productName) => {
				cy.log("Product Name:", productName.trim());
				itemName = productName.trim();
			});
		AmazonPage.getItemPrice("@selectedItem")
			.invoke("text")
			.then((productName) => {
				cy.log("Product Price:", productName.trim());
				itemPrice = productName.trim();
			});
		AmazonPage.clickItem("@selectedItem");
		AmazonPage.getDetailItemName().should("exist");
		AmazonPage.getDetailItemName()
			.invoke("text")
			.should("include", itemName.substring(0, 10));
		AmazonPage.getDetailItemPrice()
			.invoke("text")
			.should("include", itemPrice);
	});
});