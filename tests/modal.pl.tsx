import { test, expect } from '@playwright/test';
import {
  overlay,
  modalPortal,
  constructorArea,
  openWithMock,
  ingridient,
} from './helpers';

test.describe('модальные окна', () => {
  test('модальное окно открывается поверх конструктора', async ({ page }) => {
    await openWithMock(page);
    const modal = modalPortal(page);
    await page.getByText(ingridient).first().click();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByText(ingridient).first()).toBeVisible();
    await expect(constructorArea(page)).toBeVisible();
    await expect(page).toHaveURL(/\/ingredients\//);
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    await openWithMock(page);
    const modal = modalPortal(page);
    await page.getByText(ingridient).first().click();
    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeHidden();
    await expect(constructorArea(page)).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    await openWithMock(page);
    const modal = modalPortal(page);
    await page.getByText(ingridient).first().click();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await overlay(page).click({ position: { x: 10, y: 10 } });
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeHidden();
    await expect(constructorArea(page)).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });
});
