import { TalkClient } from "node-kakao";
import storage from "../storages/static";
const kakao = new TalkClient(storage.name, storage.uuid);
export default kakao;