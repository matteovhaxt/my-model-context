import type { Config } from "../Config";
import { password, text, confirm, log, select } from "@clack/prompts";
import { serverSchema, type ServerType } from "../types";

export const add = async (config: Config) => {
    const name = await text({
        message: "Please enter the name of the server.",
    });
    const mode = await select({
        message: "Please select the mode of the server.",
        options: [
            { value: "json", label: "JSON" },
            { value: "manual", label: "Manual" },
        ],
    });
    if (mode === "json") {
        const json = await text({
            message: "Please enter the JSON of the server.",
        });
        const parsed = serverSchema.parse(JSON.parse(json as string));
        config.addServer(name as string, parsed);
    } else {
        const command = await text({
            message: "Please enter the start command.",
        });
        const addEnv = await confirm({
            message: "Would you like to add environment variables?",
        }) as boolean;
        let env: ServerType["env"] = {};
        if (addEnv) {
            let completed = false;
            while (!completed) {
                const key = await text({
                    message: "Please enter the key of the environment variable.",
                });
                const value = await password({
                    message: "Please enter the value of the environment variable.",
                });
                env[key as string] = value as string;
                const addAnother = await confirm({
                    message: "Would you like to add another environment variable?",
                }) as boolean;
                completed = !addAnother;
            }
        }
        const args = (command as string).split(" ");
        const parsed = serverSchema.parse({
            command: args[0],
            args: args.slice(1),
            env: env,
        });        
        config.addServer(name as string, parsed);
    }
    log.success(`Successfully added ${name as string} to the config`);
}