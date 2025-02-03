export const convertImagesToGallery = (urls: string[]) => {
    const convertedImages = urls.map((url) => {
        return { original: url, thumbnail: url };
    });
    return convertedImages;
};
