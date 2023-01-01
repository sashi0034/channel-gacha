import { App, GenericMessageEvent } from "@slack/bolt";
import Config from "./config.json";

import SlackActionWrapper from "./slackActionWrapper";
import log4js, { getLogger } from "log4js";
import EasyReminder from "./easyReminder";
import { ChannelGacha } from "./channelGacha";

export async function processBotRoutine(){
    const app: App = new App({
        token: Config.botToken,
        appToken: Config.appToken,

        socketMode: true
    });

    const slackAction = new SlackActionWrapper(app, Config)
    await slackAction.postMessage("Initializing...")

    const channelGacha = new ChannelGacha(slackAction);

    app.event("message", async ({event, say}) =>{
        console.log(event)
        const messageEvent: GenericMessageEvent = event as GenericMessageEvent
        if (messageEvent.subtype!==undefined && messageEvent.subtype==="message_changed") return;
        if (messageEvent.subtype==="bot_message") return;

        channelGacha.postChannelInfoRandom();        
    });

    await app.start();
    channelGacha.startProcess();

    // reminder.startProcess();
    // reminder.subscribeAction(app);

    log4js.getLogger().info("Bolt app is running up.");
    await slackAction.postMessage("finish setup")
}


