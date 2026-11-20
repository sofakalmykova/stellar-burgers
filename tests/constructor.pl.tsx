import { test, expect } from '@playwright/test';
import { constructorArea, openWithMock, addBtnFor, ingridient, bun } from './helpers';

test.describe('add ingredients to constructor works correctly', function () {
  test('ингредиенты загружаются из HAR-файла', async ({ page }) => {
    await openWithMock(page);
    await expect(page.getByText(ingridient).first()).toBeVisible();
  });

  test('должен работать без реального сервера', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
    });

    await page.goto('/');
    await expect(page.getByText(bun).first()).toBeVisible();
  });

  test('булка попадает в конструктор дважды (верх и низ)', async ({ page }) => {
    await openWithMock(page);
    await addBtnFor(page, bun).click();
    await expect(constructorArea(page).getByText(bun)).toHaveCount(2);
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    await openWithMock(page);
    await addBtnFor(page, ingridient).click();
    await expect(constructorArea(page).getByText(ingridient).first()).toBeVisible();
  });
});
