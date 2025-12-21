export default async function getCSRF() {
    const response = await fetch('/api/auth/csrf', { credentials: 'include' });
    const data = await response.json();
    return data.csrfToken;
}