require("cypress-xpath");

class AmazonPage {
	visitAmazon() {
		cy.visit(Cypress.env("AMAZON_URL"));
	}

	searchItem(searchQuery) {
		cy.get("#twotabsearchtextbox", { timeout: 10000 })
			.should("be.visible")
			.type(`${searchQuery}{enter}`);
	}

	sortByHighToLow() {
		cy.get("span.a-dropdown-label").click();
		cy.xpath('//a[contains(text(), "Price: High to Low")]').click({
			force: true,
		});
	}

	getItem() {
		return cy
			.get('div[role="listitem"]')
			.not(':has([aria-label="Sponsored"])')
	}

	getItemName(itemAlias) {
		return cy.get(itemAlias).find('[data-cy="title-recipe"]')
	}

	getItemPrice(itemAlias) {
		return cy.get(itemAlias).find(".a-price-whole")
	}

	clickItem(itemAlias) {
		cy.get(itemAlias).find('[data-cy="title-recipe"]').click();
	}

	getDetailItemName() {
		return cy.get('span#productTitle', { timeout: 10000 });
	}

	getDetailItemPrice() {
		return cy.get("span.a-price-whole").first();
	}
}

export default new AmazonPage();