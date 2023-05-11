import axios from "axios"

export const API_URL = "http://localhost:3008";
// export const API_URL = "http://blalba.cyclic.com";

export const TOKEN_KEY = "apps_tok";

export const OPEN_AI_KEY = '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';

export const REQUSET_RESET_PASSWORD = API_URL + '/users/requestPasswordReset'
export const RESET_PASSWORD = API_URL + '/users/resetPassword'

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

export const doApiPost = async(_url, _body = {}) => {
  console.log(JSON.stringify(_body));

  try {
      let resp = await axios({
          url: _url,
          method: 'POST',
          data: JSON.stringify(_body),
          headers: {
              "x-api-key": localStorage[TOKEN_KEY],
              'Content-Type': "application/json"

          }
      })
      return resp;
  } catch (err) {
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

export const apiPostGPT = async (_url, _body = {}) => {
  try {
      let resp = await axios({
          url: _url,
          method: 'POST',
          data: JSON.stringify(_body),
          headers: {
               "Content-Type": "application/json" ,
               "Authorization": `Bearer ${OPEN_AI_KEY}` 
          }
      })
      return resp;
  } catch (err) {
      throw err;
  }
}

export const updateUserScoresByCat = async (userId, cat, right, wrong) => {
  // const token = localStorage.getItem(TOKEN_KEY);
  // if (!token) {
  //   console.error("Token not found in local storage");
  //   return;
  // }

  const response = await fetch(API_URL + "/users/updateScoresByCat", {
    method: "POST",
    headers: {
      "x-api-key": localStorage[TOKEN_KEY],
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, cat, right, wrong }),
  });
  
  const data = await response.json();
  return data;
};


// Add this function to your API helper file
export const updateUserWrongIds = async (userId, questionId) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.error("Token not found in local storage");
    return;
  }

  const response = await fetch(API_URL + "/users/updateWrongIds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token // Use token here, not TOKEN_KEY
    },
    body: JSON.stringify({ userId, questionId }),
  });

  const data = await response.json();
  return data;
};

export const removeFromUserWrongIds = async (userId, questionId) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.error("Token not found in local storage");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/${userId}/wrong_ids/${questionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error removing question ID from user's wrong_ids:", error);
    throw error;
  }
};




// בודק אם התמונה מקומית ואם כן מוסיף לה את הכתובת של השרת
export const fixImageUrl = (_imgUrl) => {
  if(!_imgUrl.includes("://")){
   return API_URL+_imgUrl;
  }
  return _imgUrl
}  