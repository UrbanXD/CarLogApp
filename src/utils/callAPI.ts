export async function callAPI(url: string) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    });

    return response.json();
}