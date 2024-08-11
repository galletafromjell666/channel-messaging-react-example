# channel-messaging-react-example

This repository provides a minimal implementation of the [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) for React applications.

In this example, the Channel Messaging API is utilized to establish bidirectional communication between the main document and an iframe, enabling a chat-like experience.

## Installation

First, clone the repository

```bash
git clone https://github.com/galletafromjell666/channel-messaging-react-example.git
```

Second, move into the project

```bash
cd channel-messaging-react-example/
```

Now we are ready to install the packages, pnpm is recommended since the main and the iframe projects use the same dependencies, using pnpm is an excellent choice to save disk space, it can be installed using:

```bash
npm install -g pnpm
```

Once pnpm is installed, the packages can be installed using:

```bash
cd ./app_one/ && pnpm install && cd ../app_two/ && pnpm install && cd ..
```

Now we can use the start script to initiate both projects

```bash
./start.sh
```

`app_one` is the main document and runs on the port `5173`, `app_two` is the iframe and runs on the port `5174`
