import { ensureChannel, getMainGuild } from "../bridge/channelFinder";
import discord from "../storages/discord";
import storage from "../storages/static";
import { setOperationChannel } from "./manager";

const OPERATION_CHANNEL_NAME = 'operation🎡'

const login = async () => {
  try {
    await discord.login(storage.botToken)
    console.log('Logged in to Discord✌')
    await getMainGuild().fetch()
    setOperationChannel(await ensureChannel(OPERATION_CHANNEL_NAME))
  } catch(e) {
    throw new Error(`Cannot log in to Discord, Discord Says : "${e.message}"`)
  }
};

export default login;
