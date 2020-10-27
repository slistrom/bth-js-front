/**
 * Test for getting started with Selenium.
 */
"use strict";

const assert = require("assert");
const test = require("selenium-webdriver/testing");
const webdriver = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
const By = webdriver.By;

let browser;


function goToNavLink(target) {
    browser.findElement(By.linkText(target)).then(function(element) {
        element.click();
    });
}

function matchUrl(target) {
    browser.getCurrentUrl().then(function(url) {
        assert.ok(url.endsWith("/" + target));
    });
}

function assertH3(target) {
    browser.findElement(By.css("h3")).then(function(element) {
        element.getText().then(function(text) {
            assert.equal(text, target);
        });
    });
}

// Test suite
test.describe("Trading frontend", function() {
    this.timeout(0);

    beforeEach(function(done) {
        browser = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.firefox())
            .setFirefoxOptions(new firefox.Options().headless())
            .forBrowser('firefox')
            .build();

        browser.get("http://localhost:3000/");
        done();
    });

    afterEach(function(done) {
        browser.quit();
        done();
    });


    // Usecase 1
    test.it("Test index title", function(done) {
        browser.getTitle().then(function(title) {
            assert.equal(title, "One Place trading");
        });

        done();
    });


    // Usecase 2
    test.it("Test go to Trading", function(done) {
        // try use nav link
        goToNavLink("Trading");

        matchUrl("trading" );
        assertH3("Trading");

        done();
    });


    // Usecase 3
    test.it("Test go to Login", function(done) {
        goToNavLink("Login");

        matchUrl("login");
        assertH3("Login");

        done();
    });

    // Usecase 4
    test.it("Test footer background color", function(done) {
        browser.findElement(By.className("footer")).then(function(displayElement) {
            displayElement.getCssValue("background-color").then(function(bgColor) {
                assert.equal(bgColor, "rgb(253, 176, 64)");
            });
        });

        done();
    });

    // Usecase 5
    test.it("Test go to register page via login page", function(done) {
        goToNavLink("Login");
        goToNavLink("Register new user");

        matchUrl("register/");
        assertH3("User registration");

        done();
    });
});
