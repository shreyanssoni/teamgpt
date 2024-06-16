import { SQL, relations, sql } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp, uniqueIndex, check } from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        name: text("name").notNull(),
        email: text("email").notNull(),
        password: text("password").notNull(),
        verified: boolean("verified").notNull().default(false),
        verifyToken: text("verifyToken"), 
        verifyTokenExpiry: timestamp('verfiyTokenExpiry'), 
        createdAt: timestamp("createdAt").defaultNow().notNull(),
    },
    (users) => {
        return {
            uniqueIdx: uniqueIndex("unique_idx").on(users.email)
        }
    }
)

export const teams = pgTable(
    "teams",
    {
        id: serial("id").primaryKey(),
        name: text("name").notNull().unique(),
        credits: integer("credits").notNull().default(10), 
        memberCount: integer("memberCount").notNull().default(1),
        createdAt: timestamp("createdAt").defaultNow().notNull(),
        admin: integer("admin").notNull().references(() => users.id).unique(),

    }
)

export const conversations = pgTable(
    "conversations",
    {
        id: serial("id").primaryKey(),
        slug: text("slug").notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull(),
        updatedAt: timestamp("updatedAt").defaultNow().notNull(),
        belongsTo: integer("belongsTo").notNull().references(() => teams.id)
    }
)

export const messages = pgTable(
    "messages",
    {
        id: serial("id").primaryKey(),
        content: text("content").notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull(),
        partOf: integer("partOf").notNull().references(()=> conversations.id)
    }
)

export const messageRelations = relations(messages, ({one}) => ({
    ownerConversation: one(conversations, {
        fields: [messages.partOf],
        references: [conversations.id]
    })
}))

export const conversationRelations = relations(conversations, ({one, many}) => ({
    ownerTeam: one(teams, {
        fields: [conversations.belongsTo],
        references: [teams.id]
    }),

    messagesIncluded: many(messages)
}))

export const adminUserRelations = relations(users, ({one, many}) => ({
    ownedTeam : one(teams, {
        fields: [users.id],
        references: [teams.admin]
    }),

    teamsAsMembers: many(teamMembers)
}) )

export const ownedTeamRelations = relations(teams, ({one,many}) => ({
    teamAdmin : one(users, {
        fields: [teams.admin],
        references: [users.id]
    }),

    usersAsMembers: many(teamMembers),

    conversationsIncluded: many(conversations)
}))

// Team members table definition to handle many-to-many relationship
export const teamMembers = pgTable(
    "teamMembers",
    {
        teamId: integer("teamId").references(() => teams.id).notNull(),
        userId: integer("userId").references(() => users.id).notNull(),
    },
    (teamMembers) => {
        return {
            pk: uniqueIndex("team_member_pk").on(teamMembers.teamId, teamMembers.userId), // Ensure unique combination
            checkNotAdmin: check(
                "check_admin_not_member",
                sql `teamId, NOT, IN(SELECT, id, FROM, teams, WHERE, adminId = teamMembers.userId)`
            )
        }
    }
)

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
    team: one(teams, {
        fields: [teamMembers.teamId],
        references: [teams.id]
    }),
    user: one(users, {
        fields: [teamMembers.userId],
        references: [users.id]
    })
}));