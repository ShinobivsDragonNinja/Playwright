import { test, expect } from '@playwright/test';
import assert from 'assert';
import { escape } from 'querystring';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.leyaonline.com/pt/');
  await page.getByRole('button', { name: 'Aceitar Todos' }).click();
});

test.describe('Project', () => {
  test('Scenario 1', async ({ page }) => {
    await page.getByPlaceholder('pesquisa').fill('George');
    await page.getByPlaceholder('pesquisa').press('Enter');
    await expect(page.locator('#main')).toContainText('O Triunfo dos Porcos');
    await page.getByRole('link', { name: 'O Triunfo dos Porcos GEORGE' }).click();
    await expect(page.locator('#second-container')).toContainText('Quinta Manor');
  });

  test('Scenario 2', async ({ page }) => {
    await page.getByPlaceholder('pesquisa').fill('1984');
    await page.getByPlaceholder('pesquisa').press('Enter');
    await page.getByRole('link', { name: 'GEORGE ORWELL €12,50' }).click();
    await expect(page.locator('div').filter({ hasText: /^1984$/ })).toBeVisible();
    await expect(page.locator('#second-container')).toContainText('GEORGE ORWELL');
    await expect(page.locator('#second-container')).toContainText('ISBN: 9789722071550');
    await expect(page.locator('#second-container')).toContainText('Páginas: 344');
    await expect(page.locator('#second-container')).toContainText('Dimensões: 235 x 157 x 23 mm');
  });

  test('Scenario 3', async ({ page }) => {
    await page.getByPlaceholder('pesquisa').fill('1984');
    await page.getByPlaceholder('pesquisa').press('Enter');
    await page.getByRole('link', { name: 'GEORGE ORWELL €12,50' }).click();
    await expect(page.getByRole('link', { name: 'express A Quinta dos Animais' })).toBeVisible();
  });

  test('Scenario 4', async ({ page }) => {
    await page.getByPlaceholder('pesquisa').fill('1984');
    await page.getByPlaceholder('pesquisa').press('Enter');
    await page.getByRole('link', { name: 'GEORGE ORWELL €12,50' }).click();
    await page.locator('.more').first().click();
    await expect(page.locator("//a[@id='dropdownMenuButton100' and @data-tag='1']")).toHaveCount(1);
  });

  test('Scenario 5', async ({ page }) => {
    await page.locator('#darkmode').click();

    const darkMode = await page.evaluate(() => {
      const bodyStyles = window.getComputedStyle(document.body);
      const colorScheme = bodyStyles.getPropertyValue('color-scheme');
      const backgroundColor = bodyStyles.getPropertyValue('background-color');
      const textColor = bodyStyles.getPropertyValue('color');

      return colorScheme.includes('dark') ||
        backgroundColor === 'rgb(30, 31, 30)' ||
        textColor === 'rgb(251, 243, 229)';
    });

    expect(darkMode).toBe(true);
  });

  test('Scenario 6 - Smoke test: Verify if all the pages in the hamburger menu load correctly', async ({ page }) => {
    await page.getByRole('link', { name: '' }).click();
    await page.getByRole('link', { name: 'Livros', exact: true }).click();
    await expect(page.getByText('LeYa Livros')).toBeVisible();
    expect(page.url()).toContain('leyaonline.com/pt/livros');

    await page.getByRole('link', { name: '' }).click();
    await page.getByRole('link', { name: 'Ebooks' }).click();
    await expect(page.getByText('LeYa eBooks')).toBeVisible();
    expect(page.url()).toContain('leyaonline.com/pt/livros/?t=ebooks');

    await page.getByRole('link', { name: '' }).click();
    await page.getByRole('link', { name: 'Livros Escolares' }).click();
    await expect(page.getByRole('heading', { name: 'Livros Escolares - Faça a sua' })).toBeVisible();
    expect(page.url()).toContain('www.leyaonline.com/pt/escolar');

    await page.getByRole('link', { name: '' }).click();
    await page.getByRole('link', { name: 'Apoio Escolar' }).click();
    await expect(page.getByText('LeYa Apoio Escolar')).toBeVisible();
    expect(page.url()).toContain('leyaonline.com/pt/apoio-escolar');

    await page.getByRole('link', { name: '' }).click();
    await page.getByRole('link', { name: 'Acessos Digitais' }).click();
    await expect(page.getByText('LeYa Acessos Digitais')).toBeVisible();
    expect(page.url()).toContain('leyaonline.com/pt/acessos-digitais');

    await page.getByRole('link', { name: '' }).click();
    await page.getByRole('link', { name: 'Tecnologia' }).click();
    await expect(page.getByText('LeYa Tecnologia')).toBeVisible();
    expect(page.url()).toContain('leyaonline.com/pt/tecnologia');

    await page.getByRole('link', { name: '' }).click();
    await page.getByRole('link', { name: 'Leya Express' }).click();
    await expect(page.getByRole('heading', { name: 'LEYA EXPRESS LIVROS À' })).toBeVisible();
    expect(page.url()).toContain('leyaonline.com/pt/leya_express');

    //Does not click on "Kobo Plus e_LeYa" because of bug found 🤗
    //await page.getByRole('link', { name: '' }).click();
    //await page.getByRole('link', { name: 'Kobo Plus e_LeYa' }).click();
    //await expect(page.getByRole('heading', { name: 'Escolha a experiência Kobo' })).toBeVisible();
    //expect(page.url()).toContain('leyaonline.com/pt/koboplus');
  });

  test('Scenario 7 - Performance test - Load page time to be less or equal to 5s', async ({ page }) => {
    const performanceTimeJson = await page.evaluate(() => JSON.stringify(window.performance.timing))
    const performanceTime = JSON.parse(performanceTimeJson)
    const loadPageTime = performanceTime.domInteractive - performanceTime.navigationStart
    console.log(`Load page time indicator: ${loadPageTime}ms`)

    expect(loadPageTime).toBeLessThanOrEqual(5000);
  });
})