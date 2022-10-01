const querystring = require("querystring");

const encodeFormData = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export default async function handler(req, res) {
  let body = {
    grant_type: "authorization_code",
    code: req.query.code,
    redirect_uri: "https://ossoffy.com/api/spotify",
    client_id: "e0277669ebef40bf8218974796567372",
    client_secret: "988f70355ea546d1a12e7624e1ee4145",
  };
  const data = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: encodeFormData(body),
  });
  let query = querystring.stringify(await data.json());
  res.redirect(`https://ossoffy.com/${query}`);
}
