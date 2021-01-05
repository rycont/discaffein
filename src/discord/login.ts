import { TextChannel } from "discord.js";
import { ensureCategory, ensureChannel, getMainGuild } from "../bridge/channelMapper";
import config from "../storages/config";
import discord from "../storages/discord";
import storage from "../storages/static";
import { setOperationChannel } from "./manager";

const OPERATION_CHANNEL_NAME = 'operation🎡'

const login = async () => {
  try {
    await discord.login(storage.botToken)
    console.log('Logged in to Discord✌')
    await (await getMainGuild()).fetch()
    setOperationChannel(await ensureChannel(OPERATION_CHANNEL_NAME, {
      parent: await ensureCategory(config.OPERATION_CATEGORY_NAME),
      type: 'text'
    }) as TextChannel)
  } catch(e) {
    throw new Error(`Cannot log in to Discord, Discord Says : "${e.message}"`)
  }
};

export default login;
