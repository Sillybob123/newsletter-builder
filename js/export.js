class NewsletterExporter {
    generateEmailHTML(newsletterData) {
        if (!newsletterData || !newsletterData.blocks) return '<p>No content to export</p>';

        const { title, blocks, globalStyles } = newsletterData;
        const bodyContent = blocks.map(block => this.generateBlockHTML(block, globalStyles)).join('');

        const emailHTML = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${this.escapeHtml(title || 'Newsletter')}</title>
    <style>
        table, td, div, h1, p { font-family: ${globalStyles.fontFamily || 'Arial, sans-serif'}; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .mobile-full-width { width: 100% !important; max-width: 100% !important; height: auto !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;word-spacing:normal;background-color:#f4f4f4;">
    <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#f4f4f4;">
        <table role="presentation" style="width:100%;border:0;border-spacing:0;">
            <tr>
                <td align="center" style="padding:20px 0;">
                    <table role="presentation" class="email-container" style="width:600px;border:0;border-spacing:0;text-align:left;background-color:${globalStyles.backgroundColor || '#ffffff'};">
                        ${bodyContent}
                    </table>
                    </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
        return emailHTML;
    }

    generateBlockHTML(block, globalStyles) {
        const c = block.content;
        const p = c.padding ? `padding:${c.padding.top}px ${c.padding.right}px ${c.padding.bottom}px ${c.padding.left}px;` : '';
        const ff = `font-family:${globalStyles.fontFamily};`;

        switch (block.type) {
            case 'text':
                return `<tr><td style="${p}"><p style="margin:0;font-size:${c.fontSize}px;line-height:1.6;color:${c.color};text-align:${c.textAlign};${ff}">${c.text}</p></td></tr>`;
            case 'heading':
                return `<tr><td style="${p}"><h1 style="margin:0;font-size:${c.fontSize}px;line-height:1.2;color:${c.color};text-align:${c.textAlign};font-weight:${c.fontWeight};${ff}">${c.text}</h1></td></tr>`;
            case 'image':
                const img = `<img src="${c.src}" alt="${this.escapeHtml(c.alt)}" style="display:block;width:100%;max-width:100%;height:auto;border:0;" class="mobile-full-width">`;
                return `<tr><td style="${p}">${c.link ? `<a href="${c.link}" target="_blank" style="text-decoration:none;">${img}</a>` : img}</td></tr>`;
            case 'button':
                return `
                    <tr>
                        <td align="${c.textAlign}" style="${p}">
                            <table role="presentation" style="border-spacing:0;">
                                <tr>
                                    <td style="background-color:${c.backgroundColor};border-radius:${c.borderRadius}px;">
                                        <a href="${c.href}" target="_blank" style="font-size:16px;font-weight:bold;color:${c.color};text-decoration:none;padding:${c.padding.top}px ${c.padding.right}px ${c.padding.bottom}px ${c.padding.left}px;display:inline-block;border-radius:${c.borderRadius}px;${ff}">${c.text}</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>`;
            case 'divider':
                return `<tr><td style="${p}"><p style="margin:0;font-size:2px;line-height:2px;border-bottom:${c.height}px solid ${c.color};">&nbsp;</p></td></tr>`;
            case 'spacer':
                return `<tr><td style="font-size:0;line-height:0;height:${c.height}px;">&nbsp;</td></tr>`;
            default:
                return `<tr><td style="padding:20px;">Unsupported block type: ${block.type}</td></tr>`;
        }
    }

    exportNewsletter(newsletterData) {
        if (!newsletterData.blocks || newsletterData.blocks.length === 0) {
            alert('Your newsletter is empty. Add content before exporting.');
            return;
        }
        const html = this.generateEmailHTML(newsletterData);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(newsletterData.title || 'newsletter').replace(/\s+/g, '-').toLowerCase()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}