class NewsletterExporter {
    generateEmailHTML(newsletterData) {
        if (!newsletterData || !newsletterData.blocks) return '<p>No content to export.</p>';

        const { title, blocks, globalStyles } = newsletterData;
        const bodyContent = blocks.map(block => this.generateBlockHTML(block, globalStyles)).join('');
        const previewText = this.generatePreviewText(blocks);

        return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${this.escapeHtml(title || 'Newsletter')}</title>
    <style>
        table, td, div, h1, h2, h3, p { font-family: ${globalStyles.fontFamily || 'Arial, sans-serif'}; }
        @media screen and (max-width: 600px) {
            .email-container, .col-wrapper { width: 100% !important; max-width: 100% !important; }
            .col { display: block !important; width: 100% !important; padding: 0 !important; }
            .col-spacer { display: none !important; }
            .mobile-full-width { width: 100% !important; max-width: 100% !important; }
            .mobile-center { text-align: center !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;word-spacing:normal;background-color:#f4f4f4;">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        ${previewText}
    </div>
    <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:${globalStyles.bodyBackgroundColor || '#f4f4f4'};">
        <table role="presentation" style="width:100%;border:0;border-spacing:0;">
            <tr>
                <td align="center" style="padding:20px 0;">
                    <table role="presentation" class="email-container" style="width:600px;border-spacing:0;text-align:left;background-color:${globalStyles.canvasBackgroundColor || '#ffffff'};">
                        ${bodyContent}
                    </table>
                    </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
    }

    generatePreviewText(blocks) {
        const textContent = blocks
            .map(block => {
                if (block.type === 'text' || block.type === 'heading') return block.content.text;
                if (block.type === 'article') return `${block.content.title} ${block.content.description}`;
                return '';
            })
            .join(' ')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return this.escapeHtml(textContent.substring(0, 150));
    }

    generateBlockHTML(block, globalStyles) {
        const c = block.content;
        const p = c.padding ? `padding:${c.padding.top}px ${c.padding.right}px ${c.padding.bottom}px ${c.padding.left}px;` : '';
        const ff = `font-family:${globalStyles.fontFamily}, Arial, sans-serif;`;

        switch (block.type) {
            case 'text':
                return `<tr><td style="${p}"><p style="margin:0;font-size:${c.fontSize}px;line-height:${c.lineHeight || 1.6};color:${c.color};text-align:${c.textAlign};${ff}">${c.text}</p></td></tr>`;
            case 'heading':
                return `<tr><td style="${p}"><h2 style="margin:0;font-size:${c.fontSize}px;line-height:1.2;color:${c.color};text-align:${c.textAlign};font-weight:${c.fontWeight};${ff}">${c.text}</h2></td></tr>`;
            case 'image':
                const img = `<img src="${c.src}" alt="${this.escapeHtml(c.alt)}" style="display:block;width:100%;max-width:100%;height:auto;border:0;border-radius:${c.borderRadius}px;" class="mobile-full-width">`;
                return `<tr><td style="${p}" align="${c.align || 'center'}">${c.link ? `<a href="${c.link}" target="_blank" style="text-decoration:none;">${img}</a>` : img}</td></tr>`;
            case 'button':
                return `<tr><td align="${c.align || 'center'}" style="${p}"><table role="presentation" style="border-spacing:0;"><tr><td style="background-color:${c.backgroundColor};border-radius:${c.borderRadius}px;"><a href="${c.href}" target="_blank" style="font-size:${c.fontSize}px;font-weight:${c.fontWeight};color:${c.color};text-decoration:none;padding:${c.padding.top}px ${c.padding.right}px ${c.padding.bottom}px ${c.padding.left}px;display:inline-block;border-radius:${c.borderRadius}px;${ff}">${c.text}</a></td></tr></table></td></tr>`;
            case 'divider':
                return `<tr><td style="${p}"><table role="presentation" style="width:100%;border-spacing:0;"><tr><td style="border-bottom:${c.height}px ${c.style} ${c.color};font-size:1px;line-height:1px;">&nbsp;</td></tr></table></td></tr>`;
            case 'spacer':
                return `<tr><td style="font-size:0;line-height:0;height:${c.height}px;">&nbsp;</td></tr>`;
            case 'header':
                return `<tr><td style="padding:0;"><a href="${c.link}" target="_blank" style="text-decoration:none;display:block;"><img src="${c.imageUrl}" alt="Header" style="display:block;width:100%;height:auto;border:0;" class="mobile-full-width"></a></td></tr>`;
            case 'footer':
                const socialLinks = c.socialLinks.map(link => `<a href="${link.url}" target="_blank" style="display:inline-block;margin:0 5px;"><img src="https://cdn-icons-png.flaticon.com/64/1384/${{linkedin:'088', instagram:'063'}[link.platform]}.png" alt="${link.platform}" width="24" style="display:block;border:0;"></a>`).join('');
                return `<tr><td style="padding:30px;text-align:center;background-color:${c.backgroundColor};"><p style="margin:0 0 10px;font-size:14px;color:${c.textColor};${ff}">${c.companyName}</p><p style="margin:0 0 15px;font-size:12px;color:${c.textColor};${ff}">${c.address}</p><p style="margin:0 0 15px;">${socialLinks}</p><p style="margin:0;font-size:12px;line-height:1.5;color:${c.textColor};${ff}"><a href="${c.unsubscribeUrl}" target="_blank" style="color:${c.textColor};text-decoration:underline;">Unsubscribe</a></p></td></tr>`;
            case 'article':
                const articleImage = `<table role="presentation" style="width:100%;border-spacing:0;"><tr><td><a href="${c.ctaUrl}" target="_blank" style="text-decoration:none;"><img src="${c.imageUrl}" alt="Article Image" width="${c.imageWidth || 250}" style="display:block;width:100%;max-width:${c.imageWidth || 250}px;height:auto;border:0;border-radius:8px;" class="mobile-full-width"></a></td></tr></table>`;
                const articleText = `<h3 style="margin:0 0 10px;font-size:20px;font-weight:bold;color:#222;${ff}">${c.title}</h3><p style="margin:0 0 15px;font-size:15px;line-height:1.6;color:#555;${ff}">${c.description}</p><table role="presentation" style="border-spacing:0;"><tr><td style="background-color:${globalStyles.primaryColor};border-radius:5px;"><a href="${c.ctaUrl}" target="_blank" style="color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;padding:10px 20px;display:inline-block;border-radius:5px;${ff}">${c.ctaText}</a></td></tr></table>`;
                const cols = c.imageLeft
                    ? `<td>${articleImage}</td><td width="20" class="col-spacer"></td><td>${articleText}</td>`
                    : `<td>${articleText}</td><td width="20" class="col-spacer"></td><td>${articleImage}</td>`;
                return `<tr><td style="${p}"><table role="presentation" class="col-wrapper" style="width:100%;border-spacing:0;vertical-align:top;display:inline-table;"><tr>${c.imageLeft ? `<td class="col" style="width:50%;vertical-align:top;padding-right:10px;">${articleImage}</td>` : `<td class="col" style="width:50%;vertical-align:top;padding-right:10px;">${articleText}</td>`}</tr></table><table role="presentation" class="col-wrapper" style="width:100%;border-spacing:0;vertical-align:top;display:inline-table;"><tr>${c.imageLeft ? `<td class="col" style="width:50%;vertical-align:top;padding-left:10px;">${articleText}</td>` : `<td class="col" style="width:50%;vertical-align:top;padding-left:10px;">${articleImage}</td>`}</tr></table></td></tr>`;
            default:
                return `<tr><td style="padding:20px;text-align:center;color:#999999;">Unsupported block type: ${block.type}</td></tr>`;
        }
    }

    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
}