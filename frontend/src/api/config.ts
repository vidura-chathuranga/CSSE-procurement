const manager = JSON.parse(localStorage.getItem("manager") || "{}");

const requestConfig = {
  headers: {
    Authorization: "Bearer " + manager.accessToken || "",
    "Content-type": "multipart/form-data",
  },
};

export default requestConfig;