import { expect, test } from "@playwright/test";

import {
  openMobileNav,
  performSignIn,
  waitForURLChange,
} from "./playwrightUtils";

test.afterEach(async ({ context }) => {
  await context.close();
});

test("shows unauthenticated state if not logged in", async ({ page }) => {
  await page.goto("/saved-opportunities");
  const h4 = page.locator(".usa-alert__body .usa-alert__heading");
  await expect(h4).toHaveText("Not signed in");
});

// reenable after https://github.com/HHS/simpler-grants-gov/issues/3791
test.skip("shows save / search cta if logged in", async ({ page }, {
  project,
}) => {
  await page.goto("http://localhost:3000/?_ff=authOn:true");
  await performSignIn(page, project);

  if (project.name.match(/[Mm]obile/)) {
    await openMobileNav(page);
  }
  const savedOpportunitiesNavItem = page.locator(".usa-nav li:nth-child(3)");
  await expect(savedOpportunitiesNavItem).toHaveText("Saved opportunities");
  await savedOpportunitiesNavItem.click();

  await waitForURLChange(page, (url) => !!url.match(/saved-opportunities/));
  await expect(page).toHaveTitle("Saved Opportunities | Simpler.Grants.gov");
});
