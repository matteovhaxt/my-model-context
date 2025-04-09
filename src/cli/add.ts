import type { Config } from "../Config";
import { password, text, confirm, log } from "@clack/prompts";

export const add = async (config: Config) => {
    const name = await text({
        message: "Please enter the name of the server.",
    });
    const command = await text({
        message: "Please enter the start command.",
    });
    const addEnv = await confirm({
        message: "Would you like to add environment variables?",
    }) as boolean;
    let env: Record<string, string> = {};
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
    config.addServer(name as string, { command: args[0], args: args.slice(1), env: env });
    log.success(`Successfully added ${name as string} to the config`);
}