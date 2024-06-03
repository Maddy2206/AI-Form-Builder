import { integer } from "drizzle-orm/sqlite-core";

const { pgTable,serial,text,varchar} = require("drizzle-orm/pg-core");

export const JsonForms=pgTable('jsonForms',{
    id:serial('id').primaryKey(),
    jsonform:text('jsonform').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt').notNull(),
    theme:varchar('theme'),
    background:varchar('background'),
    style:varchar('style')
})

export const userResponses=pgTable('userResponses',{
    id:serial('id').primaryKey(),
    jsonResponse:text('jsonResponse').notNull(),
    createdBy:varchar('createdBy').default('anonymous'),
    createdAt:varchar('createdAt').notNull(),
    formRef:integer('formRef').references(()=>JsonForms.id)
})