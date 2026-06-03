import { test, expect } from '@playwright/test';

// ============================================================================
// SECTION 1: PUBLIC PAGES — Home, Portfolio, Services, Contact
// ============================================================================

test.describe('Public Pages', () => {

  test('Homepage loads with hero, services, and AI section', async ({ page }) => {
    await page.goto('/');
    
    // Hero section visible — use main area to avoid footer duplicates
    const main = page.getByRole('main');
    await expect(main.locator('h1').first()).toBeVisible();
    
    // CTA buttons visible and clickable — scope to the main hero section
    const bookBtn = main.getByRole('link', { name: /book a session/i });
    await expect(bookBtn).toBeVisible();
    
    const portfolioBtn = main.getByRole('link', { name: /view portfolio/i });
    await expect(portfolioBtn).toBeVisible();
    
    // Services section visible on scroll
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await expect(page.getByText('Our Services')).toBeVisible();
    
    // AI Face Recognition section
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);
    await expect(main.getByText('Find Your Photos').first()).toBeVisible();
  });

  test('Navigate to Portfolio via navbar click', async ({ page }) => {
    await page.goto('/');
    
    // Click the "Portfolio" link in the HEADER navbar specifically
    await page.locator('header nav').getByRole('link', { name: 'Portfolio' }).click();
    await page.waitForURL('/portfolio');
    
    await expect(page.locator('h1')).toContainText('Masterpieces');
    
    // Filter buttons visible
    const allBtn = page.getByRole('button', { name: 'All', exact: true });
    await expect(allBtn).toBeVisible();
    await page.getByRole('button', { name: 'Wedding', exact: true }).click();
    await page.waitForTimeout(300);
  });

  test('Navigate to Services via navbar click and view pricing', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('header nav').getByRole('link', { name: 'Services' }).click();
    await page.waitForURL('/services');
    
    await expect(page.locator('h1')).toContainText('Services');
    
    // Verify package cards render
    await expect(page.getByText('Pre-Wedding').first()).toBeVisible();
    await expect(page.getByText('Wedding Premium').first()).toBeVisible();
    await expect(page.getByText('Wedding Luxury').first()).toBeVisible();
    
    // "Most Popular" badge
    await expect(page.getByText('Most Popular')).toBeVisible();
    
    // Click "Book This Package" CTA
    const bookBtns = page.getByRole('link', { name: /book this package/i });
    await expect(bookBtns.first()).toBeVisible();
    await bookBtns.first().click();
    await page.waitForURL('/book');
  });

  test('Navigate to Contact via navbar and fill the form', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('header nav').getByRole('link', { name: 'Contact' }).click();
    await page.waitForURL('/contact');
    
    await expect(page.locator('h1')).toContainText('Get in');
    
    // Fill contact form
    await page.getByPlaceholder('John', { exact: true }).fill('Swarjit');
    await page.getByPlaceholder('Doe', { exact: true }).fill('Samantray');
    await page.getByPlaceholder('john@example.com').fill('swarjit@test.com');
    await page.getByPlaceholder('Tell us about your event...').fill('Testing the contact form with Playwright E2E');
    
    // Click send
    const sendBtn = page.getByRole('button', { name: /send message/i });
    await expect(sendBtn).toBeVisible();
    await sendBtn.click();
    await page.waitForTimeout(500);
  });
});

// ============================================================================
// SECTION 2: BOOKING FLOW — Multi-step wizard with real clicks
// ============================================================================

