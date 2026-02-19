export const getTitle = (item, language) => {
    if (!item) return "N/A";

    const title = item.title;
    const japanese_title = item.japanese_title || item.japaneseTitle;

    if (language === "EN") {
        if (typeof title === "string") return title;
        return title?.english || title?.romaji || "N/A";
    } else {
        // JP
        return japanese_title || (typeof title === "string" ? title : title?.romaji || title?.english || "N/A");
    }
};
