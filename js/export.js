class NewsletterExporter {
    generateEmailHTML(newsletterData, options = {}) {
        const { title, blocks, globalStyles } = newsletterData;
        
        const bodyContent = blocks.map(block => this.generateBlockHTML(block, globalStyles)).join('');

        const emailHTML = `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="x-apple-disable-message-reformatting">
            <title>${title || 'Newsletter'}</title>
            <style>
                table, td, div, h1, p {font-family: ${globalStyles.fontFamily};}
                table, td {border-collapse: collapse;}
                img {border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
            </style>
        </head>
        <body style="margin:0;padding:0;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#f0f2f5;">
                <tr>
                    <td align="center" style="padding:0;">
                        <table role="presentation" class="email-container" style="width:600px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left; background:${globalStyles.backgroundColor};">
                            ${bodyContent}
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

        return emailHTML;
    }
    
    generateBlockHTML(block, globalStyles) {
        const getPadding = (p) => `${p.top} ${p.right} ${p.bottom} ${p.left}`;
        switch (block.type) {
            case 'text':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <p style="margin:0;font-size:${block.content.fontSize};line-height:1.6;color:${block.content.color};text-align:${block.content.textAlign};font-weight:${block.content.fontWeight};">${block.content.text}</p>
                        </td>
                    </tr>
                `;
            case 'heading':
                return `
                     <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <h2 style="margin:0;font-size:${block.content.fontSize};line-height:1.3;color:${block.content.color};text-align:${block.content.textAlign};font-weight:${block.content.fontWeight};">${block.content.text}</h2>
                        </td>
                    </tr>
                `;
            case 'image':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};" align="${block.content.textAlign || 'center'}">
                            <img src="${block.content.src}" alt="${block.content.alt}" width="${parseInt(block.content.width)}%" style="display:block;height:auto;max-width:100%;border-radius:${block.content.borderRadius};" />
                        </td>
                    </tr>
                `;
             case 'button':
                return `
                    <tr>
                        <td align="${block.content.textAlign}" style="padding: 20px;">
                            <table role="presentation" style="border-collapse:collapse;border-spacing:0;">
                                <tr>
                                    <td align="center" style="background:${block.content.backgroundColor};border-radius:${block.content.borderRadius};">
                                        <a href="${block.content.href}" style="font-size:${block.content.fontSize};font-weight:${block.content.fontWeight};color:${block.content.color};text-decoration:none;padding:${getPadding(block.content.padding)};display:inline-block;border-radius:${block.content.borderRadius};">${block.content.text}</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
            case 'divider':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                <tr>
                                    <td style="padding:0;border-top:${block.content.height} solid ${block.content.color};"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
            case 'spacer':
                 return `<tr><td style="font-size:0;line-height:0;height:${block.content.height};">&nbsp;</td></tr>`;
            default:
                return '';
        }
    }


    exportNewsletter(newsletterData) {
        if (!newsletterData.blocks || newsletterData.blocks.length === 0) {
            alert('Your newsletter is empty. Please add content before exporting.');
            return;
        }
        const html = this.generateEmailHTML(newsletterData);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newsletter.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
