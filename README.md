# @chainplatform/rich

Reusable BBCode rich text editor for **React Native** and **React Native Web**.

<p align="center">
  <a href="https://github.com/ChainPlatform/react-native-richtext-editor/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/rich">
    <img src="https://img.shields.io/npm/v/@chainplatform/rich?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/rich">
    <img src="https://img.shields.io/npm/dt/@chainplatform/tooltip.svg"></img>
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/rich">
    <img src="https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20web-blue"></img>
  </a>
  <a href="https://github.com/ChainPlatform/react-native-richtext-editor/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=doansan">
    <img src="https://img.shields.io/twitter/follow/doansan.svg?label=Follow%20@doansan" alt="Follow @doansan" />
  </a>
</p>

[![GitHub stars](https://img.shields.io/github/stars/ChainPlatform/react-native-richtext-editor?style=social)](https://github.com/ChainPlatform/react-native-richtext-editor)  
[![GitHub forks](https://img.shields.io/github/forks/ChainPlatform/react-native-richtext-editor?style=social)](https://github.com/ChainPlatform/react-native-richtext-editor)

`@chainplatform/rich` provides a lightweight editor that stores content as BBCode-like text.

```txt
[b]Bold[/b]
[i]Italic[/i]
[u]Underline[/u]

[list]
[*] Content 1
[*] Content 2
[/list]

[ol]
[*] Step 1
[*] Step 2
[/ol]
```

---

## Features

- React Native
- React Native Web
- Class Component
- No WebView
- No dependency on DraftJS / Quill
- BBCode based
- HTML renderer
- HTML helper
- Toolbar with SVG icons
- Undo / Redo
- Lists
- Tables
- Images
- Links
- Youtube
- Quote
- Code block
- Math
- Heading
- Alignment
- Color
- Font
- Size
- Export HTML
- Lightweight

---

## Install

```bash
npm install @chainplatform/rich @chainplatform/layout react-native-svg --save
```

or:

```bash
yarn add @chainplatform/rich @chainplatform/layout react-native-svg
```

For React Native CLI projects:

```bash
cd ios && pod install
```

---

## Basic Usage

```jsx
import React, { PureComponent } from "react";
import { View } from "react-native";
import { RichTextEditor, getHTMLContent } from "@chainplatform/rich";

export default class Example extends PureComponent {
    state = {
        content: ""
    };

    render() {
        return (
            <View>
                <RichTextEditor
                    value={this.state.content}
                    maxLength={5000}
                    minHeight={260}
                    placeholder="Enter content..."
                    onChangeText={(content) => this.setState({ content })}
                />
            </View>
        );
    }
}
```

---

## With Theme

```jsx
<RichTextEditor
    value={content}
    theme={theme}
    minHeight={280}
    onChangeText={setContent}
/>
```

Supported theme keys:

```js
theme.colors.border
theme.colors.text
theme.colors.text_muted
theme.colors.muted
theme.colors.card
theme.colors.background
theme.colors.primary_soft
theme.colors.error
```

---

Default insertions:

```txt
[url=][/url]
[img][/img]
```

---

## Supported BBCode Insertions

| Toolbar | BBCode |
| --- | --- |
| Bold | `[b]text[/b]` |
| Italic | `[i]text[/i]` |
| Underline | `[u]text[/u]` |
| Strike | `[s]text[/s]` |
| Superscript | `[sup]text[/sup]` |
| Subscript | `[sub]text[/sub]` |
| Math / inline code | `` `text` `` |
| Color | `[color=#ff0000]text[/color]` |
| Size | `[size=24]text[/size]` |
| Font | `[font=Arial]text[/font]` |
| Left | `[left]text[/left]` |
| Center | `[center]text[/center]` |
| Right | `[right]text[/right]` |
| HR | `[hr]` |
| Bullet list | `[list][*] item[/list]` |
| Ordered list | `[ol][*] item[/ol]` |
| Quote | `[quote]text[/quote]` |
| Code | `[code]text[/code]` |
| Table | `[table][tr][td]text[/td][/tr][/table]` |
| Link | `[url=https://example.com]text[/url]` |
| Email | `[email]email@example.com[/email]` |
| Image | `[img]https://example.com/image.jpg[/img]` |
| YouTube | `[youtube]video-id[/youtube]` |

---

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Editor value |
| `onChangeText` | `(value: string) => void` | `undefined` | Called when value changes |
| `onChange` | `(value: string) => void` | `undefined` | Alias callback for value changes |
| `placeholder` | `string` | `'Nhập nội dung...'` | Placeholder text |
| `minHeight` | `number` | `0` | Minimum editor input height |
| `maxLength` | `number` | `5000` | Maximum text length |
| `editable` | `boolean` | `true` | Enable or disable editing |
| `theme` | `object` | `undefined` | Chain Platform compatible theme |
| `style` | `object \| array` | `null` | Wrapper style |
| `containerStyle` | `object \| array` | `null` | Wrapper style alias |
| `toolbarStyle` | `object \| array` | `null` | Toolbar style |
| `inputStyle` | `object \| array` | `null` | TextInput style |
| `onUndo` | `() => void` | `undefined` | Custom undo handler |
| `onRedo` | `() => void` | `undefined` | Custom redo handler |

---

## Package Structure

```txt
@chainplatform/rich
├── src
│   ├── RichTextEditor.js
│   ├── RichTextToolbarSVG.js
│   └── HTMLHelpers.js
├── index.js
├── package.json
├── README.md
└── LICENSE
```

---

## Notes

The editor stores formatted content as plain BBCode text. Convert and sanitize generated HTML before rendering untrusted user content. Please use getHTMLContent function.

---

## License

MIT © 2026 [Chain Platform](https://chainplatform.net)

---

## 💖 Support & Donate

If you find this package helpful, consider supporting the development:

| Currency | Address |
|----------------|----------|
| **MB Bank** | `MB Bank` |
![alt text](imgs/qr.png)
| **Bitcoin (BTC)** | `17grbSNSEcEybS1nHh4TGYVodBwT16cWtc` |
![alt text](imgs/image-1.png)
| **Ethereum (ETH)** | `0xa2fd119a619908d53928e5848b49bf1cc15689d4` |
![alt text](imgs/image-2.png)
| **Tron (TRX)** | `TYL8p2PLCLDfq3CgGBp58WdUvvg9zsJ8pd` |
![alt text](imgs/image.png)
| **DOGE (DOGE)** | `DDfKN2ys4frNaUkvPKcAdfL6SiVss5Bm19` |
| **USDT (SOLANA)** | `cPUZsb7T9tMfiZFqXbWbRvrUktxgZQXQ2Ni1HiVXgFm` |

Your contribution helps maintain open-source development under the Chain Platform ecosystem 🚀
