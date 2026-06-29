import sdkStyles, { setSize, sdkColors } from '@chainplatform/layout';

export default function getFormatHtml() {
    return `* {
        font-family: system-ui, sans-serif; 
        font-size: ${setSize(13)}px;
        touch-action: pan-x pan-y;
    }
    sup {
        font-size: ${setSize(11)}px;
    }
    sub {
        font-size: ${setSize(11)}px;
    }
    a {
        font-size: ${setSize(13)}px;
        color: ${sdkColors.lightBlue}
    }
    h1 {
        font-size: ${setSize(22)}px;
        font-weight: ${sdkStyles.fw600};
        margin-top: ${setSize(8)}px;
        margin-bottom: ${setSize(8)}px;
    }
    h2 {
        font-size: ${setSize(18)}px;
        font-weight: ${sdkStyles.fw600};
        margin-top: ${setSize(8)}px;
        margin-bottom: ${setSize(6)}px;
    }
    title {
        font-size: ${setSize(14)}px;
        font-weight: bold;
        margin-bottom: ${setSize(10)}px;
    }
    short_description {
        font-size: ${setSize(13)}px;
        font-style: ${sdkStyles.textItalic};
        margin-bottom: ${setSize(10)}px;
        margin-top: ${setSize(6)}px;
        color: ${sdkColors.tabDefault};
    }
    h3 {
        font-size: ${setSize(16)}px;
        font-weight: ${sdkStyles.fw600};
        margin-top: ${setSize(6)}px;
        margin-bottom: ${setSize(6)}px;
    }
    h4 {
        font-size: ${setSize(13)}px;
        font-weight: '600';
    }
    h5 {
        font-size: ${setSize(13)}px;
        font-weight: '600';
    }
    h6 {
        font-size: ${setSize(13)}px;
        font-weight: '600';
    }
    b {
        font-size: ${setSize(13)}px;
        font-weight: bold;
    }
    del {
        text-decoration: line-through;
    }
    blockquote {
        margin: ${setSize(8)}px 0;
        padding: ${setSize(8)}px ${setSize(12)}px;
        border-left: ${setSize(3)}px solid ${sdkColors.tabDefault};
    }
    pre {
        white-space: pre-wrap;
        padding: ${setSize(10)}px;
        border-radius: ${setSize(6)}px;
        background: rgba(148, 163, 184, 0.16);
    }
    code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: ${setSize(12)}px;
    }
    table {
        border-collapse: collapse;
        width: ${sdkStyles.w100pc};
    }
    td, th {
        border: ${setSize(1)}px solid ${sdkColors.tabDefault};
        padding: ${setSize(6)}px;
    }
    hr {
        border: 0;
        border-top: ${setSize(1)}px solid ${sdkColors.tabDefault};
        margin: ${setSize(10)}px 0;
    }
    iframe {
        max-width: ${sdkStyles.w100pc};
        width: ${sdkStyles.w100pc};
        aspect-ratio: 16 / 9;
    }
    br {
        line-height: 0;
        height: 0;
        margin-top: 0;
        margin-bottom: 0;
    }
    img {
        max-width: ${sdkStyles.w100pc};
        width: ${sdkStyles.w100pc};
        align-items: center;
        align-self: center;
        text-align: center;
    }
    p {
        max-width: ${sdkStyles.w100pc};
        width: ${sdkStyles.w100pc};
        align-items: center;
        font-size: ${setSize(13)}px;
        margin-top: ${setSize(4)}px;
        margin-bottom: ${setSize(4)}px;
        white-space: normal;
    }
    em {
        text-align: center;
        font-size: ${setSize(12.5)}px;
        max-width: ${sdkStyles.w100pc};
        width: ${sdkStyles.w100pc};
        font-style: ${sdkStyles.textItalic};
        color: ${sdkColors.tabDefault};
    }
    i {
        font-size: ${setSize(13)}px;
        font-style: ${sdkStyles.textItalic};
    }
    div {
        max-width: ${sdkStyles.w100pc};
        width: ${sdkStyles.w100pc};
        align-items: center;
        font-size: ${setSize(13)}px;
        margin-top: 0;
        margin-bottom: 0;
        white-space: normal;
    }`;
}

