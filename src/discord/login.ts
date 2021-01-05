import { TextChannel } from "discord.js";
import { ensureCategory, ensureChannel, getMainGuild } from "../bridge/channelMapper";
import config from "../storages/config";
import discord from "../storages/discord";
import storage from "../storages/static";
import { clearChannelsAndRoles, sendNotice, setOperationChannel } from "./manager";

const OPERATION_CHANNEL_NAME = 'operation🎡'

const login = async ({
  clearData
} : {
  clearData?: boolean;
} = {}) => {
  try {
    await discord.login(storage.botToken)
  } catch(e) {
    throw new Error(`Cannot log in to Discord, Discord Says : "${e.message}"`)
  }

  console.log('Logged in to Discord✌')
  if(clearData) {
    console.log('디스코드 동기화정보를 초기화중입니다')
    await clearChannelsAndRoles()
    console.log('초기화를 완료했습니다')
  }
  await (await getMainGuild()).fetch()
  setOperationChannel(await ensureChannel(OPERATION_CHANNEL_NAME, {
    parent: await ensureCategory(config.OPERATION_CATEGORY_NAME),
    type: 'text'
  }) as TextChannel)
};

export default login;
