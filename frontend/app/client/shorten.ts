export const shortenLink = async (url: string): Promise<void> => {
    await fetch('http://localhost:3000/api/link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url
        })
    });

    return;
};