# Mobile Next Button Testing Guide

## Quick Test Checklist

### Prerequisites
- [ ] Project is built and running
- [ ] Can access on mobile browser or mobile emulator
- [ ] Developer console is open for debugging

### Step-by-Step Test

#### Step 0: Contact Information
1. Open registration modal
2. **Verify Next button is DISABLED** initially
3. Type email → Button should still be disabled (phone required)
4. Type phone → **Button should now be ENABLED**
5. Click Next → Should advance to Step 1
   - If stuck: Check console for errors about specific missing fields

#### Step 1: Background Information  
1. **Verify Next button is DISABLED**
2. Select "Do you own a pet?" → Button still disabled (more fields needed)
3. If "Yes":
   - Select pet type(s) → Button still disabled
   - Select outdoor frequency → Button still disabled
   - Select "Lost pet before?" → **Button should be ENABLED**
4. If "No":
   - **Button should be ENABLED immediately**
5. Click Next → Should advance to Step 2

#### Step 2: Current Solutions & Pain Points
1. **Verify Next button is DISABLED**
2. Select "Do you use tracking?" → Button still disabled
3. Select at least one safety concern → Button still disabled (more needed)
4. Fill "Current safety methods" text → **Button should be ENABLED**
5. Click Next → Should advance to Step 3

#### Step 3: Expectations for PAWhere
1. **Verify Next button is DISABLED**
2. Select at least one important feature → Button still disabled
3. Select at least one expected challenge → Button still disabled
4. Select usefulness rating → Button still disabled (description needed)
5. Fill "Wished feature" text → **Button should be ENABLED**
6. Click Next → Should advance to Step 4

#### Step 4: Confirmation & Submit
1. Review all information displayed
2. **"Complete Onboarding" button should be ENABLED**
3. Click "Complete Onboarding"
4. **Should see success toast**: "Welcome to PAWhere! We'll be in touch soon."
5. Dialog should close
6. Check database or API logs for registration record

### Expected Behaviors

#### Button Enable/Disable
- ✅ Button enables/disables smoothly as you fill fields
- ✅ No lag between field fill and button state change
- ✅ Works the same on mobile and desktop
- ✅ Works on both portrait and landscape

#### Error Handling
- If click Next with incomplete fields:
  - ✅ Toast shows specific field that needs attention
  - ✅ Not a generic "fill all fields" message
  - ✅ User stays on current step

#### Data Submission
- ✅ All 22 form fields sent to server
- ✅ No duplicate submissions
- ✅ Database record created with all fields
- ✅ Success toast appears

### Debugging Tips

#### If button won't enable:
1. **Check console** for validation errors
2. **Verify all required fields are filled** according to step
3. **Try refreshing the page**
4. **Check network tab** for any failed requests
5. **Verify form field names** match schema expectations

#### If button enables but Next doesn't work:
1. **Check console** for JavaScript errors
2. **Verify currentStep state** is updating
3. **Check if mutation is pending** (might be locked)
4. **Try clicking again** after a few seconds

#### If data not saving:
1. **Check network requests** in DevTools
2. **Verify POST to /api/register** succeeds (200 status)
3. **Check server console** for registration errors
4. **Check database** for any error logs
5. **Verify all fields present** in request payload

### Console Debugging

The form logs detailed information:
```
=== CLEANED SUBMISSION DATA ===
Data to submit: {...}
Data size: XXXX bytes
[email]: ... (string, length: N/A)
[phone]: ... (string, length: N/A)
[petType]: ... (array, length: N/A)
...
```

Look for:
- ✅ All 22+ fields in the payload
- ✅ Correct field types (arrays, strings, numbers)
- ✅ No undefined values for required fields
- ✅ No errors during validation

### Mobile Emulation

If testing with DevTools emulation:
1. **Enable Device Toolbar** (Ctrl+Shift+M)
2. **Select iPhone/Android preset**
3. **Rotate screen** to test portrait/landscape
4. **Test with touch** (enable touch emulation in settings)
5. **Throttle network** (simulate slow 3G) for timeout testing

### Performance Notes

On slow networks:
- Button should still respond immediately
- Validation happens client-side before submission
- Network timeout is 30 seconds
- Should see "Completing..." text while submitting

### Accessibility

While testing, verify:
- ✅ Form fields are properly labeled
- ✅ Error messages are read by screen readers
- ✅ Buttons have proper focus states
- ✅ Keyboard navigation works (Tab key)
- ✅ Touch targets are large enough (44px minimum)

## Common Issues & Fixes

### Issue: Button never enables
**Cause**: Form state not syncing
**Fix**: 
1. Hard refresh (Ctrl+F5)
2. Clear local storage: `localStorage.clear()`
3. Check browser console for errors
4. Try different browser/device

### Issue: Next button works but stays on same step
**Cause**: `currentStep` state not updating
**Fix**:
1. Check React DevTools for state updates
2. Verify no console errors
3. Try clicking more slowly
4. Check for JavaScript errors

### Issue: Data submits but not in database
**Cause**: Server issue or schema mismatch
**Fix**:
1. Check server logs for errors
2. Verify all 22 fields in database schema
3. Test with curl/Postman directly
4. Check database migration status

## Success Criteria

The fix is working if:
- ✅ Next button enables/disables in real-time on mobile
- ✅ No lag between field input and button state
- ✅ Specific error messages when validation fails
- ✅ All 5 steps navigate smoothly
- ✅ Form submission succeeds
- ✅ Database record includes all fields
- ✅ Works consistently across browsers/devices

## Reporting Issues

If you find problems:
1. **Note the exact step** where it fails
2. **Screenshot the button state**
3. **Copy console errors**
4. **Test on different device/browser**
5. **Check if data saved despite UI issue**
