import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activities table with unique index inside pgTable
export const activities = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userDateIndex: uniqueIndex("user_date_idx").on(table.userId, table.date),
  })
);
