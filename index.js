// const Discord = require("discord.js");
// const { prefix, token } = require("./config.json"); //vzima prefixa ot config faila.
// const ytdl = require("ytdl-core");
// var fs = require("fs");

// const client = new Discord.Client();
// const queue = new Map();

// var welcomeScreen = {
//     Suzdateli: "Suzdaden ot Yordan Zheleff i Ivan Dukov",
//     Komandi: "Vuzmojnite komandi sa : \n!!pusni skandau \n!!skip  \n!!stop"
// }

// function Songs(id,name,link) {
//   this.id = id;
//   this.name = name;
//   this.link = link;
// }

// try {
//     const data = fs.readFileSync('database.conf', 'UTF-8');
//     var mySongs = []; // array ot songs obekti
//     var counter = 0; // sluji za id
//     const lines = data.split(/\r?\n/);    
//     for (let i = 0; i < lines.length; i+=2) {
//         mySongs.push(new Songs(counter,lines[i+1],lines[i]));
//         counter++;       
//     }
//     console.log(mySongs);
// } catch (err) {
//     console.error(err);
// }

// // Client events
// client.once("ready", () => {
//   console.log("Ready!");
// });

// client.once("reconnecting", () => {
//   console.log("Reconnecting!");
// });

// client.once("disconnect", () => {
//   console.log("Disconnect!");
// });

// var checkCavierStatus;

// client.on("message", async message => {
//     if (message.content === 'oaoeo') {
//         message.channel.send('OAOEO.')
//         checkCavierStatus = true;
//     }
//     if (message.author.bot) return;
//   //if (!message.content.startsWith(prefix)) return;

//   const serverQueue = queue.get(message.guild.id);
  
//   //TODO: nastroeniq

//   if (message.content.startsWith(`${prefix}pusni skandau`)) {
//     execute(message, serverQueue,false);
//     return;
//   } else if (message.content.startsWith(`${prefix}skip`)) {
//     skip(message, serverQueue,false);
//     return;
//   } else if (message.content.startsWith(`${prefix}stop`)) {
//     stop(message, serverQueue,false);
//     return;
//   }   
//   else if (message.content.startsWith(`${prefix}help`)){
//       message.channel.send(welcomeScreen.Suzdateli + '\n' +welcomeScreen.Komandi);
//   }
  
//     else if(checkCavierStatus == true){
//         execute(message, serverQueue,true);
//         return;
//       } 
//    else {
//     message.channel.send("You need to enter a valid command!");
//   }
// });

// async function execute(message, serverQueue,isCavier) {
//   const args = message.content.split(" ");

//   console.log(args);
//   console.log(isCavier);

//   const voiceChannel = message.member.voice.channel;
//   if (!voiceChannel)
//     return message.channel.send(
//       "You need to be in a voice channel to play music!"
//     );
//   const permissions = voiceChannel.permissionsFor(message.client.user);
//   if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
//     return message.channel.send(
//       "I need the permissions to join and speak in your voice channel!"
//     );
//   }

//   if(isCavier == false) {
//     var songInfo = await ytdl.getInfo(mySongs[Math.floor(Math.random()* mySongs.length)].link);
//   }
//   else if (isCavier == true) {
//     var songInfo = await ytdl.getInfo(mySongs[0].link);
//   }
  
//   const song = {
//     title: songInfo.title,
//     url: songInfo.video_url
//   };

//   if (!serverQueue) {
//     const queueContruct = {
//       textChannel: message.channel,
//       voiceChannel: voiceChannel,
//       connection: null,
//       songs: [],
//       volume: 5,
//       playing: true
//     };

//     queue.set(message.guild.id, queueContruct);

//     queueContruct.songs.push(song);

//     try {
//       var connection = await voiceChannel.join();
//       queueContruct.connection = connection;
//       play(message.guild, queueContruct.songs[0]);
//     } catch (err) {
//       console.log(err);
//       queue.delete(message.guild.id);
//       return message.channel.send(err);
//     }
//   } else {
//     serverQueue.songs.push(song);
//     return message.channel.send(`${song.title} has been added to the queue!`);
//   }
// }

// function skip(message, serverQueue) {
//   if (!message.member.voice.channel)
//     return message.channel.send(
//       "You have to be in a voice channel to stop the music!"
//     );
//   if (!serverQueue)
//     return message.channel.send("There is no song that I could skip!");
//   serverQueue.connection.dispatcher.end();
// }

// function stop(message, serverQueue) {
//   if (!message.member.voice.channel)
//     return message.channel.send(
//       "You have to be in a voice channel to stop the music!"
//     );
//   serverQueue.songs = [];
//   serverQueue.connection.dispatcher.end();
// }

// function play(guild, song) {
//   const serverQueue = queue.get(guild.id);
//   if (!song) {
//     serverQueue.voiceChannel.leave();
//     queue.delete(guild.id);
//     return;
//   }

//   const dispatcher = serverQueue.connection
//     .play(ytdl(song.url))
//     .on("finish", () => {
//       serverQueue.songs.shift();
//       play(guild, serverQueue.songs[0]);
//     })
//     .on("error", error => console.error(error));
//   dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
//   serverQueue.textChannel.send(`Start playing: **${song.title}**`);
// }

// client.login(token);

const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const yts = require('yt-search');

const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
    console.log("Ready!");
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    } else {
        message.channel.send("You need to enter a valid command!");
    }
});

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

   
    let songs = ["haivera", "skandau no", "ciganska svatba"];
    let getRandomSongName = songs[Math.floor(Math.random() * songs.length)];

    let getSongUrl = await yts(getRandomSongName, function (err, r) {
        console.log(r.videos[0]);
        return r.videos[0].url
    });

    console.log(getSongUrl);

    const songInfo = await ytdl.getInfo(getSongUrl);

    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(
            `${song.title} has been added to the queue!`
        );
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login(token);