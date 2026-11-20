import { test, expect } from '@playwright/test';
import {
  modalPortal,
  openWithOrderMock,
  addAuthTokens,
  bun,
  orderNumber,
  addBtnFor,
  ingridient,
  ingridientNumberTwo,
  constructorArea,
} from './helpers';

test.describe('Модальное окно заказа', () => {
  test.beforeEach(async ({ page }) => {
    await addAuthTokens(page);
    await openWithOrderMock(page);
    await addBtnFor(page, bun).click();
    await addBtnFor(page, ingridient).click();
    await addBtnFor(page, ingridientNumberTwo).click();
  });

  test('бургер собирается: булка и начинка попадают в конструктор', async ({ page }) => {
    await expect(constructorArea(page).getByText(bun)).toHaveCount(2);
    await expect(constructorArea(page).getByText(ingridient).first()).toBeVisible();
    await expect(
      constructorArea(page).getByText(ingridientNumberTwo).first()
    ).toBeVisible();
  });

  test('клик по «Оформить заказ» открывает модальное окно', async ({ page }) => {
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(modalPortal(page).getByText(String(orderNumber))).toBeVisible();
  });

  test('номер заказа верный — совпадает с ответом из HAR', async ({ page }) => {
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(
      modalPortal(page).getByText(String(orderNumber), { exact: true })
    ).toBeVisible();
  });

  test('после оформления заказа конструктор пустеет', async ({ page }) => {
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(modalPortal(page).getByText(String(orderNumber))).toBeVisible();
    await expect(constructorArea(page).getByText(bun, { exact: true })).toHaveCount(0);
    await expect(
      constructorArea(page).getByText(ingridient, { exact: true })
    ).toHaveCount(0);
    await expect(
      constructorArea(page).getByText(ingridientNumberTwo, { exact: true })
    ).toHaveCount(0);
  });

  test('модальное окно закрывается по крестику', async ({ page }) => {
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(modalPortal(page).getByText(String(orderNumber))).toBeVisible();
    await modalPortal(page).getByRole('button', { name: 'Закрыть' }).click();
    await expect(modalPortal(page).getByText(String(orderNumber))).toBeHidden();
  });
});
