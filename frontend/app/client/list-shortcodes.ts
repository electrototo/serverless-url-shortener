export interface ListShortCodesResponse {
    cursor: string;
    data: { url: string; shortcode: string; creationDate: string }[];
}

export const listShortCodes = async (url: string): Promise<ListShortCodesResponse> => {
    const response = await fetch(`http://localhost:3000/api/link/${url}`);
    const data = (await response.json()) as ListShortCodesResponse;

    return data;
};