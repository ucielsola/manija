export const getYoutubeUrlFromClipboard = async () => {
    try{
        const content = (await readClipboard()) || ""

        if (content.includes('https://www.youtube.com/watch?v=')) {
            return content;
        }
    
        return null;
    } catch (error) {
        console.warn('Error reading clipboard:', error);
        return null;
    }
};

const readClipboard = async (): Promise<string | null> => {
    return await navigator.clipboard.readText();
};