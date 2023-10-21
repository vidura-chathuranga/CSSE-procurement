let manager = JSON.parse(localStorage.getItem("manager") || "{}");

if(Object.keys(manager).length === 0){
  manager = JSON.parse(localStorage.getItem("supplier")|| "{}")
}


const requestConfig = {
  headers: {
    Authorization: "Bearer " + manager.accessToken || "",
    "Content-type": "multipart/form-data",
  },
};

export default requestConfig;