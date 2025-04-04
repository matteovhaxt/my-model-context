import { z } from "zod";

const serverSchema = z.object({
    command: z.string(),
    args: z.array(z.string()),
    env: z.record(z.string(), z.string()),
});

export type ServerType = z.infer<typeof serverSchema>;

export const configSchema = z.object({
    mcpServers: z.record(
        z.string(),
        serverSchema,
    ),
});

export type ConfigType = z.infer<typeof configSchema>;
