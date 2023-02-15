import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthClient from '../../comps_general/authClient';
import Loading from '../../comps_general/loading';
import PagesComp from '../../comps_general/pagesComp';
import { API_URL, doApiGet, doApiMethod } from "../../services/apiService"

export default function UserGamesAddedList() {
  const [getQuery] = useSearchParams();
  const [ar, setAr] = useState([]);
  const [loading, setLoading] = useState(false);
  // סטייט שמכיל את המידע של המשתמש
  const [user,setUser] = useState({})
  const nav = useNavigate();

  // נאסוף את מספר העמוד כדי שנוכל למספר את האינדקס
  // ככה שמעמוד 2 נראה 6,7,8
  let page = getQuery.get("page") || 1;

  useEffect(() => {
    setLoading(true);
    doApi();
  }, [getQuery])

  const doApi = async () => {
    // שאילתא בשביל לקבל מידע על המשתשש
    let userDataUrl = API_URL + "/users/checkToken";
    let userData = await doApiGet(userDataUrl);
    // הגדרתי את המידע כדי שנוכל לדעת כמה עמודים להציג
    setUser(userData);
    console.log(userData);

    let perPage = getQuery.get("perPage") || 5;
    let page = getQuery.get("page") || 1;

    // &userId -> דאגנו לקבל את המוצרים של אותו משתמש בלבד
    let url = `${API_URL}/gamesApps?page=${page}&perPage=${perPage}&userId=${userData._id}`;
    // let url = API_URL + "/gamesApps";
    try {
      let data = await doApiGet(url);
      console.log(data);
      setAr(data);
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      alert("There problem , come back late")
    }
  }

  const onXClick = async (_delId) => {
    if (!window.confirm("Delete app?")) {
      return;
    }
    let url = API_URL + "/gamesApps/" + _delId;
    try {
      let data = await doApiMethod(url, "DELETE");
      if (data.deletedCount) {
        toast.warning("app/game deleted")
        // alert("app/game deleted");
        doApi();
      }
    }
    catch (err) {
      console.log(err)
      alert("There problem , come back late")
    }
  }

  return (
    <div className='container mt-3'>
      <AuthClient />
      <h2>List of apps/games that add by your user</h2>
      <Link to="/userGameList/add" className='btn btn-dark'>Add new App/Game</Link>
      {!loading && ar.length == 0 && <h4 className='mt-5'>You not added any app yet !</h4>}
      {/* apiPages-> בקשה כדי שיחזיר כמות ומספר עמודים */}
      {/* <PagesComp apiPages={API_URL+"/gamesApps/count?perPage=5"} linkTo={"/admin/apps?page="} linkCss={"btn btn-warning me-2"} /> */}
     
      <PagesComp apiPages={`http://localhost:3002/gamesApps/count?perPage=5&userId=${user._id}`} linkTo="/userGameList?page=" linkCss="btn btn-warning me-1" />

      {loading && <Loading />  }
     
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Info</th>
            <th>Category</th>
            <th>Date</th>
            <th>Del</th>
          </tr>
        </thead>
        <tbody>
          {ar.map((item, i) => {
            let myDate = item.date.substring(0, 10);
            // myDate = myDate.replaceAll("T"," ")
            return (
              <tr key={item._id}>
                {/* כדי לגרום למספור להשתנות בין עמודים */}
                <td>{i + 1 + ((page-1) * 5) }</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td title={item.info}>{item.info.substring(0, 15)}...</td>
                <td>{item.category_url}</td>
                <td>{myDate}</td>
                <td>
                  <button onClick={() => {
                    onXClick(item._id)
                  }} className='bg-danger me-2'>X</button>
                  <button onClick={() => {
                    nav("/userGameList/edit/" + item._id)
                  }} className='bg-warning'>Edit</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
