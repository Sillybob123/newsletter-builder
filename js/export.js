class NewsletterExporter {
    constructor() {
        this.currentNewsletter = null;
    }

    generateEmailHTML(newsletterData) {
        const { title, content, settings } = newsletterData;
        
        // Generate email-safe HTML
        const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title || 'Newsletter'}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Client-specific styles */
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
            line-height: 100%;
        }
        
        /* Mobile styles */
        @media only screen and (max-width: 600px) {
            .mobile-hidden { display: none !important; }
            .mobile-center { text-align: center !important; }
            .mobile-full { width: 100% !important; }
            .mobile-padding { padding: 15px !important; }
            .mobile-font-size { font-size: 16px !important; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .dark-mode-bg { background-color: #1a1a1a !important; }
            .dark-mode-text { color: #ffffff !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'DM Sans', Arial, sans-serif;">
    <!-- Preview text -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'DM Sans', Arial, sans-serif; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
        ${this.generatePreviewText(content)}
    </div>
    
    <!-- Email wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Email container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" class="mobile-full">
                    ${this.renderContent(content, settings)}
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        return this.minifyHTML(emailHTML);
    }

    generatePreviewText(content) {
        // Extract first text content for preview
        for (const block of content) {
            if (block.type === 'article' && block.content.description) {
                return block.content.description.substring(0, 150) + '...';
            }
            if (block.type === 'text' && block.content.text) {
                return block.content.text.substring(0, 150) + '...';
            }
        }
        return 'View this email in your browser';
    }

    renderContent(content, settings) {
        return content.map(block => {
            switch (block.type) {
                case 'header':
                    return this.renderHeaderBlock(block.content, settings);
                case 'article':
                    return this.renderArticleBlock(block.content, settings);
                case 'text':
                    return this.renderTextBlock(block.content, settings);
                case 'image':
                    return this.renderImageBlock(block.content, settings);
                case 'social':
                    return this.renderSocialBlock(block.content, settings);
                case 'footer':
                    return this.renderFooterBlock(block.content, settings);
                default:
                    return '';
            }
        }).join('');
    }

    renderHeaderBlock(content, settings) {
        const bgColor = content.backgroundColor || settings?.brandColor || '#007bff';
        const textColor = content.textColor || '#ffffff';
        
        return `
            <tr>
                <td style="background-color: ${bgColor}; padding: 40px 30px; text-align: center;" class="mobile-padding">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: ${textColor}; font-family: 'DM Sans', Arial, sans-serif; line-height: 1.2;" class="mobile-font-size">
                        ${content.title}
                    </h1>
                    ${content.subtitle ? `
                        <p style="margin: 15px 0 0 0; font-size: 18px; color: ${textColor}; opacity: 0.9; font-family: 'DM Sans', Arial, sans-serif; line-height: 1.4;">
                            ${content.subtitle}
                        </p>
                    ` : ''}
                </td>
            </tr>
        `;
    }

    renderArticleBlock(content, settings) {
        const brandColor = settings?.brandColor || '#007bff';
        
        return `
            <tr>
                <td style="padding: 40px 30px; border-bottom: 1px solid #e9ecef;" class="mobile-padding">
                    ${content.imageUrl ? `
                        <img src="${content.imageUrl}" alt="${content.title}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 25px; display: block;">
                    ` : ''}
                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold; color: #000000; line-height: 1.3; font-family: 'DM Sans', Arial, sans-serif;">
                        ${content.title}
                    </h2>
                    <p style="margin: 0 0 25px 0; font-size: 16px; color: #666666; line-height: 1.6; font-family: 'DM Sans', Arial, sans-serif;">
                        ${content.description}
                    </p>
                    ${content.ctaText && content.ctaUrl ? `
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td style="background-color: ${brandColor}; border-radius: 6px;">
                                    <a href="${content.ctaUrl}" style="display: inline-block; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: 500; font-size: 16px; font-family: 'DM Sans', Arial, sans-serif; border-radius: 6px;">
                                        ${content.ctaText}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    ` : ''}
                </td>
            </tr>
        `;
    }

    renderTextBlock(content, settings) {
        const textAlign = content.textAlign || 'left';
        
        return `
            <tr>
                <td style="padding: 30px; text-align: ${textAlign};" class="mobile-padding mobile-center">
                    <p style="margin: 0; font-size: ${content.fontSize || '16px'}; color: ${content.color || '#333333'}; line-height: 1.6; font-family: 'DM Sans', Arial, sans-serif;">
                        ${content.text}
                    </p>
                </td>
            </tr>
        `;
    }

    renderImageBlock(content, settings) {
        return `
            <tr>
                <td style="padding: 20px;" class="mobile-padding">
                    <img src="${content.imageUrl}" alt="${content.altText || 'Image'}" style="width: 100%; height: auto; border-radius: 8px; display: block;">
                </td>
            </tr>
        `;
    }

    renderSocialBlock(content, settings) {
        const socialIcons = {
            linkedin: 'https://cdn-icons-png.flaticon.com/32/174/174857.png',
            twitter: 'https://cdn-icons-png.flaticon.com/32/733/733579.png',
            instagram: 'https://cdn-icons-png.flaticon.com/32/174/174855.png',
            facebook: 'https://cdn-icons-png.flaticon.com/32/733/733547.png'
        };

        const socialLinks = content.links.map(link => `
            <td style="padding: 0 10px;">
                <a href="${link.url}" style="text-decoration: none;">
                    <img src="${socialIcons[link.platform]}" alt="${link.platform}" style="width: 32px; height: 32px; border-radius: 50%; display: block;">
                </a>
            </td>
        `).join('');

        return `
            <tr>
                <td style="background-color: #f8f9fa; padding: 40px 30px; text-align: center;" class="mobile-padding">
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; font-family: 'DM Sans', Arial, sans-serif;">
                        Follow us for more updates:
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tr>
                            ${socialLinks}
                        </tr>
                    </table>
                </td>
            </tr>
        `;
    }

    renderFooterBlock(content, settings) {
        return `
            <tr>
                <td style="background-color: #f8f9fa; padding: 40px 30px; text-align: center; border-top: 1px solid #e9ecef;" class="mobile-padding">
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; font-weight: 600; font-family: 'DM Sans', Arial, sans-serif;">
                        ${content.companyName}
                    </p>
                    ${content.address ? `
                        <p style="margin: 0 0 20px 0; font-size: 14px; color: #666666; font-family: 'DM Sans', Arial, sans-serif; line-height: 1.4;">
                            ${content.address}
                        </p>
                    ` : ''}
                    <p style="margin: 0; font-size: 12px; color: #666666; font-family: 'DM Sans', Arial, sans-serif; line-height: 1.5;">
                        © ${new Date().getFullYear()} ${content.companyName}. All rights reserved.
                        <br><br>
                        <a href="${content.unsubscribeUrl || '#'}" style="color: #007bff; text-decoration: none;">
                            ${content.unsubscribeText || 'Unsubscribe from this newsletter'}
                        </a>
                    </p>
                </td>
            </tr>
        `;
    }

    minifyHTML(html) {
        return html
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .trim();
    }

    downloadHTML(filename, content) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportNewsletter(newsletterData) {
        const html = this.generateEmailHTML(newsletterData);
        const filename = `newsletter-${Date.now()}.html`;
        this.downloadHTML(filename, html);
        return html;
    }
}

// Initialize exporter
const newsletterExporter = new NewsletterExporter();
