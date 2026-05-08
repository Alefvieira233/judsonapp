// Pure constant + type. Lives outside actions.ts because Next bans
// non-function exports from "use server" files.

export const REACTION_KINDS = ["like", "fire", "heart", "muscle", "clap"] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];
