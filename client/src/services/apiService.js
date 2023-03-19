import axios from "axios"

export const API_URL = "http://localhost:3006";
// export const API_URL = "http://blalba.cyclic.com";

export const TOKEN_KEY = "apps_tok";

export const OPEN_AI_KEY = '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';

// for Get only
export const doApiGet = async(_url) => {
  try{
    let resp = await axios({
      url:_url,
      method: "GET",
      headers: {
        "x-api-key": localStorage[TOKEN_KEY]
      }
    })
    return resp.data;
  }
  catch(err){
    console.log(err);
    throw err;
  }
}

// For Delete , put , post , patch
export const doApiMethod = async(_url,_method,_body = {}) => {
  try{
    let resp = await axios({
      url:_url,
      method: _method,
      data:_body ,
      headers: {
        "x-api-key": localStorage[TOKEN_KEY]
      }
    })
    return resp.data;
  }
  catch(err){
    console.log(err);
   throw err;
  }
}

// בודק אם התמונה מקומית ואם כן מוסיף לה את הכתובת של השרת
export const fixImageUrl = (_imgUrl) => {
  if(!_imgUrl.includes("://")){
   return API_URL+_imgUrl;
  }
  return _imgUrl
}  