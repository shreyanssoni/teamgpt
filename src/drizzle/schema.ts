import { boolean, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        name: text("name").notNull(),
        email: text("email").notNull(),
        password: text("password").notNull(),
        verfied: boolean("verified").notNull().default(false),
        verifyToken: text("verifyToken"), 
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
        name: text("name").notNull(),
        
    }
)