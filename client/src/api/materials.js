export async function GET(url) {
    const response = await fetch(url, { credentials: 'include' });
    const data = await response.json();
    data.status = response.status;
    return data;
}
