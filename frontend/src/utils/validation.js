export function validateName(name) {
  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return '';
}

export function validateAddress(address) {
  if (!address || address.trim().length === 0) return 'Address is required';
  if (address.length > 400) return 'Address must be at most 400 characters';
  return '';
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !re.test(email)) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be 8-16 characters';
  }
  if (!/[A-Z]/.test(password)) return 'Password needs at least one uppercase letter';
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/.test(password)) {
    return 'Password needs at least one special character';
  }
  return '';
}

export function extractApiErrors(err) {
  const data = err?.response?.data;
  if (data?.errors) {
    const map = {};
    data.errors.forEach((e) => {
      map[e.field] = e.message;
    });
    return { fieldErrors: map, message: data.message };
  }
  return { fieldErrors: {}, message: data?.message || 'Something went wrong. Please try again.' };
}
