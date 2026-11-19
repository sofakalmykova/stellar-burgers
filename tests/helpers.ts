import { expect, type Page } from '@playwright/test';

export const ingridient: string = 'Биокотлета из марсианской Магнолии';
export const ingridientNumberTwo = 'Филе Люминесцентного тетраодонтимформа';
export const orderNumber = 1188;
export const bun = 'Флюоресцентная булка R2-D3';

export const openWithMock = async (page: any) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });
  await page.goto('/');
  await expect(page.getByText('Краторная булка N-200i').first()).toBeVisible();
};

export const openWithOrderMock = async (page: any) => {
  await page.routeFromHAR('tests/hars/order-api.har', {
    url: '**/api/**',
    update: false,
  });
  await page.goto('/');
  await expect(page.getByText(bun).first()).toBeVisible();
};

export const constructorArea = (page: Page) =>
  page.locator('[class*="burger_constructor"]').first();

export const addBtnFor = (page: Page, name: string) =>
  page
    .locator('li', { hasText: name })
    .first()
    .getByRole('button', { name: 'Добавить' });

export const overlay = (page: Page) => page.locator('[class*="overlay"]').first();

export const modalPortal = (page: Page) => page.locator('#modals');

export const addAuthTokens = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'mock-access-token',
      domain: 'localhost',
      path: '/',
    },
  ]);
};
