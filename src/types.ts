import { z } from 'zod'

export const serverSchema = z.object({
    command: z.string(),
    args: z.array(z.string()),
    env: z.record(z.string(), z.string()).optional(),
    settings: z.record(z.string(), z.string()).optional(),
})

export type ServerType = z.infer<typeof serverSchema>

export const configSchema = z.record(z.string(), serverSchema)

export type ConfigType = z.infer<typeof configSchema>

export const clientSchema = z.object({
    name: z.string(),
    config: configSchema,
})

export type ClientType = z.infer<typeof clientSchema>

export const profileSchema = clientSchema

export type ProfileType = z.infer<typeof profileSchema>

export const systemSchema = z.object({
    clients: z.array(clientSchema),
    profiles: z.array(profileSchema),
})

export type SystemType = z.infer<typeof systemSchema>
