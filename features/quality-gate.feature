# © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
#
# ACCEPTANCE SPECIFICATION for the quality gate's negative tests.
# Each row maps to a requirement in docs/quality-gate-requirements.md and a test case
# in tests/cases.json, which tests/run-tests.js executes (see docs/traceability.md).
Feature: A quality gate you can trust
  As the site owner
  I want the pre-publish checks to fail on every defect they claim to catch, for the right reason
  So that a green result means the site and CV are fit to publish

  Rule: A check that tests nothing must not pass

    Scenario Outline: Nothing to test
      Given the site checks are pointed at <situation>
      When the checks run
      Then they fail with "<failure>"
      And no page is reported as passed

      Examples:
        | requirement | situation                       | failure  |
        | NR-S01      | a folder that doesn't exist     | no-site  |
        | NR-S02      | a site with no index.html       | no-pages |

  Rule: Each defect is reported, and only that defect

    Scenario Outline: One known defect in an otherwise valid site
      Given a copy of the valid base site with one defect: <defect>
      When the site checks run at every width in light and dark mode
      Then they fail with exactly the failure type "<failure>"
      And they report no other failure types

      Examples:
        | requirement | defect                                              | failure              |
        | NR-S03      | a link to a missing anchor on the same page          | broken-link          |
        | NR-S04      | a link to a missing anchor on another page           | broken-link          |
        | NR-S05      | an extensionless link to a missing page              | broken-link          |
        | NR-S06      | a relative ../ link to a missing page                | broken-link          |
        | NR-S07      | a link to a missing PDF                              | broken-link          |
        | NR-S09      | content that overflows once a section is expanded    | overflow-expanded    |
        | NR-S11      | an image without alt text                            | wcag:image-alt       |
        | NR-S14      | no page language                                     | wcag:html-has-lang   |
        | NR-S15      | a link with no accessible name                       | wcag:link-name       |
        | NR-S16      | an image without alt text inside a collapsed section | wcag:image-alt       |
        | NR-S17      | touch targets smaller than 24 by 24 pixels           | wcag:target-size     |
        | NR-S18      | a JavaScript error on load                           | console-error        |

    Scenario Outline: A defect that only appears in some conditions
      Given a copy of the valid base site with one defect: <defect>
      When the site checks run at every width in light and dark mode
      Then they fail with exactly the failure type "<failure>"
      And the failure appears only <where>

      Examples:
        | requirement | defect                                   | failure             | where                         |
        | NR-S08      | a block wider than a phone               | overflow            | at 280, 344 and 390 pixels    |
        | NR-S10      | a layout that breaks only around 860px   | overflow            | at 860 pixels                 |
        | NR-S12      | low-contrast text in both schemes        | wcag:color-contrast | in light and dark mode        |
        | NR-S13      | low-contrast text only in dark mode      | wcag:color-contrast | in dark mode                  |
        | NR-S20      | a defect on a page reached only by a link | wcag:image-alt      | on that linked page           |

    Scenario: The test server stays inside the site folder
      Given a site folder with a neighbouring folder whose name starts the same way
      When files are requested with ../, URL-encoded ../ and malformed paths
      Then none of those requests is served
      And files inside the site folder are still served

  Rule: The CV check catches what it claims to catch

    Scenario Outline: One known problem in an otherwise valid CV
      Given a two-page public CV with one problem: <problem>
      When the CV checks run with <options>
      Then they fail with exactly the failure type "<failure>"

      Examples:
        | requirement | problem                                     | options             | failure    |
        | NR-C01      | the file doesn't exist                       | default settings    | not-found  |
        | NR-C02      | an email address                             | default settings    | email      |
        | NR-C03      | a UK mobile number                           | default settings    | phone      |
        | NR-C04      | an international landline number             | default settings    | phone      |
        | NR-C05      | three pages                                  | default settings    | page-count |
        | NR-C06      | one page                                     | default settings    | page-count |
        | NR-C07      | a second page holding only a footer          | default settings    | coverage   |
        | NR-C08      | a large blank gap on page 2                  | page fill turned off | gap        |
        | NR-C09      | text that is an image, with nothing to extract | page fill turned off | no-text    |
        | NR-C10      | contact details and a near-empty page        | contact allowed     | coverage   |

  Rule: The acceptance specifications themselves are checked

    Scenario: An invalid feature file
      Given a feature file with a line that isn't valid Gherkin
      When the specifications are validated
      Then validation fails with "invalid-spec"

  Rule: Valid input passes, so the gate isn't just failing everything

    Scenario Outline: Positive controls
      Given <input>
      When the relevant check runs
      Then it passes with no failures

      Examples:
        | control | input                                                           |
        | PC-01   | the valid base site                                             |
        | PC-02   | the fictional sample site                                       |
        | PC-03   | a page with external, mailto and tel links                      |
        | PC-04   | a valid two-page public CV                                      |
        | PC-05   | a CV with years, ranges, metrics and long reference numbers     |
        | PC-06   | an application CV with contact details, using --allow-contact   |
        | PC-07   | the project's own feature files                                 |
