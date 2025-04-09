import { intro, outro, select } from "@clack/prompts";
import { exit } from "process";
import { load, add, list, remove, restart } from "./cli"

export const main = async () => {
    intro("Welcome to My Model Context");

    const config = await load();

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
            await add(config);
            break;
        case "list":
            await list(config);
            break;
        case "remove":
            await remove(config);
            break;
        case "restart":
            await restart(config.client);
            break;
    }

    config.save();

    outro("Thank you for using My Model Context");

    exit(0);
};
