const FIELD_MAP = {
  email: ['email', 'e-mail'],
  fullName: ['fullname', 'full name', 'your name', 'name'],
  firstName: ['firstname', 'first name'],
  lastName: ['lastname', 'last name', 'surname'],
  phone: ['phone', 'mobile', 'contact number', 'cell'],
  linkedin: ['linkedin'],
  github: ['github'],
  portfolio: ['portfolio', 'personal site', 'personal website'],
  website: ['website', 'url', 'link'],
  company: ['company', 'organization', 'organisation', 'employer', 'workplace'],
  jobTitle: ['job title', 'role', 'position', 'designation'],
  city: ['city', 'town'],
  state: ['state', 'province'],
  country: ['country'],
  address: ['address', 'street'],
  zipCode: ['zip', 'pincode', 'postal code'],
};

export function detectSmartKey(fieldName = '', label = '') {
  const text = `${fieldName} ${label}`.toLowerCase().replace(/[_-]/g, ' ');
  for (const [key, keywords] of Object.entries(FIELD_MAP)) {
    if (keywords.some((k) => text.includes(k))) return key;
  }
  return null;
}

export function getSmartValue(fieldName, label) {
  if (typeof window === 'undefined') return null;
  const key = detectSmartKey(fieldName, label);
  if (!key) return null;
  return localStorage.getItem(`smartfill_${key}`);
}

export function saveSmartValues(formData, formFields) {
  if (typeof window === 'undefined') return;
  if (!formFields) return;
  formFields.forEach((field) => {
    const key = detectSmartKey(field.fieldName, field.label);
    const value = formData[field.fieldName];
    if (key && value && typeof value === 'string' && value.trim()) {
      localStorage.setItem(`smartfill_${key}`, value.trim());
    }
  });
}

export function buildSmartDefaults(formFields) {
  if (typeof window === 'undefined') return {};
  const defaults = {};
  if (!formFields) return defaults;
  formFields.forEach((field) => {
    const value = getSmartValue(field.fieldName, field.label);
    if (value) defaults[field.fieldName] = value;
  });
  return defaults;
}
