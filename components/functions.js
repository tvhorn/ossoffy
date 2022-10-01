import moment from "moment";

const fragmentTitle = (ctx, text, maxWidth) => {
  var words = text.split(" "),
    lines = [],
    line = "";
  if (ctx.measureText(text).width < maxWidth) {
    return [text];
  }
  while (words.length > 0) {
    var split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      var tmp = words[0];
      words[0] = tmp.slice(0, -1);
      if (!split) {
        split = true;
        words.splice(1, 0, tmp.slice(-1));
      } else {
        words[1] = tmp.slice(-1) + words[1];
      }
    }
    if (ctx.measureText(line + words[0]).width < maxWidth) {
      line += words.shift() + " ";
    } else {
      lines.push(line.trim());
      line = "";
      if (lines.length > 0) {
        ctx.font = `800 ${60 - lines.length * 10}px serif`;
      }
    }
    if (words.length === 0) {
      lines.push(line.trim());
    }
  }
  return lines;
};

const fragmentText = (ctx, text, maxWidth) => {
  var words = text.split(" "),
    lines = [],
    line = "";
  if (ctx.measureText(text).width < maxWidth) {
    return [text];
  }
  while (words.length > 0) {
    var split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      var tmp = words[0];
      words[0] = tmp.slice(0, -1);
      if (!split) {
        split = true;
        words.splice(1, 0, tmp.slice(-1));
      } else {
        words[1] = tmp.slice(-1) + words[1];
      }
    }
    if (ctx.measureText(line + words[0]).width < maxWidth) {
      line += words.shift() + " ";
    } else {
      lines.push(line.trim());
      line = "";
    }
    if (words.length === 0) {
      lines.push(line.trim());
    }
  }
  return lines;
};

const fragmentSongs = (ctx, text, maxWidth) => {
  var words = text.split(" "),
    lines = [],
    line = "",
    indented = false;

  if (ctx.measureText(text).width < maxWidth) {
    return [text];
  }
  while (words.length > 0) {
    if (!indented && lines.length == 1) {
      indented = true;
      maxWidth -= 60;
    }

    var split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      var tmp = words[0];
      words[0] = tmp.slice(0, -1);
      if (!split) {
        split = true;
        words.splice(1, 0, tmp.slice(-1));
      } else {
        words[1] = tmp.slice(-1) + words[1];
      }
    }
    if (ctx.measureText(line + words[0]).width < maxWidth) {
      line += words.shift() + " ";
    } else {
      lines.push(line.trim());
      line = "";
    }
    if (words.length === 0) {
      lines.push(line.trim());
    }
  }
  return lines;
};

const loadImage = (url) => {
  return new Promise((r) => {
    let i = new Image();
    i.onload = () => {
      r(i);
    };
    i.setAttribute("crossorigin", "anonymous");
    i.src = url;
  });
};

const ossoffy = async (newspaper, name, artwork, songs, ossoff, callback) => {
  const ctx = newspaper.getContext("2d");

  const reviews = [
    `"What an incredible curation of music!"`,
    `"100% would recommend!"`,
    `"The vibes are unmatched!"`,
    `"I have nothing else to say besides: ★★★★★"`,
    `"This playlist is so good even tone deaf David Perdue would like it."`,
    `"Absolutely slaps."`,
  ];

  const review = `${
    reviews[Math.floor(Math.random() * reviews.length)]
  } —Jon Ossoff, candidate for the 2020 Georgia Senate runoff`;

  ctx.clearRect(0, 0, newspaper.width, newspaper.height);

  const backgroundImage = await loadImage("/background.png");

  ctx.drawImage(backgroundImage, 0, 0, 1040, 1360);
  ctx.fillStyle = "black";
  ctx.font = "600 20px serif";
  ctx.textAlign = "center";
  ctx.fillText(moment().format("MMMM Do YYYY"), newspaper.width / 2, 230);

  const margin = 20;
  ctx.font = "800 60px serif";
  ctx.textAlign = "center";

  let titleHeight = 320;
  const titleLines = fragmentTitle(ctx, name, newspaper.width - 2 * margin);
  for (let i = 0; i < titleLines.length; i++) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `800 ${60 - i * 10}px serif`;
    ctx.fillText(titleLines[i], newspaper.width / 2, titleHeight);
    titleHeight += 60 - i * 5;
  }
  const albumImage = await loadImage(artwork);
  const min = Math.min(albumImage.width, albumImage.height);
  ctx.drawImage(
    albumImage,
    (albumImage.width - min) / 2,
    (albumImage.height - min) / 2,
    min,
    min,
    margin,
    titleHeight,
    490,
    490
  );

  // review start
  ctx.textAlign = "left";
  ctx.fillStyle = "black";
  ctx.font = "italic 400 32px serif";
  const reviewLines = fragmentText(ctx, review, 490);
  let reviewHeight = titleHeight + 32;
  for (let i = 0; i < reviewLines.length; i++) {
    ctx.fillText(reviewLines[i], 530, titleHeight + 32 + i * 32);
    reviewHeight += 32;
  }
  // review end

  // songs start
  ctx.textAlign = "left";
  ctx.fillStyle = "black";
  ctx.font = "500 40px serif";
  let wordHeight = reviewHeight + 32,
    shifted = false,
    jump = false,
    jumpedHeight;

  for (let i = 0; i < songs.length; i++) {
    const songLines = fragmentSongs(ctx, songs[i], 490);
    for (let j = 0; j < songLines.length; j++) {
      let x = 530;
      if (wordHeight + 45 > newspaper.height && !shifted) {
        wordHeight = jumpedHeight;
        shifted = true;
        wordHeight += 20;
      }
      if (
        wordHeight > titleHeight + 490 &&
        wordHeight <= newspaper.height &&
        !shifted
      ) {
        if (!jump) {
          jump = true;
          jumpedHeight = wordHeight;
          wordHeight += 20;
        }
        x = margin;
      }
      if (j != 0) x += 60;
      ctx.fillText(songLines[j], x, wordHeight);
      wordHeight += 45;
    }
  }
  // songs end

  const newspaperSource = newspaper.toDataURL();
  const context = ossoff.getContext("2d");
  context.clearRect(0, 0, ossoff.width, ossoff.height);
  const colorImage = await loadImage(
    `/${Math.floor(Math.random() * 4) + 1}.jpg`
  );
  context.drawImage(colorImage, 0, 0, 900, 1600);
  const baseImage = await loadImage("/ossoffy_base.png");
  context.drawImage(baseImage, 0, 0, 900, 1600);
  const newspaperImage = await loadImage(newspaperSource);
  context.rotate((-1.55 * Math.PI) / 180);
  context.drawImage(newspaperImage, -10, 748, 676, 884);
  const handImage = await loadImage("/hand.png");
  context.rotate((1.55 * Math.PI) / 180);
  context.rotate((-1 * Math.PI) / 180);
  context.drawImage(handImage, 150, 622, 300, 300);
  context.rotate((1 * Math.PI) / 180);
  callback();
};

export { ossoffy };
