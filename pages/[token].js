import React, { Component } from "react";
import { Typography, Card, Modal } from "antd";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import Router from "next/router";
import { ossoffy } from "../components/functions";

const { Text } = Typography;

class Spotify extends Component {
  state = {
    width: 0,
    height: 0,
    visible: false,
    ossoffied: "",
    selected: "",
  };

  static getInitialProps = async ({ res, query: { token } }) => {
    try {
      const {
        data: { items: playlists },
      } = await axios.get("https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: {
          Authorization: `Bearer ${token.substring(token.indexOf("=") + 1)}`,
        },
      });
      return { playlists, token };
    } catch (e) {
      res.writeHead(302, {
        Location: "/",
      });
      res.end();
      return {};
    }
  };

  componentDidMount = async () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  getPlaylistName = (name) => {
    let finalName = name;
    if (name.length > 50) {
      finalName = name.substring(0, 50);
      finalName += "...";
    }
    return finalName;
  };

  handleModal = async () => {
    this.setState({ visible: true, loading: true });
    try {
      const {
        data: {
          tracks: { items },
          images,
          name,
        },
      } = await axios.get(
        `https://api.spotify.com/v1/playlists/${this.state.selected}`,
        {
          headers: {
            Authorization: `Bearer ${this.props.token.substring(
              this.props.token.indexOf("=") + 1
            )}`,
          },
        }
      );
      const songs = [];
      const shortened = items.splice(0, 25);
      shortened.map(({ track }) => {
        songs.push(`• ${track.name} - ${track.artists[0].name}`);
      });
      const artwork = images.length > 0 ? images[0].url : "/blank.png";
      ossoffy(this.refs.newspaper, name, artwork, songs, this.refs.ossoff, () =>
        this.setState({
          loading: false,
          ossoffied: this.refs.ossoff.toDataURL(),
        })
      );
    } catch (e) {
      console.log(e);
      Router.push("/");
    }
  };

  render() {
    return (
      <div>
        <Modal
          centered
          visible={this.state.visible}
          onCancel={() =>
            this.setState({ visible: false, ossoffied: "", selected: "" })
          }
          footer={null}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              padding: 20,
            }}
          >
            <img
              src={
                this.state.ossoffied
                  ? this.state.ossoffied
                  : "/ossoffy_template.png"
              }
              style={{
                width: "100%",
                height: "auto",
              }}
            />
            {this.state.ossoffied ? (
              <div style={{ marginTop: 20 }}>
                <button
                  style={{
                    padding: "5px 10px 5px 10px",
                    borderWidth: 0,
                    backgroundColor: "#1DB954",
                    borderRadius: 10,
                  }}
                >
                  <a href={this.state.ossoffied} download="ossoffied">
                    <Text
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, sans-serif",
                      }}
                      strong
                    >
                      Download
                    </Text>
                  </a>
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18 }} strong>
                  Loading...
                </Text>
                <PacmanLoader style={{ fontSize: 50 }} color="#1DB954" />
              </div>
            )}
          </div>
        </Modal>
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
                Please click on a playlist.
              </Text>
            </div>
          </div>
        </div>

        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <div style={{ width: "80%" }}>
            {this.props.playlists.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexFlow: "row wrap",
                }}
              >
                {this.props.playlists.map((playlist) => {
                  return (
                    <div
                      style={{
                        margin: 10,
                        width: this.state.width >= 800 ? 200 : 150,
                      }}
                      key={playlist.id}
                    >
                      <Card
                        bodyStyle={{
                          padding: 0,
                        }}
                        hoverable={this.state.selected != playlist.id}
                        onClick={() =>
                          this.setState({
                            selected: playlist.id,
                          })
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            width: this.state.width >= 800 ? 200 : 150,
                            height: this.state.width >= 800 ? 200 : 150,
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <img
                              src={
                                playlist.images.length > 0
                                  ? playlist.images[0].url
                                  : "/blank.png"
                              }
                              style={{
                                objectFit: "cover",
                                height: "100%",
                                width: "100%",
                                filter:
                                  this.state.selected == playlist.id
                                    ? "grayscale(100%)"
                                    : null,
                              }}
                            />
                            {this.state.selected == playlist.id ? (
                              <button
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  padding: "5px 10px 5px 10px",
                                  borderRadius: 10,
                                  backgroundColor: "#1DB954",
                                  borderWidth: 0,
                                }}
                                onClick={this.handleModal}
                              >
                                <a>
                                  <Text
                                    style={{
                                      fontSize:
                                        this.state.width >= 800 ? 18 : 12,
                                      color: "white",
                                      fontFamily:
                                        "-apple-system, BlinkMacSystemFont, sans-serif",
                                    }}
                                    strong
                                  >
                                    Ossoffy It!
                                  </Text>
                                </a>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </Card>
                      <div style={{ marginTop: 5 }}>
                        <a
                          style={{
                            fontSize: 14,
                            color: "black",
                            fontWeight: "bold",
                            textDecoration: this.state[playlist.id]
                              ? "underline"
                              : null,
                          }}
                          onMouseEnter={() => {
                            this.setState({
                              [playlist.id]: true,
                            });
                          }}
                          onMouseLeave={() =>
                            this.setState({
                              [playlist.id]: false,
                            })
                          }
                          onClick={() =>
                            this.setState({
                              selected: playlist.id,
                            })
                          }
                        >
                          {this.getPlaylistName(playlist.name)}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Text style={{ fontSize: 24 }} strong>
                  You have no playlists...Make one in Spotify!{" "}
                </Text>{" "}
              </div>
            )}
          </div>
        </div>

        <canvas
          ref="newspaper"
          style={{ width: 0, height: 0, display: "hidden" }}
          width={1040}
          height={1360}
        />

        <canvas
          ref="ossoff"
          style={{
            width: 0,
            height: 0,
            display: "hidden",
          }}
          width={900}
          height={1600}
        />

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

export default Spotify;
