import React, { Component } from "react";
import { Typography } from "antd";

const { Text } = Typography;

class Index extends Component {
  state = { width: 0, height: 0 };

  componentDidMount = async () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    const setupMusicKit = new Promise((resolve) => {
      document.addEventListener("musickitloaded", () => {
        MusicKit.configure({
          developerToken:
            "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilk2S0RMRjRUQUEifQ.eyJpYXQiOjE2MDc3MjcxMDQsImV4cCI6MTYyMzI3OTEwNCwiaXNzIjoiQVUyNU1WTDlKOSJ9.k1sGApTteW91wBYB8fUEW4erkiuRDEF9O02IAXj6GpRqFjmtwpogRspvbYPOwYVnBKj_OZxfaLXVnYB4F6S8Vg",
          app: {
            name: "MusicKit Web App",
            build: "1.0.0",
          },
        });
        resolve();
      });
    });
    await setupMusicKit;
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  getSpotify = () => {
    const scopes =
      "user-read-private user-read-email playlist-read-collaborative playlist-read-private";

    return (
      "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=e0277669ebef40bf8218974796567372" +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent("https://ossoffy.com/api/spotify")
    );
  };

  handleApple = async () => {
    let musicKit = MusicKit.getInstance();
    await musicKit.authorize();

    window.location.href = "/apple";
  };

  render() {
    return (
      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src="/ossoffy_logo.png" style={{ width: 100 }} />
              <Text
                style={{
                  fontSize: 50,
                  color: "black",
                  marginLeft: 20,
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}
                strong
              >
                Ossoffy
              </Text>
            </div>
            <div
              style={{
                textAlign: "center",
                width: this.state.width >= 600 ? 600 : "100%",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "black",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  fontStyle: "italic",
                }}
              >
                We turn your Spotify playlists into newspapers.
              </Text>
            </div>
          </div>
        </div>

        <div
          style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
        >
          <img
            src="/ossoffy_template.png"
            style={{
              width: this.state.width >= 342 ? 360 : 270,
              height: this.state.width >= 342 ? 608 : 480,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            style={{
              padding: "5px 10px 5px 10px",
              borderRadius: 5,
              backgroundColor: "#1DB954",
              borderRadius: 10,
              borderWidth: 0,
              width: 275,
            }}
          >
            <a
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              href={this.getSpotify()}
            >
              <img
                src="spotify.png"
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}
                strong
              >
                Login With Spotify
              </Text>
            </a>
          </button>

          <button
            style={{
              padding: "5px 10px 5px 10px",
              borderRadius: 10,
              backgroundColor: "#fa243c",
              marginTop: 10,
              borderWidth: 0,
              width: 275,
            }}
          >
            <a
              onClick={this.handleApple}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="apple.png"
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: "white",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}
                strong
              >
                Login With Apple Music
              </Text>
            </a>
          </button>
        </div>

        <div
          style={{
            marginTop: 40,
            marginBottom: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>
            Created by{" "}
            <a href="https://memepac.org" target="_blank">
              <Text strong style={{ color: "#407294" }}>
                MemePAC
              </Text>
            </a>
          </Text>
        </div>
      </div>
    );
  }
}

export default Index;