export function contentCSS() {
    return `font-family: system-ui, sans-serif;
        font-size: ${setSize(13)}px;
        padding: ${setSize(10)}px;
        min-height: ${setSize(300)}px;
        height: ${setSize(300)}px;
        position: absolute; 
        top: 0; 
        right: 0; 
        bottom: 0; 
        left: 0;
        touch-action: pan-x pan-y;`
}

const htmlTokenPrefix = "CHAIN_HTML_TOKEN";
const isNil = value => value === null || typeof value === "undefined";
const toText = value => isNil(value) ? "" : value.toString();
const escapeHtml = value => toText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const escapeAttribute = value => escapeHtml(value).replace(/"/g, "&quot;");

const safeColor = (value) => {
    const color = toText(value).trim();
    if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
    if (/^[a-z]+$/i.test(color)) return color;
    if (/^rgba?\([\d\s,.%]+\)$/i.test(color)) return color;
    return "#ff0000";
};

const safeSize = (value) => {
    const size = parseFloat(value);
    if (Number.isNaN(size)) return setSize(13);
    return setSize(Math.min(72, Math.max(8, size)));
};

const safeFont = (value) => {
    const font = toText(value).replace(/["'<>;]/g, "").trim();
    return font || "Arial";
};

const safeUrl = (value) => {
    const url = toText(value).trim();
    if (/^(https?:|mailto:|tel:|data:image\/)/i.test(url)) return url;
    if (/^(\/|#)/.test(url)) return url;
    return "";
};

const safeEmail = (value) => toText(value).replace(/^mailto:/i, "").trim();

const getYoutubeId = (value) => {
    const url = toText(value).trim();
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
    if (match?.[1]) return match[1];
    if (/^[A-Za-z0-9_-]{6,}$/.test(url)) return url;
    return "";
};

const renderList = (content, tag) => {
    const items = toText(content)
        .split(/\[\*\]/)
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => `<li>${item}</li>`)
        .join("");
    return `<${tag}>${items}</${tag}>`;
};

const renderTable = (content) => {
    const rows = toText(content).replace(/\[tr\]([\s\S]*?)\[\/tr\]/gi, (_rowMatch, rowContent) => {
        const cells = rowContent.replace(/\[td\]([\s\S]*?)\[\/td\]/gi, (_cellMatch, cellContent) => `<td>${cellContent.trim()}</td>`);
        return `<tr>${cells}</tr>`;
    });
    return `<table style="border-collapse:collapse;width:100%;"><tbody>${rows.replace(/\r?\n/g, "").trim()}</tbody></table>`;
};

const renderYoutube = (content) => {
    const id = getYoutubeId(content);
    const url = safeUrl(content);
    if (!id) return url ? `<a href="${escapeAttribute(url)}">${escapeHtml(content)}</a>` : escapeHtml(content);
    return `<iframe src="https://www.youtube.com/embed/${escapeAttribute(id)}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;"></iframe>`;
};

export function getHTMLContent(content) {
    let html = toText(content);
    const tokens = [];
    const keepHtml = (value) => {
        const token = `@@${htmlTokenPrefix}_${tokens.length}@@`;
        tokens.push({ token, value });
        return token;
    };

    html = html.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, (_match, code) => (
        keepHtml(`<pre style="white-space:pre-wrap;padding:${setSize(10)}px;border-radius:${setSize(6)}px;background:rgba(148,163,184,0.16);"><code>${escapeHtml(code)}</code></pre>`)
    ));

    html = html.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, "<strong>$1</strong>");
    html = html.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, "<em>$1</em>");
    html = html.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, "<u>$1</u>");
    html = html.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, "<del>$1</del>");
    html = html.replace(/\[sup\]([\s\S]*?)\[\/sup\]/gi, "<sup>$1</sup>");
    html = html.replace(/\[sub\]([\s\S]*?)\[\/sub\]/gi, "<sub>$1</sub>");
    html = html.replace(/\[color=(.*?)\]([\s\S]*?)\[\/color\]/gi, (_match, color, value) => `<span style="color:${safeColor(color)};">${value}</span>`);
    html = html.replace(/\[size=(.*?)\]([\s\S]*?)\[\/size\]/gi, (_match, size, value) => `<span style="font-size:${safeSize(size)}px;">${value}</span>`);
    html = html.replace(/\[font=(.*?)\]([\s\S]*?)\[\/font\]/gi, (_match, font, value) => `<span style="font-family:${safeFont(font)}, sans-serif;">${value}</span>`);
    html = html.replace(/\[h1\]([\s\S]*?)\[\/h1\]/gi, `<h1 style="font-size:${setSize(22)}px;margin:${setSize(8)}px 0;font-weight:600;">$1</h1>`);
    html = html.replace(/\[h2\]([\s\S]*?)\[\/h2\]/gi, `<h2 style="font-size:${setSize(18)}px;margin:${setSize(8)}px 0 ${setSize(6)}px;font-weight:600;">$1</h2>`);
    html = html.replace(/\[h3\]([\s\S]*?)\[\/h3\]/gi, `<h3 style="font-size:${setSize(16)}px;margin:${setSize(6)}px 0;font-weight:600;">$1</h3>`);
    html = html.replace(/\[left\]([\s\S]*?)\[\/left\]/gi, '<div style="text-align:left">$1</div>');
    html = html.replace(/\[center\]([\s\S]*?)\[\/center\]/gi, '<div style="text-align:center">$1</div>');
    html = html.replace(/\[right\]([\s\S]*?)\[\/right\]/gi, '<div style="text-align:right">$1</div>');
    html = html.replace(/\[url=(.*?)\]([\s\S]*?)\[\/url\]/gi, (_match, url, value) => {
        const href = safeUrl(url) || safeUrl(value) || "#";
        return `<a href="${escapeAttribute(href)}">${value}</a>`;
    });
    html = html.replace(/\[email=(.*?)\]([\s\S]*?)\[\/email\]/gi, (_match, email, value) => `<a href="mailto:${escapeAttribute(safeEmail(email))}">${value}</a>`);
    html = html.replace(/\[email\]([\s\S]*?)\[\/email\]/gi, (_match, email) => `<a href="mailto:${escapeAttribute(safeEmail(email))}">${email}</a>`);
    html = html.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (_match, url) => {
        const src = safeUrl(url);
        return src ? `<img src="${escapeAttribute(src)}" style="max-width: 100%" />` : "";
    });
    html = html.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, (_match, value) => renderList(value, "ul"));
    html = html.replace(/\[ol\]([\s\S]*?)\[\/ol\]/gi, (_match, value) => renderList(value, "ol"));
    html = html.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, `<blockquote style="margin:${setSize(8)}px 0;padding:${setSize(8)}px ${setSize(12)}px;border-left:${setSize(3)}px solid ${sdkColors.tabDefault};">$1</blockquote>`);
    html = html.replace(/\[table\]([\s\S]*?)\[\/table\]/gi, (_match, value) => renderTable(value));
    html = html.replace(/\[hr\s*\/?\]/gi, `<hr style="border:0;border-top:${setSize(1)}px solid ${sdkColors.tabDefault};margin:${setSize(10)}px 0;" />`);
    html = html.replace(/\[youtube\]([\s\S]*?)\[\/youtube\]/gi, (_match, value) => renderYoutube(value));
    html = html.replace(/\r?\n/g, "<br/>");
    tokens.forEach(({ token, value }) => {
        html = html.split(token).join(value);
    });
    return html;
}
