export const deleteLink = async (ecodedShortcode: string): Promise<void> => {
    await fetch(`http://localhost:3000/api/link/${ecodedShortcode}`, {
        method: 'DELETE'
    });
};