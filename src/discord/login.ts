import { getMainGuild } from "../bridge/channelMapper";
import discord from "../storages/discord";
import storage from "../storages/static";
import { clearChannels, sendNotice, setOperationChannel } from "./manager";

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
    await clearChannels()
    console.log('초기화를 완료했습니다')
  }
  await (await getMainGuild()).fetch()
  
};

export default login;
