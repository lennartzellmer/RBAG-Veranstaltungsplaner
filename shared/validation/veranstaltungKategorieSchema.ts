import { z } from 'zod'
import { AdressSchema } from './addressSchema'

export const ortsSchema = AdressSchema.partial().extend({
  name: z.string().min(1, 'Ortsname muss etwas länger sein.')
})

export const voreinstellungenSchema = z.strictObject({
  zielgruppe: z.string().min(1, 'Zielgruppe muss etwas länger beschrieben werden.'),
  beschreibung: z.string().min(1, 'Beschreibung muss etwas länger werden.'),
  ort: ortsSchema,
  anzeigebild: z.string().min(1, 'Anzeigebild muss ausgewählt werden.'),
  leitung: z.object({
    userIds: z.array(z.string()).min(1, 'Es muss mindestens eine Leitung ausgewählt werden.')
  })
})

export const veranstaltungsKategorieSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3, 'Name muss etwas länger sein.'),
  beschreibung: z.string().min(3, 'Beschreibung muss etwas länger sein.'),
  voreinstellungen: voreinstellungenSchema
})

export const veranstaltungsKategorieUpdateSchema
  = veranstaltungsKategorieSchema
    .omit({ id: true })
    .partial()

export const veranstaltungsKategorieCreateSchema
  = veranstaltungsKategorieSchema
    .omit({ id: true })

export type VeranstaltungsKategorieSchema = z.infer<typeof veranstaltungsKategorieSchema>
export type VeranstaltungsKategorieCreateSchema = z.infer<typeof veranstaltungsKategorieCreateSchema>
export type VeranstaltungsKategorieUpdateSchema = z.infer<typeof veranstaltungsKategorieUpdateSchema>
