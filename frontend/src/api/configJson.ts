let manager = JSON.parse(localStorage.getItem("manager") || "{}");

if (Object.keys(manager).length === 0) {
  manager = JSON.parse(localStorage.getItem("supplier") || "{}")
}

const requestConfigJson = {
  headers: {
    Authorization: "Bearer " + manager.accessToken || "",
    "Content-type": "application/json",
  },
};

export default requestConfigJson;