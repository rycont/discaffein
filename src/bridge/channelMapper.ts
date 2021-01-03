import { CategoryChannel, Guild, GuildCreateChannelOptions, TextChannel } from "discord.js";
import discord from "../storages/discord";
import { ChatChannel, Long } from "node-kakao";
import DB from "../db";
import { kakao } from "../kakao";
import config from "../storages/config";

export interface Bridge {
    kakaoid: string;
    discordid: string;
}

export const findChannelByName = (name: string) => {
    return getMainGuild().channels.cache.find((channel) => channel.name === name)
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

export const ensureChannel = async (name: string, config?: GuildCreateChannelOptions) => {
    const exist = findChannelByName(name) as TextChannel
    if(exist) return exist
    
    const newChannel = await getMainGuild().channels.create(name, config || {})
    return newChannel
}

export const ensureCategory = async (name: string) => {
    const premade = getMainGuild().channels.cache.find((channel) => channel.type === 'category' && channel.name === name) as CategoryChannel | undefined
    if(premade) return premade
    
    const createdCategory = await getMainGuild().channels.create(name, {
        type: 'category'
    })
    
    return createdCategory
}

export const k2d = async (kakaoChannel: ChatChannel): Promise<TextChannel> => {
    const doc = await DB.findOne<Bridge>({
        kakaoid: kakaoChannel.Id.toString()
    })
    if(doc) {
        const mapped = getMainGuild().channels.cache.get(doc.discordid) as TextChannel
        if(mapped) return mapped
    }
    
    const newDiscordChannel = await getMainGuild().channels.create(kakaoChannel.getDisplayName(), {
        parent: await ensureCategory(config.CHAT_CATEGORY_NAME)
    })
    // console.log(getChatCategory())
    DB.insert<Bridge>({
        discordid: newDiscordChannel.id,
        kakaoid: kakaoChannel.Id.toString()
    })
    return newDiscordChannel
}

export const d2k = async (discordChannel: TextChannel): Promise<ChatChannel> => {
    const doc = await DB.findOne<Bridge>({
        discordid: discordChannel.id
    })
    
    if(!doc.kakaoid) throw new Error(`Cannot Find Channel Id : ${discordChannel.id}`)

    const mapped = kakao.ChannelManager.get(Long.fromString(doc.kakaoid))
    if(!mapped) throw new Error(`Cannot Load Channel : ${discordChannel.id}`)
    return mapped
}