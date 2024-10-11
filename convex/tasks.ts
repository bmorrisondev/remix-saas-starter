import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getTasks = query({
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity()
    if(!auth) {
      throw new Error("Not authenticated")
    }

    return await ctx.db.query("tasks")
      .filter(q => q.eq(q.field("user_id"), auth.subject))
      .collect()
  }
})

export const addTask = mutation({
  args: {
    name: v.string()
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity()
    if(!auth) {
      throw new Error("Not authenticated")
    }

    return await ctx.db.insert("tasks", {
      name: args.name,
      user_id: auth.subject
    })
  }
})

export const toggleTaskState = mutation({
  args: {
    _id: v.string()
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity()
    if(!auth) {
      throw new Error("Not authorized")
    }

    const task = await ctx.db.get(args._id as Id)
    if(!task) {
      throw new Error("Task not found")
    }

    await ctx.db.patch(args._id as Id, {
      is_completed: task.is_completed ? false : true
    })
  }
})

