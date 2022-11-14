import HandlerError from "../Utils/HandlerError";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      me: {},
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      token: "",
    },
    actions: {
      // Use getActions to call a function within a fuction
      request: async (path, params) => {
        try {
          const res = await fetch(process.env.BACKEND_URL + path, {
            method: params.method,
            headers: { "Content-Type": "application/json" },
            body: params.body,
          });
          if (!res.ok) {
            const { message } = await res.json();
            HandliferError(message, "error");
            throw error(`${message}`);
          }
          const body = await res.json();
          HandlerError(body.message, "success");
          return body.data;
        } catch ({ error }) {
          HandlerError(error);
          return error;
        }
      },
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },
      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      saveUserInfo: (data) => {
        const store = getStore();
        setStore({ me: data });
      },
      getUserInfo: async function () {
        const actions = getActions();
        try {
          const response = await request({
            method: "GET",
            path: "/api/user",
            customHeaders: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          actions.saveUserInfo(response);
        } catch (error) {
          window.location.pathname = "/";
          actions.logout();
          console.log(error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
