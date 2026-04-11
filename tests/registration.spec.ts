import { test, expect } from "@playwright/test";

test.describe("Event Registration Flow", () => {
  // Test data
  const testEmail = `test-${Date.now()}@example.com`;
  const testOtp = "132312";
  const testData = {
    name: "John Doe",
    phone_number: "+94 77 123 4567",
    id_number: "123456789V",
    profession: "Working professional",
    designation: "Software Engineer",
    organization: "Tech Company",
    food_preference: "non-veg",
    linkedin_url: "https://linkedin.com/in/johndoe",
    expectations: "I hope to learn about Azure cloud services and network with professionals in the industry.",
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to registration page
    await page.goto("/event-registration");
    // Wait for page to load
    await page.waitForLoadState("networkidle");
  });

  test("should complete full registration flow with OTP verification", async ({ page }) => {
    // ===== STEP 1: Email Submission =====
    // Find and fill email input
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(testEmail);
    
    // Click Send OTP button
    const sendOtpButton = page.locator('button:has-text("Send OTP")');
    await sendOtpButton.click();
    
    // Wait for success message
    const successMessage = page.locator('text="OTP sent to your email!"');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    
    // Verify Step 1 is hidden and Step 2 is visible
    await expect(page.locator('text="Verify your email"')).toBeVisible({ timeout: 5000 });
    
    // ===== STEP 2: OTP Verification =====
    // Fill OTP input with test OTP
    const otpInput = page.locator('input[type="text"][maxlength="6"]');
    await otpInput.fill(testOtp);
    
    // Click Verify OTP button
    const verifyOtpButton = page.locator('button:has-text("Verify OTP")');
    await verifyOtpButton.click();
    
    // Wait for success message
    const emailVerifiedMessage = page.locator('text="Email verified!"');
    await expect(emailVerifiedMessage).toBeVisible({ timeout: 10000 });
    
    // Verify Step 2 is hidden and Step 3 is visible
    await expect(page.locator('text="Complete your profile"')).toBeVisible({ timeout: 5000 });
    
    // ===== STEP 3: Registration Details =====
    // Fill Full Name
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill(testData.name);
    
    // Fill Phone Number
    const phoneInput = page.locator('input[name="phone_number"]');
    await phoneInput.fill(testData.phone_number);
    
    // Fill ID / NIC Number
    const idInput = page.locator('input[name="id_number"]');
    await idInput.fill(testData.id_number);
    
    // Select Profession (Working professional)
    const professionSelect = page.locator('select[name="profession"]');
    await professionSelect.selectOption(testData.profession);
    
    // Fill Designation (appears only for Working professional)
    const designationInput = page.locator('input[name="designation"]');
    await expect(designationInput).toBeVisible({ timeout: 3000 });
    await designationInput.fill(testData.designation);
    
    // Fill Organization
    const organizationInput = page.locator('input[name="organization"]');
    await organizationInput.fill(testData.organization);
    
    // Select Food Preference
    const foodPreferenceSelect = page.locator('select[name="food_preference"]');
    await foodPreferenceSelect.selectOption(testData.food_preference);
    
    // Fill LinkedIn URL
    const linkedinInput = page.locator('input[name="linkedin_url"]');
    await linkedinInput.fill(testData.linkedin_url);
    
    // Fill Expectations
    const expectationsTextarea = page.locator('textarea[name="expectations"]');
    await expectationsTextarea.fill(testData.expectations);
    
    // ===== STEP 4: Submit Registration =====
    // Click Submit Registration button
    const submitButton = page.locator('button:has-text("Submit Registration")');
    await submitButton.click();
    
    // Wait for registration success
    const registrationCompleteMessage = page.locator('text="Registration Complete"');
    await expect(registrationCompleteMessage).toBeVisible({ timeout: 15000 });
    
    // Verify success message appears
    const thankYouMessage = page.locator('text="Thank you for your submission"');
    await expect(thankYouMessage).toBeVisible();
  });

  test("should show error for invalid OTP", async ({ page }) => {
    // Step 1: Send OTP
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(testEmail);
    
    const sendOtpButton = page.locator('button:has-text("Send OTP")');
    await sendOtpButton.click();
    
    // Wait for Step 1 to complete
    await expect(page.locator('text="Verify your email"')).toBeVisible({ timeout: 5000 });
    
    // Step 2: Try invalid OTP
    const otpInput = page.locator('input[type="text"][maxlength="6"]');
    await otpInput.fill("999999");
    
    const verifyOtpButton = page.locator('button:has-text("Verify OTP")');
    await verifyOtpButton.click();
    
    // Wait for error message
    const errorMessage = page.locator('text="Invalid OTP"');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    
    // Verify we're still on Step 2
    await expect(page.locator('text="Verify your email"')).toBeVisible();
  });

  test("should allow resending OTP", async ({ page }) => {
    // Step 1: Send OTP
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(testEmail);
    
    const sendOtpButton = page.locator('button:has-text("Send OTP")');
    await sendOtpButton.click();
    
    // Wait for Step 1 to complete
    await expect(page.locator('text="Verify your email"')).toBeVisible({ timeout: 5000 });
    
    // Click Resend OTP button
    const resendOtpButton = page.locator('button:has-text("Resend OTP")');
    await resendOtpButton.click();
    
    // Wait for resend confirmation
    const resendMessage = page.locator('text="OTP resent!"');
    await expect(resendMessage).toBeVisible({ timeout: 10000 });
  });

  test("should validate required fields in registration details", async ({ page }) => {
    // Complete Steps 1 and 2 quickly by using intercepts to simulate
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(testEmail);
    
    const sendOtpButton = page.locator('button:has-text("Send OTP")');
    await sendOtpButton.click();
    
    await expect(page.locator('text="Verify your email"')).toBeVisible({ timeout: 5000 });
    
    const otpInput = page.locator('input[type="text"][maxlength="6"]');
    await otpInput.fill(testOtp);
    
    const verifyOtpButton = page.locator('button:has-text("Verify OTP")');
    await verifyOtpButton.click();
    
    await expect(page.locator('text="Complete your profile"')).toBeVisible({ timeout: 5000 });
    
    // Try to submit without filling required fields
    const submitButton = page.locator('button:has-text("Submit Registration")');
    await submitButton.click();
    
    // Should show validation error for Name
    const nameRequiredError = page.locator('text="Name is required"');
    await expect(nameRequiredError).toBeVisible({ timeout: 5000 });
  });

  test("should validate phone number format", async ({ page }) => {
    // Complete Steps 1 and 2
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(testEmail);
    
    const sendOtpButton = page.locator('button:has-text("Send OTP")');
    await sendOtpButton.click();
    
    await expect(page.locator('text="Verify your email"')).toBeVisible({ timeout: 5000 });
    
    const otpInput = page.locator('input[type="text"][maxlength="6"]');
    await otpInput.fill(testOtp);
    
    const verifyOtpButton = page.locator('button:has-text("Verify OTP")');
    await verifyOtpButton.click();
    
    await expect(page.locator('text="Complete your profile"')).toBeVisible({ timeout: 5000 });
    
    // Fill all required fields
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill(testData.name);
    
    // Fill phone with invalid format
    const phoneInput = page.locator('input[name="phone_number"]');
    await phoneInput.fill("123");
    
    const idInput = page.locator('input[name="id_number"]');
    await idInput.fill(testData.id_number);
    
    const professionSelect = page.locator('select[name="profession"]');
    await professionSelect.selectOption(testData.profession);
    
    const designationInput = page.locator('input[name="designation"]');
    await designationInput.fill(testData.designation);
    
    const organizationInput = page.locator('input[name="organization"]');
    await organizationInput.fill(testData.organization);
    
    const foodPreferenceSelect = page.locator('select[name="food_preference"]');
    await foodPreferenceSelect.selectOption(testData.food_preference);
    
    const linkedinInput = page.locator('input[name="linkedin_url"]');
    await linkedinInput.fill(testData.linkedin_url);
    
    const expectationsTextarea = page.locator('textarea[name="expectations"]');
    await expectationsTextarea.fill(testData.expectations);
    
    // Try to submit with invalid phone
    const submitButton = page.locator('button:has-text("Submit Registration")');
    await submitButton.click();
    
    // Should show phone format error
    const phoneFormatError = page.locator('text="Phone number must be in the format"');
    await expect(phoneFormatError).toBeVisible({ timeout: 5000 });
  });
});
