// These should be overridden by the implementation
let user = {
  userLoggedIn: () => false,
  getUserId: () => null,
  getName: () => null,
  getAccessToken: () => {
    const urlParmasStr = window.location.search.slice(1);
    const searchParams = new URLSearchParams(urlParmasStr);
    return searchParams.get('token');
  },
  login: () => new Promise((resolve, reject) => reject()),
  logout: () => new Promise((resolve, reject) => reject()),
  getData: key => null,
  setData: (key, value) => null,
};

export default user;
