// Inject ads into blog content HTML
export function injectAdsIntoContent(htmlContent: string): string {
    // Split content by h2 headings (main sections)
    const sections = htmlContent.split(/(<h2[^>]*>.*?<\/h2>)/gi);

    let result = '';
    let sectionCount = 0;

    for (let i = 0; i < sections.length; i++) {
        result += sections[i];

        // Check if this is an h2 heading
        if (sections[i].match(/<h2[^>]*>/i)) {
            sectionCount++;

            // Add ad after section 1, 2, and 3
            if (sectionCount === 1 || sectionCount === 2 || sectionCount === 3) {
                result += '<div class="in-content-ad-marker" data-position="' + sectionCount + '"></div>';
            }
        }
    }

    // Add ad at the end
    result += '<div class="in-content-ad-marker" data-position="end"></div>';

    return result;
}
