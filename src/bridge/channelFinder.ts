import { Guild, TextChannel } from "discord.js";
import discord from "../storages/discord";
import { ChatChannel, Long } from "node-kakao";
import DB from "../db";
import { kakao } from "../kakao";

interface ChannelBridge {
    kakaoid: string;
    discordid: string;
}
export const findChannelByName = (name: string) => {
    return getMainGuild().channels.cache.find((channel) => channel.name.split('-').join('_') === name.split(' ').join('_').split('-').join('_'))
}
let discordMainguild: Guild

export const getMainGuild = () => {
    if(discordMainguild) return discordMainguild

    const cachedGuilds = discord.guilds.cache
    const guild = cachedGuilds.get(cachedGuilds.keyArray()[0])
    if(!guild) throw new Error("봇이 어느 서버에도 소속되어있지 않습니다")
    discordMainguild = guild
    return discordMainguild
}

export const ensureChannel = async (name: string) => {
    const exist = findChannelByName(name) as TextChannel
    if(exist) return exist
    
    const newChannel = await getMainGuild().channels.create(name)
    return newChannel
}

export const k2d = async (kakaoChannel: ChatChannel): Promise<TextChannel> => {
    const doc = await DB.findOne<ChannelBridge>({
        kakaoid: kakaoChannel.Id.toString()
    })
    if(doc) {
        const mapped = getMainGuild().channels.cache.get(doc.discordid) as TextChannel
        if(mapped) return mapped
    }
    const newDiscordChannel = await getMainGuild().channels.create(kakaoChannel.getDisplayName())
    DB.insert<ChannelBridge>({
        discordid: newDiscordChannel.id,
        kakaoid: kakaoChannel.Id.toString()
    })
    return newDiscordChannel
}

export const d2k = async (discordChannel: TextChannel): Promise<ChatChannel> => {
    const doc = await DB.findOne<ChannelBridge>({
        discordid: discordChannel.id
    })
    
    if(!doc.kakaoid) throw new Error(`Cannot Find Channel Id : ${discordChannel.id}`)

    const mapped = kakao.ChannelManager.get(Long.fromString(doc.kakaoid))
    if(!mapped) throw new Error(`Cannot Load Channel : ${discordChannel.id}`)
    return mapped
}