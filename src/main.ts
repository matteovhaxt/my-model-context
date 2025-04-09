import { intro, outro, select } from "@clack/prompts";
import { exit } from "process";
import { load, add, list, remove, restart } from "./cli"

export const main = async () => {
    intro("Welcome to My Model Context");

    const config = await load();
    
    let shouldExit = false;

    while (!shouldExit) {
        const action = await select({
            message: "What would you like to do?",
            options: [
                { value: "add", label: "Add" },
                { value: "list", label: "List" },
                { value: "remove", label: "Remove" },
                { value: "restart", label: "Restart" },
                { value: "exit", label: "Exit" },
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
            case "exit":
                shouldExit = true;
                break;
        }

        await config.save();
    }

    outro("Thank you for using My Model Context");

    exit(0);
};
