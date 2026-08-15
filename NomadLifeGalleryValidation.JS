// Nomad Life Gallery — Form Validation
// Pure format validators (value in, boolean out — no DOM access, so they're
// independently testable) plus a small runner that wires them to a set of
// form fields with inline error messaging. Shared by any page with a form.
 
function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}
 
function isValidName(value) {
  return isNonEmpty(value) && /^[A-Za-z\s'-]{2,}$/.test(value.trim());
}
 
function isValidStreetAddress(value) {
  return isNonEmpty(value) && value.trim().length >= 5;
}
 
function isValidCity(value) {
  return isNonEmpty(value) && /^[A-Za-z\s'-]{2,}$/.test(value.trim());
}
 
function isValidState(value) {
  return isNonEmpty(value);
}
 
function isValidZip(value) {
  return isNonEmpty(value) && /^[0-9]{5}(-[0-9]{4})?$/.test(value.trim());
}
 
function isValidPhone(value) {
  return isNonEmpty(value) && /^\(\d{3}\) \d{3}-\d{4}$/.test(value.trim());
}
 
// Luhn checksum — the standard algorithm card issuers use to catch typos in
// a card number (it is NOT a check that the card is real or has funds).
function passesLuhnCheck(digitsOnly) {
  let sum = 0;
  let shouldDouble = false;
 
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
 
  return sum % 10 === 0;
}
 
function isValidCardNumber(value) {
  if (!isNonEmpty(value)) return false;
  const digitsOnly = value.replace(/\s/g, "");
  if (!/^[0-9]{13,19}$/.test(digitsOnly)) return false;
  return passesLuhnCheck(digitsOnly);
}
 
// Validates MM/YY format AND that the card has not already expired, relative
// to referenceDate (defaults to now). A card expires at the end of its
// printed month.
function isValidExpiration(value, referenceDate) {
  if (!isNonEmpty(value)) return false;
  const match = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.exec(value.trim());
  if (!match) return false;
 
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  const now = referenceDate || new Date();
  const endOfExpiryMonth = new Date(year, month, 0, 23, 59, 59);
 
  return endOfExpiryMonth >= now;
}
 
function isValidSecurityCode(value) {
  return isNonEmpty(value) && /^[0-9]{3,4}$/.test(value.trim());
}
 
// Runs required + format validation across a set of fields and reflects
// pass/fail state into the DOM: adds/removes an "is-invalid" class on the
// input and fills in a matching "<id>-error" element with a message.
// fields: array of { id, required, validator, message }.
// Returns true only if every field in the list passes.
function validateFields(fields) {
  let allValid = true;
 
  for (let i = 0; i < fields.length; i++) {
    const config = fields[i];
    const input = document.getElementById(config.id);
    if (!input) continue;
 
    const value = input.value;
    const filled = isNonEmpty(value);
    let fieldValid = true;
    let message = "";
 
    if (config.required && !filled) {
      fieldValid = false;
      message = "This field is required.";
    } else if (filled && config.validator && !config.validator(value)) {
      fieldValid = false;
      message = config.message || "This field isn't valid.";
    }
 
    const errorEl = document.getElementById(config.id + "-error");
 
    if (fieldValid) {
      input.classList.remove("is-invalid");
      if (errorEl) errorEl.textContent = "";
    } else {
      input.classList.add("is-invalid");
      if (errorEl) errorEl.textContent = message;
      allValid = false;
    }
  }
 
  return allValid;
}
 
// Clears validation state (error styling + messages) for a set of fields,
// e.g. after a successful submit and form reset.
function clearFieldValidation(fields) {
  for (let i = 0; i < fields.length; i++) {
    const config = fields[i];
    const input = document.getElementById(config.id);
    const errorEl = document.getElementById(config.id + "-error");
    if (input) input.classList.remove("is-invalid");
    if (errorEl) errorEl.textContent = "";
  }
}