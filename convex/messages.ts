import { v } from "convex/values";

import { auth } from "./auth";
import { mutation, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">
) => {
    return await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
};

export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parrentMessageId: v.optional(v.id("messages")),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await getMember(ctx, args.workspaceId, userId);

        if (!member) {
            throw new Error("Unauthorized");
        }

        let _conversationId = args.conversationId;

        // Only possible if we are replying in thread in 1:1 conversation
        if (!args.conversationId && !args.channelId && args.parrentMessageId) {
            const parrentMessage = await ctx.db.get(args.parrentMessageId);
            if (!parrentMessage) {
                throw new Error("Parrent message not found");
            }
            _conversationId = parrentMessage.conversationId;
        }

        const messageId = await ctx.db.insert("messages", {
            memberId: member._id,
            body: args.body,
            image: args.image,
            workSpaceId: args.workspaceId,
            conversationId: _conversationId,
            channelId: args.channelId,
            parrentMessageId: args.parrentMessageId,
            updatedAt: Date.now(),
        });

        return messageId;
    }
})