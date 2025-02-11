import dynamic from "next/dynamic";
import Quill from "quill";
import { toast } from "sonner";
import { useRef, useState } from "react";

import { useCreateMessage } from "@/features/messages/api/use-create-message";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
    placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {

    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);
    console.log("🚀 ~ ChatInput ~ isPending:", isPending)

    const editorRef = useRef<Quill | null>(null);

    const channelId = useChannelId();
    const workspaceId = useWorkSpaceId();

    const { mutate: createMessage } = useCreateMessage();

    const handleSubmit = async ({
        body,
        image
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setIsPending(true);
            await createMessage({
                workspaceId,
                channelId,
                body
            }, { throwError: true });

            setEditorKey((prev) => prev + 1);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="px-5 w-full">
            <Editor
                key={editorKey}
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    )
}