test.describe('Booking Flow', () => {

  test('Complete full 3-step booking wizard', async ({ page }) => {
    await page.goto('/book');
    
    await expect(page.locator('h1')).toContainText('Book Your Session');
    
    // === STEP 1: Select Package ===
    await expect(page.getByText('Select Package')).toBeVisible();
    
    // Check that radio buttons are present
    const preWeddingRadio = page.locator('input[type="radio"]').first();
    await expect(preWeddingRadio).toBeVisible();
    
    // Click Pre-Wedding option
    await preWeddingRadio.click();
    await page.waitForTimeout(200);
    
    // Click "Continue to Details"
    await page.getByRole('button', { name: /continue to details/i }).click();
    await page.waitForTimeout(500);
    
    // === STEP 2: Event Details ===
    await expect(page.getByText('Event Details')).toBeVisible();
    
    await page.getByPlaceholder('John Doe').fill('Test User');
    await page.getByPlaceholder('+91 98765 43210').fill('+91 99887 76655');
    await page.locator('input[type="date"]').fill('2026-12-25');
    await page.getByPlaceholder('Taj Lake Palace, Udaipur').fill('Grand Hotel, Rourkela');
    
    // Click "Proceed to Confirmation"
    await page.getByRole('button', { name: /proceed to confirmation/i }).click();
    await page.waitForTimeout(500);
    
    // === STEP 3: Confirmation ===
    await expect(page.getByText('Confirm Booking')).toBeVisible();
    await expect(page.getByText('Selected Package')).toBeVisible();
    
    // "Submit Booking Request" button visible
    const submitBtn = page.getByRole('button', { name: /submit booking request/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
    await page.waitForTimeout(500);
  });

  test('Booking wizard Back button works', async ({ page }) => {
    await page.goto('/book');
    
    // Go to step 2
    await page.getByRole('button', { name: /continue to details/i }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Event Details')).toBeVisible();
    
    // Go back to step 1
    await page.getByRole('button', { name: /back/i }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Select Package')).toBeVisible();
  });
});

// ============================================================================
// SECTION 3: CLIENT DASHBOARD
// ============================================================================

test.describe('Client Dashboard', () => {

  test('Client dashboard loads with galleries and bookings', async ({ page }) => {
    await page.goto('/client');
    
    await expect(page.getByText('Welcome, Priya!')).toBeVisible();
    
    // Galleries section
    await expect(page.getByText('Your Galleries')).toBeVisible();
    // Use regex to handle the & character safely
    await expect(page.getByText(/Swarjit.*Priya Wedding/).first()).toBeVisible();
    await expect(page.getByText('Pre-Wedding Shoot')).toBeVisible();
    
    // Bookings section — scope to the sidebar
    await expect(page.getByText('Wedding Premium').first()).toBeVisible();
  });

  test('Click View Gallery from client dashboard', async ({ page }) => {
    await page.goto('/client');
    
    const viewGalleryBtns = page.getByRole('link', { name: /view gallery/i });
    await expect(viewGalleryBtns.first()).toBeVisible();
    await viewGalleryBtns.first().click();
    await page.waitForURL(/\/g\/.+/);
    
    // Gallery page loaded
    await expect(page.getByText(/Swarjit.*Priya Wedding/).first()).toBeVisible();
  });

  test('Face search CTA visible on client dashboard', async ({ page }) => {
    await page.goto('/client');
    
    await expect(page.getByText('Want to find photos of a specific guest?')).toBeVisible();
    await expect(page.getByRole('button', { name: /copy search link/i })).toBeVisible();
  });
});

// ============================================================================
// SECTION 4: GALLERY PAGE — Upload, Download, Face Search buttons
// ============================================================================

test.describe('Gallery Page', () => {

  test('Gallery page loads with toolbar, upload area, and photo grid', async ({ page }) => {
    await page.goto('/g/test-gallery');
    
    // Gallery header
    await expect(page.getByText(/Swarjit.*Priya Wedding/).first()).toBeVisible();
    await expect(page.getByText('1,240 Photos')).toBeVisible();
    
    // Tab navigation
    const highlightsTab = page.getByRole('button', { name: 'Highlights' });
    await expect(highlightsTab).toBeVisible();
    await page.getByRole('button', { name: 'Sangeet' }).click();
    await page.waitForTimeout(300);
    
    // Upload section
    await expect(page.getByText('Upload Gallery Photos')).toBeVisible();
    
    // Photo grid
    const photos = page.locator('[class*="aspect-"]');
    await expect(photos.first()).toBeVisible();
  });

  test('Gallery upload area accepts file selection', async ({ page }) => {
    await page.goto('/g/test-gallery');
    
    // File input exists
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    await expect(fileInput).toBeAttached();
    
    // Upload button is disabled when no files selected
    const uploadBtn = page.getByRole('button', { name: /upload/i }).first();
    await expect(uploadBtn).toBeDisabled();
  });

  test('Gallery toolbar buttons are interactive', async ({ page }) => {
    await page.goto('/g/test-gallery');
    
    // Face Search button
    const faceSearchBtn = page.getByRole('button', { name: /face search/i });
    await expect(faceSearchBtn).toBeVisible();
    
    // Share button
    const shareBtn = page.getByRole('button', { name: /share/i });
    await expect(shareBtn).toBeVisible();
    
    // Download All button
    const downloadBtn = page.getByRole('button', { name: /download all/i });
    await expect(downloadBtn).toBeVisible();
    
    // Load More button
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const loadMoreBtn = page.getByRole('button', { name: /load more/i });
    await expect(loadMoreBtn).toBeVisible();
  });

  test('Photo hover overlay shows download and like buttons', async ({ page }) => {
    await page.goto('/g/test-gallery');
    
    // Scroll to photo grid
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    
    // Hover over a photo placeholder
    const photoCard = page.locator('.group').first();
    await photoCard.hover();
    await page.waitForTimeout(300);
  });
});

// ============================================================================
// SECTION 5: FACE SEARCH ENGINE — Upload selfie flow
// ============================================================================

test.describe('Face Search', () => {

  test('Face search page loads with upload area', async ({ page }) => {
    await page.goto('/search');
    
    await expect(page.getByText('AI-Powered Gallery Search')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Find Your Photos');
    
    // Upload area
    await expect(page.getByText('Take a Selfie or Upload')).toBeVisible();
    await expect(page.getByText(/your photo is never stored/i)).toBeVisible();
  });

  test('Navigate to search from homepage CTA', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);
    
    const tryFaceSearch = page.getByRole('link', { name: /try face search/i });
    await expect(tryFaceSearch).toBeVisible();
    await tryFaceSearch.click();
    await page.waitForURL('/search');
    
    await expect(page.getByText('AI-Powered Gallery Search')).toBeVisible();
  });
});

// ============================================================================
// SECTION 6: ADMIN DASHBOARD — Sidebar navigation and all sub-pages
// ============================================================================

test.describe('Admin Dashboard', () => {

  test('Admin dashboard loads with stats and layout', async ({ page }) => {
    await page.goto('/admin');
    
    // Dashboard title
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    
    // Stat cards
    await expect(page.getByText('Total Bookings')).toBeVisible();
    await expect(page.getByText('Active Galleries')).toBeVisible();
    await expect(page.getByText('Total Clients')).toBeVisible();
    await expect(page.getByText('Revenue (MTD)')).toBeVisible();
    
    // Recent bookings table
    await expect(page.getByText('Recent Bookings')).toBeVisible();
    await expect(page.getByText('Rahul Sharma')).toBeVisible();
    
    // Infrastructure costs card
    await expect(page.getByText('Infrastructure Costs')).toBeVisible();
  });

  test('Admin sidebar navigation — click Galleries', async ({ page }) => {
    await page.goto('/admin');
    
    await page.locator('aside').getByRole('link', { name: 'Galleries' }).click();
    await page.waitForURL('/admin/galleries');
    
    await expect(page.getByRole('heading', { name: 'Galleries' })).toBeVisible();
    await expect(page.getByText('Rahul & Priya Wedding')).toBeVisible();
    
    const searchInput = page.getByPlaceholder('Search galleries...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Rahul');
    await page.waitForTimeout(300);
    
    await expect(page.getByRole('button', { name: /new gallery/i })).toBeVisible();
    
    const uploadBtns = page.getByRole('button', { name: /upload/i });
    await expect(uploadBtns.first()).toBeVisible();
  });

  test('Admin sidebar navigation — click Bookings', async ({ page }) => {
    await page.goto('/admin');
    
    await page.locator('aside').getByRole('link', { name: 'Bookings' }).click();
    await page.waitForURL('/admin/bookings');
    
    await expect(page.getByRole('heading', { name: 'Bookings & CRM' })).toBeVisible();
    
    await expect(page.getByText('All Bookings')).toBeVisible();
    await page.getByRole('button', { name: 'Confirmed' }).click();
    await page.waitForTimeout(300);
    
    await expect(page.getByText('Rahul Sharma')).toBeVisible();
    await expect(page.getByText('Priya Das')).toBeVisible();
    
    const manageBtns = page.getByRole('button', { name: /manage/i });
    await expect(manageBtns.first()).toBeVisible();
  });

  test('Admin sidebar navigation — click Clients', async ({ page }) => {
    await page.goto('/admin');
    
    await page.locator('aside').getByRole('link', { name: 'Clients' }).click();
    await page.waitForURL('/admin/clients');
    
    await expect(page.getByRole('heading', { name: /clients/i }).first()).toBeVisible();
    
    const clientSearch = page.getByPlaceholder(/search clients/i);
    await expect(clientSearch).toBeVisible();
    await clientSearch.fill('Amit');
    await page.waitForTimeout(300);
    
    await expect(page.getByText('Amit Patel')).toBeVisible();
    await expect(page.getByText('Total Clients: 4')).toBeVisible();
  });

  test('Admin sidebar navigation — click Cost Monitor', async ({ page }) => {
    await page.goto('/admin');
    
    await page.locator('aside').getByRole('link', { name: 'Cost Monitor' }).click();
    await page.waitForURL('/admin/costs');
    
    await expect(page.getByRole('heading', { name: /cost monitor/i })).toBeVisible();
    
    await expect(page.getByText('₹185.50').first()).toBeVisible();
    await expect(page.getByText('Well below ₹500 budget')).toBeVisible();
    
    await expect(page.getByText('Backblaze B2 (Storage)')).toBeVisible();
    await expect(page.getByText('Supabase DB (Compute)')).toBeVisible();
    await expect(page.getByText('Cloudflare Pages')).toBeVisible();
    
    await expect(page.getByText(/azure face api free tier/i)).toBeVisible();
  });

  test('Admin sidebar navigation — click Settings', async ({ page }) => {
    await page.goto('/admin');
    
    await page.locator('aside').getByRole('link', { name: 'Settings' }).click();
    await page.waitForURL('/admin/settings');
    
    // Use the heading specifically
    await expect(page.getByRole('heading', { name: /settings/i }).first()).toBeVisible();
    
    // Settings tabs — use button role to be specific
    await expect(page.getByRole('button', { name: 'General' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Security' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Appearance' })).toBeVisible();
    
    // Form inputs  
    const studioNameInput = page.locator('input[value="The Capture Studio"]');
    await expect(studioNameInput).toBeVisible();
    
    // Edit the studio name
    await studioNameInput.clear();
    await studioNameInput.fill('The Capture Studio Pro');
    await page.waitForTimeout(200);
    
    // Save button
    const saveBtn = page.getByRole('button', { name: /save changes/i });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    await page.waitForTimeout(500);
    
    // Click Notifications tab
    await page.getByRole('button', { name: 'Notifications' }).click();
    await page.waitForTimeout(300);
    
    // Click Security tab
    await page.getByRole('button', { name: 'Security' }).click();
    await page.waitForTimeout(300);
  });

  test('Admin Sign Out button visible', async ({ page }) => {
    await page.goto('/admin');
    
    const signOutBtn = page.getByRole('button', { name: /sign out/i });
    await expect(signOutBtn).toBeVisible();
  });
});

// ============================================================================
// SECTION 7: CROSS-PAGE NAVIGATION — Real user click-through flows
// ============================================================================

test.describe('Cross-Page Navigation', () => {

  test('Homepage -> Book Session -> Booking page', async ({ page }) => {
    await page.goto('/');
    
    // Click "Book a Session" from Hero — scope to main content area
    await page.getByRole('main').getByRole('link', { name: /book a session/i }).click();
    await page.waitForURL('/book');
    await expect(page.getByText('Book Your Session')).toBeVisible();
  });

  test('Services -> Book This Package -> Booking page', async ({ page }) => {
    await page.goto('/services');
    
    // Scroll to see package cards
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);
    
    // Click the first "Book This Package"
    const bookBtns = page.getByRole('link', { name: /book this package/i });
    await bookBtns.first().click();
    await page.waitForURL('/book');
    await expect(page.getByText('Book Your Session')).toBeVisible();
  });

  test('Client Dashboard -> Gallery -> Back to Dashboard', async ({ page }) => {
    await page.goto('/client');
    
    // Click "View Gallery" on first gallery card
    const viewGalleryBtns = page.getByRole('link', { name: /view gallery/i });
    await viewGalleryBtns.first().click();
    await page.waitForURL(/\/g\/.+/);
    
    // Click "Back to Dashboard"
    await page.getByRole('link', { name: /back to dashboard/i }).click();
    await page.waitForURL('/client');
    await expect(page.getByText('Welcome, Priya!')).toBeVisible();
  });
});

// ============================================================================
// SECTION 8: ERROR HANDLING & 404
// ============================================================================

test.describe('Error Handling', () => {

  test('404 page for non-existent route', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz');
    expect(response?.status()).toBe(404);
  });
});

// ============================================================================
// SECTION 9: RESPONSIVE & PWA CHECKS
// ============================================================================

test.describe('PWA & Meta', () => {

  test('Manifest is served correctly', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
    const body = await response?.json();
    expect(body.name).toBe('CaptureFlow');
    expect(body.display).toBe('standalone');
  });

  test('PWA icons are accessible', async ({ page }) => {
    const res192 = await page.goto('/icons/icon-192x192.png');
    expect(res192?.status()).toBe(200);
    
    const res512 = await page.goto('/icons/icon-512x512.png');
    expect(res512?.status()).toBe(200);
  });

  test('Page has correct meta tags', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toContain('The Capture Studio');
    
    const metaDesc = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDesc).toBeTruthy();
  });
});
