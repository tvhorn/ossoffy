import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/global.css";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Ossoffy</title>
        <script
          async
          src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
        />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
