import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";
import { ComponentType } from "react";

export const Editor = dynamic<EditorProps>(
    async () => {
        const mod = await import("react-draft-wysiwyg");
        return {
            default: mod.Editor as unknown as ComponentType<EditorProps>,
        };
    },
    { ssr: false }
);
