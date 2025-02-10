import { RawDraftContentState } from "draft-js"; // @ts-ignore
import draftToHtml from "draftjs-to-html";

const preprocessRawContentState = (
    rawContentState: RawDraftContentState
): RawDraftContentState => {
    const modifiedBlocks = rawContentState.blocks.map((block) => {
        if (block.type === "unstyled" && !block.text.trim()) {
            return {
                ...block,
                text: "\u200B", // Zero-width space character to preserve empty blocks
            };
        }
        return block;
    });

    return {
        ...rawContentState,
        blocks: modifiedBlocks,
    };
};

export const convertDraftToHtmlWithEmptyBlocks = (
    description: RawDraftContentState
): string => {
    const preprocessedContentState = preprocessRawContentState(description);
    return draftToHtml(preprocessedContentState);
};
