const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apikey = 'shoti-3673ed33bc8186f@b37aba4c425fa@36@e6f30c0863dae181779bad3ee08@6ae95834eb@c8d1ccdf1d21a@b5@b4dc41afe7d@b8063f202@19c1c3fbf7bf1cbb@b1cac4b2d71fabc6c1b760ac0769490baaf4e6@c50';

module.exports = {
  name: "shoti",
  usedby: 0,
  info: "Random shoti video",
  dev: "Jonell Magallanes",
  onPrefix: true,
  cooldowns: 9,

  onLaunch: async function ({ api, event, actions }) {
    try {
   const ha = global.fonts.bold("⏱️ Sending Shoti");
     const umay = await actions.reply(`${ha}\n${global.line}\nSending Shoti Please Wait.....`);
      const startTime = Date.now();

      const response = await axios.get(`https://shoti.kenliejugarap.com/getvideo.php?apikey=${apikey}`);
      
      if (response.data.status && response.data.response) {
        const videoDownloadLink = response.data.videoDownloadLink;
        const title = response.data.title;
        const tikUrl = response.data.tiktokUrl;
        const cacheDir = path.join(__dirname, 'cache');
        const filePath = path.join(cacheDir, 'video.mp4');
        actions.edit(`📝 | Server Fetched Title: ${title} and TikTok Url: ${tikUrl}`, umay.messageID, event.threadID);

        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir);
        }

        const videoStream = await axios({
          method: 'GET',
          url: videoDownloadLink,
          responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        videoStream.data.pipe(writer);

        writer.on('finish', () => {
          const endTime = Date.now(); 
          const duration = endTime - startTime; 
      const bold = global.fonts.bold("✅ Send Successfully Send");
          const msg = {
            body: `${bold}\n${global.line}\nHere’s a shoti video\n\n📝 Title: ${title}\n🔗 TikTok URL: ${tikUrl}\n\n⏱️ Latency: ${duration}ms`,
            attachment: fs.createReadStream(filePath)
          };
          api.sendMessage(msg, event.threadID);
        });
    api.unsendMessage(umay.messageID);
        writer.on('error', (error) => {
          api.sendMessage(error.message, event.threadID);
        });
      } else {
        api.sendMessage(error.message, event.threadID);
      }
    } catch (error) {
      api.sendMessage(error.message, event.threadID);
    }
  }
};
