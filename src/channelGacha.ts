
import { connectLines, getDateString, randomInt, sleepSeconds } from "./util";
import config from "./config.json"
import SlackActionWrapper, { SlackChannel } from "./slackActionWrapper";
import { getContentsBlock } from "./mssageBlock";
import { getLogger } from "log4js";


export class ChannelGacha{
    private receivedChannelList: SlackChannel[] = []

    public constructor(
        private readonly slackAction: SlackActionWrapper
    ){}

    public async startProcess(){
        while (true){
            this.receivedChannelList = await this.slackAction.fetchAllChannels();
            getLogger().log("received channels: " + this.receivedChannelList.length);

            await this.postChannelInfoRandom();
            await sleepSeconds(config.announceInterval);
        }
    }

    public async postChannelInfoRandom(){
        if (this.receivedChannelList.length === 0) return;

        const channel = this.receivedChannelList[randomInt(this.receivedChannelList.length)];
        
        getLogger().info(channel);

        const content = getContentsBlock(
            channel.name as string,
            connectLines([
                `:house:    <#${channel.id}>`,
                `:people_holding_hands:    ${channel.num_members}`,
            ]), [
                `${channel.purpose?.value}`,
                `${channel.topic?.value}`
            ]);
        
        await this.slackAction.postBlockText(
            config.targetChannel,
            channel.name as string,
            content);
    }
}

