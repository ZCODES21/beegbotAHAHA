const fs = require("fs");
const path = require("path");
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));

module.exports = {
    name: "help",
    usedby: 0,
    info: "display available commands",
    dev: "Marjhun Baylon",
    onPrefix: false,
    usages: "help",
    cooldowns: 10,

    onLaunch: async function ({ api, event, target }) {
        const cmdsPath = path.join(__dirname, '');
        const commandFiles = fs.readdirSync(cmdsPath).filter(file => file.endsWith('.js'));

        const visibleCommandFiles = commandFiles.filter(file => {
            const command = require(path.join(cmdsPath, file));
            return !command.hide;
        });

        const commandsPerPage = 15;
        const totalPages = Math.ceil(visibleCommandFiles.length / commandsPerPage);


        let page = target[0] ? parseInt(target[0]) : 1;


        if (!isNaN(page)) {
            if (page <= 0 || page > totalPages) {
                return api.sendMessage(`Page not found. Please choose between 1 and ${totalPages}.`, event.threadID, event.messageID);
            }

            const startIndex = (page - 1) * commandsPerPage;
            const endIndex = Math.min(startIndex + commandsPerPage, visibleCommandFiles.length);

            let helpMessage = `╭─『 𝐓𝐎𝐒𝐇𝐈𝐀 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 』\n`;
            const displayedCommands = visibleCommandFiles.slice(startIndex, endIndex);

            displayedCommands.forEach(file => {
                const commandInfo = require(path.join(cmdsPath, file));
                helpMessage += `│✧ ${commandInfo.name || "Unknown"}\n`;
            });

            helpMessage += `╰───────────◊\n\n(Page ${page}/${totalPages})\nType ${adminConfig.prefix}help <page number> to see more commands.\n\nDev: ${adminConfig.ownerName}`;

            return api.shareContact(helpMessage, api.getCurrentUserID(), event.threadID);
        }


        if (target[0]) {
            const commandName = target[0];
            const commandFile = commandFiles.find(file => file === `${commandName}.js`);
            if (commandFile) {
                const commandInfo = require(path.join(cmdsPath, commandFile));
                const permissionText = commandInfo.usedby === undefined ? "Unknown" :
                                       commandInfo.usedby === 0 ? "Member" :
                                       commandInfo.usedby === 1 ? "Admin Group" :
                                       commandInfo.usedby === 2 ? "Global Admin" :
                                       commandInfo.usedby === 3 ? "Moderator" :
                                       commandInfo.usedby === 4 ? "Admin and Moderator" : "Unknown";

                const helpMessage = `╭─『 ${commandInfo.name || "Unknown"} 』\n` +
                    `│✧ Name: ${commandInfo.name || "Unknown"}\n` +
                    `│✧ Permission: ${permissionText}\n` +
                    `│✧ Developer: ${commandInfo.dev || "Unknown"}\n` +
                    `│✧ Cooldown: ${commandInfo.cooldowns || "Unknown"} seconds\n` +
                    `│✧ Description: ${commandInfo.info || "Unknown"}\n` +
                    `│✧ Need Prefix: ${commandInfo.onPrefix !== undefined ? commandInfo.onPrefix : "Unknown"}\n` +
                    `╰───────────◊`;
                return api.shareContact(helpMessage, api.getCurrentUserID(), event.threadID);
            } else {
                return api.sendMessage(`Command "${commandName}" not found.`, event.threadID);
            }
        }
    }
};
