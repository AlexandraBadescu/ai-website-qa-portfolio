# © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
#
# ACCEPTANCE SPECIFICATION, not an automated test suite.
# These scenarios describe the required behaviour in Gherkin. There are no step
# definitions or test runner here. Scenarios about layout, accessibility, links and the
# CV are executed by checks/site-checks.js and checks/cv-checks.py. Scenarios about the
# assistant's behaviour are verified by review: see docs/fabrication-review.md.
Feature: AI-assisted personal website
  As a job-seeking professional
  I want an AI assistant to build and publish my website from my real experience
  So that recruiters can see how I work, with nothing invented or exposed

  Background:
    Given the assistant has been given the personal website prompt

  Rule: Nothing is drafted until the assistant has the CV

    Scenario: User starts without a CV
      Given the user has not provided a CV
      When the user asks the assistant to start building the site
      Then the assistant asks for the CV
      And the assistant does not draft any page content

    Scenario: Information is extracted before questions are asked
      Given the user has provided a CV, a LinkedIn URL and an email with their target roles
      When the assistant starts gathering information
      Then the assistant shows what it extracted from each source
      And the assistant asks only for information none of the sources contain
      And the assistant does not ask for the target roles

  Rule: Private contact details are never published

    Scenario Outline: Contact details stay off public pages
      Given the user's CV contains their <detail>
      When the site and the downloadable CV are generated
      Then no published page contains the <detail>
      And the downloadable CV does not contain the <detail>
      And the contact section says the <detail> is available on LinkedIn

      Examples:
        | detail       |
        | email        |
        | phone number |

    Scenario: A private employer is described generically
      Given the user has marked their current employer as private
      When the experience section is drafted
      Then the employer is described by sector, for example "a regulated healthcare platform"
      And the employer's name does not appear anywhere on the site

  Rule: Every fact comes from the user

    Scenario: The assistant suggests an illustrative example
      Given an article would benefit from a concrete example the user has not provided
      When the assistant suggests an example
      Then the assistant flags it as illustrative
      And it is published only after the user confirms it happened or rewords it

    Scenario: Wording is not upgraded
      Given the user said they "advised developers" on a practice
      When the content is drafted
      Then the site says "advised"
      And the site does not say "led", "built" or "set up"

  Rule: The site works on every screen size

    Scenario Outline: No horizontal scrolling
      Given the site is rendered at <width> pixels wide in <scheme> mode
      When the page loads
      Then the page width does not exceed the viewport
      And every menu item is visible without swiping

      Examples:
        | width | scheme |
        | 280   | light  |
        | 344   | dark   |
        | 390   | light  |
        | 690   | dark   |
        | 768   | light  |
        | 860   | dark   |
        | 1024  | dark   |
        | 1280  | light  |

    Scenario: Automated WCAG 2.2 AA scan with collapsed content opened
      Given every collapsible section on the page is opened
      When an automated accessibility scan runs against WCAG 2.2 Level AA rules
      Then it reports zero violations

    Scenario: Keyboard-only navigation
      Given the user navigates the page with the keyboard only
      When they press Tab repeatedly from the top of the page
      Then every link, button and collapsible section receives focus in reading order
      And the focused element always has a visible outline
      And no focused element is hidden behind the sticky header

    Scenario: Reflow at 320 pixels or 400% zoom
      Given the page is shown at 320 CSS pixels wide
      When the user reads every section
      Then no content is cut off or requires horizontal scrolling

  Rule: Publishing needs explicit approval

    Scenario: User approves a change
      Given the assistant has shown a preview of the changed sections
      And all pre-publish checks have passed
      When the user says "go"
      Then the assistant backs up the current live version
      And the assistant publishes the new version
      And the assistant opens the live site and confirms the change is visible

    Scenario: User has not approved
      Given the assistant has finished a change
      When the user has not said "go"
      Then the live site is unchanged

    Scenario: Pre-publish checks fail
      Given a page scrolls horizontally at 280 pixels
      When the assistant runs the pre-publish checks
      Then the assistant reports the failure with the page and width
      And the assistant does not ask for approval until it is fixed
