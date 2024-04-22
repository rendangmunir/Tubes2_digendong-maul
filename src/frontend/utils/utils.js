export const getWikipediaPageUrl = (pageTitle) => {
    const baseUrl = 'https://en.wikipedia.org/wiki/';
    const sanitizedPageTitle = pageTitle.replace(/ /g, '_');
    return `${baseUrl}${encodeURIComponent(sanitizedPageTitle)}`;
};