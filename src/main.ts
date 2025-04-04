import { intro, outro, select, text, log } from "@clack/prompts";
import { Config } from "./Config";

const main = async () => {
    intro("Welcome to My Model Context");

    const client = await select({
        message: "Which config would you like to modify?",
        options: [
            { value: "claude", label: "Claude Desktop" },
        ],
    });

    const config = new Config(client as string);

    const action = await select({
        message: "What would you like to do?",
        options: [
            { value: "add", label: "Add" },
            { value: "list", label: "List" },
            { value: "remove", label: "Remove" },
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
            const args = (command as string).split(" ");
            config.addServer(name as string, { command: args[0], args: args.slice(1), env: {} });
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
    }

    config.save();

    outro("Thank you for using My Model Context");
};

main();
