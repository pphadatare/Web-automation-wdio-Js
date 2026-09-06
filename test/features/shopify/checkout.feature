@shopify @e2e @checkout
Feature: Sauce Demo store checkout
  As a guest shopper
  I want to buy a product from the Sauce Demo store
  So that I can complete an end-to-end purchase

  Scenario: Guest adds a product and completes checkout
    Given I open the Sauce Demo store
    When I open the product catalog
    And I select the "Grey jacket" product
    And I add the product to the cart
    Then the header cart should show 1 item
    When I open the shopping cart
    Then the cart should contain "Grey jacket" with quantity 1 and total "£55.00"
    When I proceed to checkout
    And I fill guest shipping and test payment details
    And I place the order
    Then I should see the order confirmation
