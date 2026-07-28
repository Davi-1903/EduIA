import getCSRF from './csrf';

export async function GET(url) {
    const response = await fetch(url, { credentials: 'include' });
    const data = await response.json();
    data.status = response.status;
    return data;
}

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
    result.status = response.status;
    return result;
}
