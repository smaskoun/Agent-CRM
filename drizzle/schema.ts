import { decimal, int, mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";

export const clients = mysqlTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  stage: varchar("stage", { length: 64 }).default("Discovery"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const deals = mysqlTable("deals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 191 }).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status", { length: 32 }).default("open"),
  stage: varchar("stage", { length: 64 }).default("Discovery"),
  clientId: int("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type Deal = typeof deals.$inferSelect;
