# Pick random user

## What is it?

The Pick Random User Plugin shows a modal for moderator to pick a user (mainly viewer but it could also be a moderator) randomly out of the whole list of users present in a meetings. 

![Gif of plugin demo](./public/assets/plugin.gif)

## Running the Plugin from Source

There are multiple ways to run this plugin as development, but the one we recommend is simple and yet effective to even test in a production BBB server - using NGROK. So follow the steps:

1. Create an account on https://ngrok.com/ (Official website of NGROK);

2. Install NGROK in your computer. They have a guide for that right after you created your account;

3. Start the Plugin development server:

```bash
cd $HOME/src/plugin-pick-random-user-plugin
npm install
npm start
```

4. Start the NGROK server into your machine with the following command:

```bash
ngrok http http://172.17.0.1:4701
```

Right after that, NGROK will create a UI into your terminal and will display an URL which is serving your static files.

Here's an example of URL: `https://<uuid>.ngrok-free.app`

You can already interact with this URL and access both 

`https://<uuid>.ngrok-free.app/manifest.json`

or

`https://<uuid>.ngrok-free.app/PickRandomUserPlugin.js`


5. Add this create parameter into API-mate to the server you are testing on:

```
pluginsManifests=[{"url": "https://<uuid>.ngrok-free.app/manifest.json"}]
```

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
cd $HOME/src/plugin-pick-random-user-plugin
npm ci
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `PickRandomUserPlugin.js`. This file can be hosted on any HTTPS server along with its `manifest.json`.

If you install the Plugin separated to the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```
