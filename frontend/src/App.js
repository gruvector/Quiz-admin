import "./App.css";
import { useEffect, useReducer } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllTask from "./components/AllTask";
import Layout from "./components/Layout";
import TaskContext from "./context/TaskContext";
import TokenContext from "./context/TokenContext";
import CategoryContext from "./context/CategoryContext";
import TaskIDContext from "./context/TaskIDContext";
import taskIDReducer from "./reducer/taskIDReducer";
import categoryReducer from "./reducer/categoryReducer";
import taskReducer from "./reducer/taskReducer";
import tokenReducer from "./reducer/tokenReducer";
import userReducer from "./reducer/userReducer";
import Header from "./components/Header/Header";
import Login from "./components/Login";
import UserLogin from "./components/UserLogin.jsx";
import axios from "./Axios/axios.js";
import UserManagement from "./components/UserManagement.jsx";
import UserLayout from "./components/UserLayout.jsx";
import UserTask from "./components/UserTask.jsx";
import UserAnalyze from "./components/UserAnalyze.jsx";
function App() {
  const adminToken = JSON.parse(localStorage.getItem("adminToken"));
  const usersToken = JSON.parse(localStorage.getItem("userToken"));
  const token = adminToken ? adminToken : usersToken;
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [userToken, tokenDispatch] = useReducer(tokenReducer, token);
  const [user, userDispatch] = useReducer(userReducer, {});
  const [category, categoryDispatch] = useReducer(categoryReducer, "");
  const [taskId, taskIDDispatch] = useReducer(taskIDReducer, "");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/getUser", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        tokenDispatch({ type: "SET_TOKEN", payload: res.token });
        userDispatch({ type: "SET_USER", payload: res.data.user });
      } catch (error) {
        console.log(error);
      }
    };
    if (userToken) {
      fetchUser();
    }
  }, [userToken]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/task/getTask", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        dispatch({ type: "SET_TASK", payload: res.data });
        categoryDispatch({ type: "SET_CATEGORY", payload: "" });
        taskIDDispatch({ type: "SET_TASKID", payload: "" });
      } catch (error) {
        console.log("App.js error", error);
      }
    };
    if (userToken) {
      fetchTasks();
    }
  }, [userToken]);

  return (
    <BrowserRouter>
      <TokenContext.Provider
        value={{
          userToken,
          tokenDispatch,
          user,
          userDispatch,
        }}
      >
        <TaskContext.Provider value={{ tasks, dispatch }}>
          <CategoryContext.Provider value={{ category, categoryDispatch }}>
            <TaskIDContext.Provider value={{ taskId, taskIDDispatch }}>
              <Routes>
                <Route path="/" element={<Header />}>
                  <Route
                    path="/"
                    element={usersToken ? <UserLayout /> : <UserLogin />}
                  >
                    <Route index element={<UserTask />} />
                  </Route>
                  <Route
                    path="/admin"
                    element={adminToken ? <Layout /> : <Login />}
                  >
                    <Route index element={<AllTask />} />
                  </Route>
                  <Route
                    path="/manageUser"
                    element={adminToken ? <UserManagement /> : <Login />}
                  />
                  <Route
                    path="/useranalyze"
                    element={usersToken ? <UserAnalyze /> : <UserLogin />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/userlogin" element={<UserLogin />} />
                </Route>
              </Routes>
            </TaskIDContext.Provider>
          </CategoryContext.Provider>
        </TaskContext.Provider>
      </TokenContext.Provider>
    </BrowserRouter>
  );
}

export default App;
