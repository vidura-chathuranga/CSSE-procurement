const manager = JSON.parse(localStorage.getItem("manager") || "{}");

const requestConfigJson = {
  headers: {
    Authorization: "Bearer " + manager.accessToken || "",
    "Content-type": "application/json",
  },
};

export default requestConfigJson;