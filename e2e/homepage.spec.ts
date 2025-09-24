import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se o título da página está correto
    await expect(page).toHaveTitle(/PosiMarket/)
    
    // Verificar se os elementos principais estão presentes
    await expect(page.locator('text=PosiMarket')).toBeVisible()
    await expect(page.locator('text=Marketplace Educacional')).toBeVisible()
  })

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/')
    
    // Clicar no link de produtos
    await page.click('text=Produtos')
    
    // Verificar se foi redirecionado para a página de produtos
    await expect(page).toHaveURL(/.*produtos/)
    await expect(page.locator('text=Catálogo de Produtos')).toBeVisible()
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se a seção hero está visível
    await expect(page.locator('h1')).toContainText('PosiMarket')
    await expect(page.locator('text=Compre e venda produtos educacionais')).toBeVisible()
  })

  test('should display categories section', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se as categorias estão visíveis
    await expect(page.locator('text=Uniforme Escolar')).toBeVisible()
    await expect(page.locator('text=Material Escolar')).toBeVisible()
    await expect(page.locator('text=Kit Escolar')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Simular dispositivo móvel
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Verificar se o menu mobile está funcionando
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible()
  })
})

test.describe('Authentication', () => {
  test('should redirect to login when accessing protected routes', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Verificar se foi redirecionado para login
    await expect(page).toHaveURL(/.*login/)
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/login')
    
    // Verificar se os campos de login estão presentes
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})

test.describe('Products Page', () => {
  test('should display products grid', async ({ page }) => {
    await page.goto('/produtos')
    
    // Verificar se a página de produtos carregou
    await expect(page.locator('text=Catálogo de Produtos')).toBeVisible()
    
    // Verificar se os filtros estão presentes
    await expect(page.locator('text=Filtrar por categoria')).toBeVisible()
    await expect(page.locator('text=Ordenar por')).toBeVisible()
  })

  test('should filter products by category', async ({ page }) => {
    await page.goto('/produtos')
    
    // Selecionar categoria "Uniforme"
    await page.selectOption('select[name="categoria"]', 'UNIFORME')
    
    // Verificar se os produtos foram filtrados
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible()
  })

  test('should search products', async ({ page }) => {
    await page.goto('/produtos')
    
    // Digitar na busca
    await page.fill('input[placeholder*="buscar"]', 'uniforme')
    
    // Verificar se a busca funcionou
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible()
  })
})
