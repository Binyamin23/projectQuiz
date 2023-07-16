export const FAVS_LOCAL_KEY = "starredQuestions";

const localFav_ar = localStorage[FAVS_LOCAL_KEY] ? JSON.parse(localStorage[FAVS_LOCAL_KEY]) : [];

// פונקציה שמוסיפה ללוקאל איי די למערך הלוקאלי
export const addIdToFavLocal = (_id) => {
  localFav_ar.push(_id);
  localStorage.setItem(FAVS_LOCAL_KEY,JSON.stringify(localFav_ar));
}

export const getLocal = () => {
  const localFav_ar = localStorage[FAVS_LOCAL_KEY] ? JSON.parse(localStorage[FAVS_LOCAL_KEY]) : [];
  return localFav_ar;
}


// מוחק איי די מהלוקאל
// מוחק איי די מהלוקאל
export const removeIdFromLocal = (_id) => {
  const localFav_ar = getLocal();
  let favIDIndex = localFav_ar.findIndex(val => val == _id)
  if (favIDIndex !== -1) {
    localFav_ar.splice(favIDIndex, 1);
    localStorage.setItem(FAVS_LOCAL_KEY, JSON.stringify(localFav_ar));
  }
}
