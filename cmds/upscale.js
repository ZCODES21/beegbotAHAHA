const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  name: "upscale",
  usedby: 0,
  onPrefix: false,
  dev: "Marjhun Baylon",
  cooldowns: 2,

  onLaunch: async function ({ api, event, target }) {
    const pathie = './cmds/cache/enhanced.jpg';
    const { threadID, messageID } = event;

    const james = event.messageReply.attachments[0].url || target.join(" ");

    try {
      const hshs = await api.sendMessage("⏱️ | 𝐄𝐍𝐇𝐀𝐍𝐂𝐈𝐍𝐆 𝐓𝐇𝐄 𝐏𝐇𝐎𝐓𝐎", threadID, messageID);

      const response = await axios.get(`https://hiroshi-api.onrender.com/image/upscale?url=${encodeURIComponent(james)}`);
      const processedImageURL = response.data; 

      const imgResponse = await axios.get(processedImageURL, { responseType: 'stream' });
      const writer = fs.createWriteStream(pathie);
      imgResponse.data.pipe(writer);

      writer.on('finish', () => {
        api.unsendMessage(hshs.messageID);
        api.sendMessage({
          body: "🖼️ | 𝐏𝐇𝐎𝐓𝐎 𝐄𝐍𝐇𝐀𝐍𝐂𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘",
          attachment: fs.createReadStream(pathie)
        }, threadID, () => fs.unlinkSync(pathie), messageID);
      });

      writer.on('error', (error) => {
        api.sendMessage(`❎ | Error writing image to file: ${error}`, threadID, messageID);
      });

    } catch (error) {
      api.sendMessage(`❎ | Error processing image: ${error}`, threadID, messageID);
    }
  }
};
