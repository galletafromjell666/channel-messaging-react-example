# Channel Messaging React Example

This repository provides a minimal implementation of the [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) for React applications.

In this example, the Channel Messaging API is utilized to establish bidirectional communication between the main document and an iframe, enabling a chat-like experience.

## Installation

### 1. Clone the Repository

First, clone the repository using the following command:

```bash
git clone https://github.com/galletafromjell666/channel-messaging-react-example.git
```

### 2. Navigate to the Project Directory

Change to the project directory:

```bash
cd channel-messaging-react-example/
```

### 3. Install Dependencies

This project consists of two parts: the main application (`app_one`) and the iframe (`app_two`). Since they share many dependencies, we recommend using `pnpm` to optimize disk space usage.

#### Install `pnpm` (if not already installed):

```bash
npm install -g pnpm
```

#### Install Packages:

```bash
cd app_one && pnpm install && cd ../app_two && pnpm install && cd ..
```

**Windows Alternative:**

```powershell
cd app_one; pnpm install; cd ../app_two; pnpm install; cd ..
```

### 4. Start the Applications

We use the `concurrently` package to start both applications simultaneously.

#### Install `concurrently`:

If you don’t have `concurrently` installed, you can install it globally using:

```bash
npm install -g concurrently
```

#### Run the Applications:

Now, you can start both `app_one` and `app_two` using the following command:

```bash
node start.js
```

## Project Structure

- **`app_one`**: This is the main application (the host page) and will run on port `5173`.
- **`app_two`**: This is the iframe application that will run on port `5174`.

Both applications leverage the Channel Messaging API to communicate, allowing for real-time interactions between the main page and the embedded iframe.

## Media

![main](https://github.com/galletafromjell666/channel-messaging-react-example/blob/8fd6d24c6ef374489718d1e0bf8df7055a1520c9/S1.png)
