const { pgTable,serial,text,varchar,integer} = require("drizzle-orm/pg-core");

export const JsonForms=pgTable('jsonForms',{
    id:serial('id').primaryKey(),
    jsonform:text('jsonform').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt').notNull(),
    theme:varchar('theme'),
    background:varchar('background'),
    style:varchar('style'),
    formName:varchar('formName'),
    formDescription:varchar('formDescription'),
})

export const userResponses=pgTable('userResponses',{
    id:serial('id').primaryKey(),
    jsonResponse:text('jsonResponse').notNull(),
    createdBy:varchar('createdBy').default('anonymous'),
    createdAt:varchar('createdAt').notNull(),
    formRef:integer('formRef').references(()=>JsonForms.id)
})