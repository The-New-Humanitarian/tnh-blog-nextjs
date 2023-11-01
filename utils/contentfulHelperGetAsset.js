import { createClient } from 'contentful';

export const fetchAssetById = async (assetId) => {
    const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });

    try {
        const asset = await client.getAsset(assetId);
        return asset.fields.file
    } catch (err) {
        console.error('Failed to fetch asset:', err);
        return null;
    }
};