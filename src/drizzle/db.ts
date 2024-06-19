import "@/drizzle/envConfig"
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelsql } from "@vercel/postgres";
import { users, teams, teamMembers, conversations, messages } from "./schema";
import * as schema from './schema';
import { and, eq, gte, sql, gt, or, inArray } from "drizzle-orm";
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
    const creating =  await db.transaction(async (tx) => {
        const [credits] = await tx.select({credits: teams.credits})
                        .from(teams).where(eq(teams.id, teamid));

        
        if(credits.credits <= 0){
            await tx.rollback()
            return 'team credits are insufficient'
        }

        const [newconversation] = await tx.insert(conversations).values({
            slug: slug,
            belongsTo: teamid
        }).returning();
        
        const updatecount = await tx.update(teams).set({
            credits: sql`${teams.credits} - 1`
        }).where(eq(teams.id, teamid))
        
        return newconversation
    })
    // console.log(creating)
    return creating
}

export const fetchMessages = async (conversationId: number) => {
    const fetchedMsgs = await db.select().from(messages).where(eq(messages.partOf, conversationId))
    return fetchedMsgs; 
}

export const fetchMembers = async (teamid: number) => {
    const fetchedMembers = await db.select()
                            .from(teamMembers)
                            .where(eq(teamMembers.teamId, teamid));

    console.log(teamid)
    
    const userIdArray = fetchedMembers.map(record => record.userId);
    
    if (userIdArray.length === 0) {
        return [];
    }
    
    const usersResult = await db.select().from(users)
                                .where(inArray(users.id, userIdArray));
    
    return usersResult;
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
    // console.log(newMessage)
    return newMessage
}

export const getMyTeam = async (id: number) => {
    const team = await db.select().from(teams).where(eq(teams.admin, id));
    return team; 
}

export const getTeamsForUser = async (id: number) => {
    // const allTeams = await db.select().from(teamMembers)
    //                 .leftJoin(teams, eq(teamMembers.teamId, teams.id))
    //                 .where(eq(teamMembers.userId, id))
    const allTeams = await db.select().from(teams)
                    .leftJoin(teamMembers, eq(teamMembers.teamId, teams.id))
                    .where(
                        or(
                            eq(teamMembers.userId, id),
                            eq(teams.admin, id)
                        )
                    )

    return allTeams
}

export const checkMemberShip = async (id: number, teamId: number ) => {
    const exists = await db.select().from(teamMembers).where(and(eq(teamMembers.userId, id), eq(teamMembers.teamId, teamId)))
    return exists;
}  

export const addMembertoTeam = async (id: number, teamId: number) => {
    return db.transaction(async (tx) => {
        const [members] = await tx.select({members: teams.memberCount})
                            .from(teams).where(eq(teams.id, teamId)); 
        
        if(members.members >= 5){
            await tx.rollback()
            return "Team is Full."
        }

        const [value] = await tx.insert(teamMembers).values({
            userId: id,
            teamId: teamId
        }).returning()

        await db.update(teams).set({
            memberCount: sql`${teams.memberCount} + 1`
        }).where(eq(teams.id, teamId))
        
        return value; 
    })
}

export type NewTeam = typeof teams.$inferInsert;

export const addNewTeam = async (payload: any) => {
    // console.log("payload", payload);
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

export const userRemoveFromTeam = async (userid: number, teamid: number) => {
    return await db.delete(teamMembers).where(and(eq(teamMembers.userId, userid), eq(teamMembers.teamId, teamid)));
}

export const getCredits = async (teamId: number) => {
    return await db.select({credits: teams.credits}).from(teams).where(eq(teams.id, teamId)); 
}

export const updateDate = async (convoId: number) => {
    return await db.update(conversations).set({
        updatedAt: new Date()
    }).where(eq(conversations.id, convoId))
}