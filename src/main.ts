import { intro, outro, select, text, log, spinner, password, confirm } from "@clack/prompts";
import { Config } from "./Config";
import { exit } from "process";

export const main = async () => {
    intro("Welcome to My Model Context");

    const client = await select({
        message: "Which config would you like to modify?",
        options: [
            { value: "claude", label: "Claude Desktop" },
            { value: "cursor", label: "Cursor" },
        ],
    });

    const config = new Config(client as string);

    const action = await select({
        message: "What would you like to do?",
        options: [
            { value: "add", label: "Add" },
            { value: "list", label: "List" },
            { value: "remove", label: "Remove" },
            { value: "restart", label: "Restart" },
        ],
    });

    switch (action) {
        case "add":
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
            break;
        case "list":
            const list = config.listServers();
            if (Object.keys(list).length === 0) {
                log.warn("No servers found");
            } else {
                log.info(Object.keys(list).join("\n"));
            }
            break;
        case "remove":
            const servers = config.listServers();
            const options = Object.entries(servers).map(([key]) => ({ value: key, label: key }));
            const server = await select({
                message: "Please select the server to remove.",
                options,
            });
            config.removeServer(server as string);
            log.success(`Successfully removed ${server as string} from the config`);
            break;
        case "restart":
            const loading = spinner();
            loading.start("Restarting");
            switch (client) {
                case "claude":
                    Bun.spawn(["killall", "Claude"]);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    Bun.spawn(["open", "-a", "Claude"]);
                    break;
                case "cursor":
                    break;
                default:
                    throw new Error("Unsupported MCP client");
            }
            loading.stop("Success");
            break;
    }

    config.save();

    outro("Thank you for using My Model Context");

    exit(0);
};
