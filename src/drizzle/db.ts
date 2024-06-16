import "@/drizzle/envConfig"
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelsql } from "@vercel/postgres";
import { users, teams, teamMembers, conversations, messages } from "./schema";
import * as schema from './schema';
import { and, eq, gte, sql, gt } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const db = drizzle(vercelsql, { schema });

export const getUsers = async () => {
    const selectResult = await db.select().from(users);
    return selectResult; 
}

export const getUserbyEmail = async (email: string) => {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user;
}

export const createNewConversation = async (slug: string, teamid: number) => {
    const newConversation = await db.insert(conversations).values({
        slug: slug,
        belongsTo: teamid,
    }).returning()

    const reduceTeamCredits = await db.update(teams).set({
        credits: sql`${teams.credits} - 1`
    }).where(eq(teams.id, teamid))

    return newConversation;
}

export const fetchMessages = async (conversationId: number) => {
    const fetchedMsgs = await db.select().from(messages).where(eq(messages.partOf, conversationId))
    return fetchedMsgs; 
}

export const getTeamConversations = async (teamId: number) => {
    const Teamconversation = await db.select().from(conversations).where(eq(conversations.belongsTo, teamId)); 

    return Teamconversation; 
}

export const createNewMessage = async (content: string, conversationId: number) => {
    const newMessage = await db.insert(messages).values({
        content: content,
        partOf: conversationId
    }).returning()

    return newMessage
}

export const getMyTeam = async (id: number) => {
    const team = await db.select().from(teams).where(eq(teams.admin, id));
    return team; 
}

export const getTeamsForUser = async (id: number) => {
    const allTeams = await db.select().from(teamMembers)
                    .leftJoin(teams, eq(teamMembers.teamId, teams.id))
                    .where(eq(teamMembers.userId, id))
                    
    // console.log(allTeams);

    return allTeams
}

export const checkMemberShip = async (id: number, teamId: number ) => {
    const exists = await db.select().from(teamMembers).where(and(eq(teamMembers.userId, id), eq(teamMembers.teamId, teamId)))
    return exists;
}  

export const addMembertoTeam = async (id: number, teamId: number) => {
    const added =  await db.insert(teamMembers).values({
        userId: id,
        teamId: teamId
    }).returning()

    const updateMembersCount = await db.update(teams).set({
        memberCount: sql`${teams.memberCount} + 1`
    }).where(eq(teams.id, teamId))

    return added
}

export type NewTeam = typeof teams.$inferInsert;

export const addNewTeam = async (payload: any) => {
    console.log("payload", payload);
    return db.insert(teams).values(payload).returning();
}

export type NewUser = typeof users.$inferInsert;

export const insertUser = async (user: NewUser) => {
    return db.insert(users).values(user).returning();
};

export const updateTeamCredits = async () => {
    return db.update(teams).set({
        credits: sql`${teams.credits} + 10`
    })
}

export const updateUsertoken = async (newToken: string, email: string, expiryDate: any) => {
    return await db.update(users).set({
        verifyToken: newToken,
        verifyTokenExpiry: expiryDate
    }).where(eq(users.email, email,  )) 

}

export const getUserbyToken = async (token: string) => {
    const userData = await db.select().from(users).where(
        and(eq(users.verifyToken, token))
    )
    return userData
}

export const userverified = async (email: string) => {
    return await db.update(users).set({
        verified: true, 
        verifyToken: null,
        verifyTokenExpiry: null
    }).where(eq(users.email, email,  )) 
}