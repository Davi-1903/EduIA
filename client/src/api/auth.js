import getCSRF from './csrf';

export async function POST(url, data) {
    const csrf = await getCSRF();
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
}
