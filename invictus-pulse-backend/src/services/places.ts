const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

type GooglePlace = {
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    googleMapsUri?: string;
    nationalPhoneNumber?: string;
};

export async function searchPlacesAll(query: string) {
    const allPlaces: GooglePlace[] = [];
    let pageToken: string | undefined;

    do {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask": "places.displayName,places.id,places.formattedAddress,places.googleMapsUri,places.websiteUri,places.nationalPhoneNumber,nextPageToken",
            },
            body: JSON.stringify({
                textQuery: query,
                pageToken,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google Places search failed: ${response.status} ${errorText}`);
        }

        const data = (await response.json()) as { places?: GooglePlace[]; nextPageToken?: string };
        const places = data.places ?? [];

        // Keep businesses that do not have a website.
        const filtered = places.filter((place) => !place.websiteUri);
        allPlaces.push(...filtered);

        pageToken = data.nextPageToken;

        // Google requires a delay before using the next page token.
        if (pageToken) {
            await new Promise((res) => setTimeout(res, 2000));
        }
    } while (pageToken);

    return allPlaces;
}

export function mapPlacesToLeads(places: GooglePlace[]) {
    return places.map((place) => ({
        business_name: place.displayName?.text ?? "Unknown Business",
        phone: place.nationalPhoneNumber ?? null,
        address: place.formattedAddress ?? null,
        google_url: place.googleMapsUri ?? null,
        stage: "new",
        notes: null,
    }));
}