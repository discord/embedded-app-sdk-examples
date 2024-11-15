import * as React from "react";
import discordSdk from "../discordSdk";

enum LinkStatus {
  NOT_CLICKED = "NOT_CLICKED",
  CLICKED = "CLICKED",
  NOT_OPENED = "NOT_OPENED",
  OPENED = "OPENED",
}

// Note: we're still using the anchor tag, to ensure standard accessibility UX
export default function OpenExternalLink() {
  const [linkStatus, setLinkStatus] = React.useState(LinkStatus.NOT_CLICKED);

  async function handleLinkClicked(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    setLinkStatus(LinkStatus.CLICKED);
    const { opened } = await discordSdk.commands.openExternalLink({
      url: "https://google.com",
    });
    if (opened) {
      setLinkStatus(LinkStatus.OPENED);
    } else {
      setLinkStatus(LinkStatus.NOT_OPENED);
    }
  }

  return (
    <div
      style={{
        padding: 32,
        display: "grid",
        gridGap: 16,
        justifyItems: "start",
      }}
    >
      <h1>Open external link</h1>
      <p>
        Click here to go to google:{" "}
        <a href="https://google.com" onClick={handleLinkClicked}>
          Google!
        </a>
      </p>
      <div>Link Status: {linkStatus}</div>
      <button onClick={() => setLinkStatus(LinkStatus.NOT_CLICKED)}>
        Reset Link Status
      </button>
    </div>
  );
}
