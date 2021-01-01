// import { AuthClient } from "node-kakao";
import kakao from "../storages/kakao";
import storage from "../storages/static";

// const auth = new AuthClient(storage.name, storage.uuid,)


const requestVerifCode = async () => {
  const request = await kakao.Auth.requestPasscode(storage.email, storage.pw);
  console.log(request);
};

export default requestVerifCode;
