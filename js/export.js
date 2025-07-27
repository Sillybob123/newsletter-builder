class NewsletterExporter {
    generateEmailHTML(newsletterData, options = {}) {
        const { title, content } = newsletterData;
        
        const bodyContent = content.map(block => {
            const renderer = TemplateRenderer[`render${block.type.charAt(0).toUpperCase() + block.type.slice(1)}`];
            return renderer ? renderer(block.content) : '';
        }).join('');

        const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Newsletter'}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f4f4f4; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        .wrapper { background-color: #f4f4f4; width: 100%; }
        .container { background-color: #ffffff; width: 600px; margin: 0 auto; }
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; }
        }
    </style>
</head>
<body>
    <table class="wrapper" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td>
                <table class="container" cellpadding="0" cellspacing="0" width="600" align="center">
                    <tr>
                        <td style="padding: 20px;">
                            ${bodyContent}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        if (options.raw) {
            return { html: emailHTML };
        }
        return this.minifyHTML(emailHTML);
    }

    minifyHTML(html) {
        return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    }

    exportNewsletter(newsletterData) {
        if (!newsletterData.content || newsletterData.content.length === 0) {
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

// Initialize exporter
const newsletterExporter = new NewsletterExporter();
