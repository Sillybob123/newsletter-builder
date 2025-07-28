class NewsletterExporter {
    generateEmailHTML(newsletterData, options = {}) {
        if (!newsletterData || !newsletterData.blocks) {
            return '<p>No content to export</p>';
        }

        const { title, blocks, globalStyles } = newsletterData;
        
        const bodyContent = blocks.map(block => this.generateBlockHTML(block, globalStyles)).join('');

        const emailHTML = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${this.escapeHtml(title || 'Newsletter')}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset styles */
        table, td, div, h1, h2, h3, h4, h5, h6, p { font-family: ${globalStyles.fontFamily || 'Arial, sans-serif'}; }
        table, td { border-collapse: collapse; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        p { margin: 0; }
        
        /* Client-specific styles */
        #MessageViewBody a { color: inherit; text-decoration: none; }
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
        
        /* iOS Mail app fix */
        .ios-fix { min-height: 30px; line-height: 30px; }
        
        /* Outlook specific */
        <!--[if mso]>
        table { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        <![endif]-->
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .dark-mode-bg { background-color: #1a1a1a !important; }
            .dark-mode-text { color: #ffffff !important; }
        }
        
        /* Mobile responsive */
        @media screen and (max-width: 600px) {
            .mobile-full-width { width: 100% !important; }
            .mobile-padding { padding: 10px !important; }
            .mobile-center { text-align: center !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-hide { display: none !important; }
            .email-container { width: 100% !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;font-family:${globalStyles.fontFamily || 'Arial, sans-serif'};max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        ${this.generatePreviewText(blocks)}
    </div>
    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background-color:#f4f4f4;">
        <tr>
            <td align="center" style="padding:20px 0;">
                <table role="presentation" class="email-container" style="width:600px;border-collapse:collapse;border-spacing:0;text-align:left;background-color:${globalStyles.backgroundColor || '#ffffff'};border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                    ${bodyContent}
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        return emailHTML;
    }
    
    generatePreviewText(blocks) {
        const textBlocks = blocks.filter(b => ['text', 'heading', 'boxedText'].includes(b.type));
        if (textBlocks.length === 0) return 'Newsletter';
        
        const firstTextBlock = textBlocks[0];
        const text = firstTextBlock.content.text || firstTextBlock.content.title || '';
        return this.stripHtml(text).substring(0, 100);
    }
    
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    generateBlockHTML(block, globalStyles) {
        const getPadding = (p) => `${p.top} ${p.right} ${p.bottom} ${p.left}`;
        
        switch (block.type) {
            case 'text':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <p style="margin:0;font-size:${block.content.fontSize};line-height:${block.content.lineHeight || '1.6'};color:${block.content.color};text-align:${block.content.textAlign};font-weight:${block.content.fontWeight};font-family:${globalStyles.fontFamily};" class="dark-mode-text">${block.content.text}</p>
                        </td>
                    </tr>
                `;
                
            case 'heading':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <h2 style="margin:0;font-size:${block.content.fontSize};line-height:${block.content.lineHeight || '1.2'};color:${block.content.color};text-align:${block.content.textAlign};font-weight:${block.content.fontWeight};font-family:${globalStyles.fontFamily};" class="dark-mode-text">${block.content.text}</h2>
                        </td>
                    </tr>
                `;
                
            case 'image':
                const imageHtml = `<img src="${block.content.src}" alt="${this.escapeHtml(block.content.alt)}" style="display:block;width:${block.content.width};height:${block.content.height};border-radius:${block.content.borderRadius};margin:0 auto;" class="mobile-full-width">`;
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};text-align:center;">
                            ${block.content.link ? `<a href="${block.content.link}" style="display:block;text-decoration:none;">${imageHtml}</a>` : imageHtml}
                        </td>
                    </tr>
                `;
                
            case 'button':
                return `
                    <tr>
                        <td align="${block.content.textAlign}" style="padding:20px;">
                            <table role="presentation" style="border-collapse:collapse;border-spacing:0;">
                                <tr>
                                    <td align="center" style="background-color:${block.content.backgroundColor};border-radius:${block.content.borderRadius};">
                                        <a href="${block.content.href}" style="font-size:${block.content.fontSize};font-weight:${block.content.fontWeight};color:${block.content.color};text-decoration:none;padding:${getPadding(block.content.padding)};display:inline-block;border-radius:${block.content.borderRadius};font-family:${globalStyles.fontFamily};">${block.content.text}</a>
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
                
            case 'boxedText':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.margin)};">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border-spacing:0;">
                                <tr>
                                    <td style="background-color:${block.content.backgroundColor};border:${block.content.borderWidth} solid ${block.content.borderColor};border-radius:${block.content.borderRadius};padding:${getPadding(block.content.padding)};font-size:${block.content.fontSize};color:${block.content.color};text-align:${block.content.textAlign};font-family:${globalStyles.fontFamily};line-height:1.6;" class="dark-mode-bg dark-mode-text">
                                        ${block.content.text}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                
            case 'columns2':
            case 'columns3':
                const columnWidth = block.type === 'columns2' ? '290' : '190';
                const columnsHtml = block.content.columns.map((col, index) => `
                    <td style="width:${columnWidth}px;vertical-align:top;font-size:${col.fontSize};color:${col.color};text-align:${col.textAlign};font-family:${globalStyles.fontFamily};line-height:1.6;" class="mobile-stack dark-mode-text">
                        ${col.text}
                    </td>
                `).join(`<td style="width:${block.content.gap};">&nbsp;</td>`);
                
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border-spacing:0;">
                                <tr>
                                    ${columnsHtml}
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                
            case 'header':
                if (block.content.imageUrl && block.content.imageUrl.trim() !== '') {
                    const headerImg = `<img src="${block.content.imageUrl}" alt="Header Image" style="display:block;width:100%;height:auto;border:0;" class="mobile-full-width">`;
                    return `
                        <tr>
                            <td style="padding:0;">
                                ${block.content.link ? `<a href="${block.content.link}" style="display:block;text-decoration:none;">${headerImg}</a>` : headerImg}
                            </td>
                        </tr>
                    `;
                } else {
                    return `
                        <tr>
                            <td style="background-color:${block.content.backgroundColor};color:${block.content.textColor};text-align:${block.content.textAlign};padding:${getPadding(block.content.padding)};">
                                <h1 style="margin:0;font-size:32px;font-weight:bold;font-family:${globalStyles.fontFamily};">${block.content.title}</h1>
                                <p style="margin:8px 0 0 0;font-size:16px;opacity:0.9;">${block.content.subtitle}</p>
                            </td>
                        </tr>
                    `;
                }
                
            case 'article':
                const articleImage = `<img src="${block.content.imageUrl}" alt="Article Image" style="display:block;width:100%;height:auto;border-radius:6px;" class="mobile-full-width">`;
                const articleText = `
                    <h3 style="margin:0 0 10px 0;font-size:24px;font-weight:bold;color:${globalStyles.primaryColor};font-family:${globalStyles.fontFamily};" class="dark-mode-text">${block.content.title}</h3>
                    <p style="margin:0 0 15px 0;font-size:16px;color:#333333;font-family:${globalStyles.fontFamily};line-height:1.5;" class="dark-mode-text">${block.content.description}</p>
                    <table role="presentation" style="border-collapse:collapse;border-spacing:0;">
                        <tr>
                            <td style="background-color:${globalStyles.primaryColor};border-radius:4px;">
                                <a href="${block.content.ctaUrl}" style="display:inline-block;padding:10px 20px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;font-family:${globalStyles.fontFamily};">${block.content.ctaText}</a>
                            </td>
                        </tr>
                    </table>
                `;
                
                const articleLayout = block.content.imageLeft 
                    ? `<td style="width:250px;vertical-align:top;padding-right:20px;" class="mobile-stack">${articleImage}</td><td style="vertical-align:top;" class="mobile-stack">${articleText}</td>`
                    : `<td style="vertical-align:top;" class="mobile-stack">${articleText}</td><td style="width:250px;vertical-align:top;padding-left:20px;" class="mobile-stack">${articleImage}</td>`;
                
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border-spacing:0;">
                                <tr>
                                    ${articleLayout}
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                
            case 'imageText':
                const itImage = `<img src="${block.content.imageUrl}" alt="Image" style="display:block;width:100%;height:auto;border-radius:6px;" class="mobile-full-width">`;
                const itText = `
                    <h3 style="margin:0 0 10px 0;font-size:24px;font-weight:bold;color:${globalStyles.primaryColor};font-family:${globalStyles.fontFamily};" class="dark-mode-text">${block.content.title}</h3>
                    <p style="margin:0;font-size:16px;color:#333333;font-family:${globalStyles.fontFamily};line-height:1.5;" class="dark-mode-text">${block.content.text}</p>
                `;
                
                const itLayout = block.content.imageLeft 
                    ? `<td style="width:250px;vertical-align:top;padding-right:20px;" class="mobile-stack">${itImage}</td><td style="vertical-align:top;" class="mobile-stack">${itText}</td>`
                    : `<td style="vertical-align:top;" class="mobile-stack">${itText}</td><td style="width:250px;vertical-align:top;padding-left:20px;" class="mobile-stack">${itImage}</td>`;
                
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border-spacing:0;">
                                <tr>
                                    ${itLayout}
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                
            case 'imageGroup':
                const imageWidth = Math.floor((600 - 40 - (block.content.images.length - 1) * parseInt(block.content.gap)) / block.content.images.length);
                const imagesHtml = block.content.images.map((img, index) => {
                    const imageElement = `<img src="${img.src}" alt="${this.escapeHtml(img.alt)}" style="display:block;width:100%;height:auto;border-radius:6px;" class="mobile-full-width">`;
                    const cellContent = img.href && img.href.trim() !== '' 
                        ? `<a href="${img.href}" style="display:block;text-decoration:none;">${imageElement}</a>`
                        : imageElement;
                    
                    return `<td style="width:${imageWidth}px;vertical-align:top;" class="mobile-stack">${cellContent}</td>`;
                }).join(`<td style="width:${block.content.gap};">&nbsp;</td>`);
                
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border-spacing:0;">
                                <tr>
                                    ${imagesHtml}
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                
            case 'brainTeaser':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border-spacing:0;border:1px solid #f0f0f0;border-radius:8px;">
                                <tr>
                                    <td style="padding:20px;">
                                        ${block.content.imageUrl ? `<img src="${block.content.imageUrl}" alt="Brain teaser image" style="display:block;width:100%;height:auto;margin-bottom:15px;border-radius:6px;" class="mobile-full-width">` : ''}
                                        <h3 style="margin:0 0 15px 0;font-size:24px;font-weight:bold;color:${globalStyles.primaryColor};font-family:${globalStyles.fontFamily};" class="dark-mode-text">${block.content.title}</h3>
                                        <p style="margin:0 0 20px 0;font-size:16px;color:#333333;font-family:${globalStyles.fontFamily};line-height:1.5;" class="dark-mode-text">${block.content.question}</p>
                                        <table role="presentation" style="border-collapse:collapse;border-spacing:0;">
                                            <tr>
                                                <td style="background-color:${globalStyles.primaryColor};border-radius:4px;">
                                                    <a href="${block.content.ctaUrl}" style="display:inline-block;padding:10px 20px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;font-family:${globalStyles.fontFamily};">${block.content.ctaText}</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                
            case 'social':
                const socialIcons = block.content.links.map(link => {
                    const iconUrls = {
                        facebook: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
                        twitter: 'https://cdn-icons-png.flaticon.com/512/124/124021.png',
                        instagram: 'https://cdn-icons-png.flaticon.com/512/124/124024.png',
                        linkedin: 'https://cdn-icons-png.flaticon.com/512/124/124011.png'
                    };
                    
                    return `
                        <td style="padding:0 ${parseInt(block.content.spacing || '10') / 2}px;">
                            <a href="${link.url}" style="display:block;text-decoration:none;">
                                <img src="${iconUrls[link.platform] || iconUrls.facebook}" alt="${link.platform}" style="display:block;width:${block.content.iconSize};height:${block.content.iconSize};border:0;">
                            </a>
                        </td>
                    `;
                }).join('');
                
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};text-align:center;">
                            <h3 style="margin:0 0 15px 0;color:#333333;font-family:${globalStyles.fontFamily};" class="dark-mode-text">${block.content.title}</h3>
                            <table role="presentation" style="border-collapse:collapse;border-spacing:0;margin:0 auto;">
                                <tr>
                                    ${socialIcons}
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                
            case 'footer':
                return `
                    <tr>
                        <td style="background-color:${block.content.backgroundColor};color:${block.content.textColor};font-size:${block.content.fontSize};padding:${getPadding(block.content.padding)};text-align:center;font-family:${globalStyles.fontFamily};" class="dark-mode-bg">
                            <p style="margin:0 0 10px 0;"><strong>${block.content.companyName}</strong></p>
                            <p style="margin:0 0 10px 0;">${block.content.address}</p>
                            <p style="margin:0;">
                                <a href="${block.content.unsubscribeUrl}" style="color:${block.content.textColor};text-decoration:underline;">
                                    ${block.content.unsubscribeText}
                                </a>
                            </p>
                        </td>
                    </tr>
                `;
                
            case 'code':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};">
                            ${block.content.html}
                        </td>
                    </tr>
                `;
                
            case 'video':
                return `
                    <tr>
                        <td style="padding:${getPadding(block.content.padding)};text-align:center;">
                            <table role="presentation" style="border-collapse:collapse;border-spacing:0;margin:0 auto;position:relative;">
                                <tr>
                                    <td style="position:relative;">
                                        <a href="${block.content.videoUrl}" style="display:block;text-decoration:none;position:relative;">
                                            <img src="${block.content.thumbnailUrl}" alt="${this.escapeHtml(block.content.alt)}" style="display:block;width:100%;height:auto;border-radius:6px;" class="mobile-full-width">
                                            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${block.content.playButtonSize};height:${block.content.playButtonSize};background:rgba(0,0,0,0.7);border-radius:50%;text-align:center;line-height:${block.content.playButtonSize};color:${block.content.playButtonColor};font-size:${parseInt(block.content.playButtonSize) / 2}px;">▶</div>
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                
            default:
                return `
                    <tr>
                        <td style="padding:20px;text-align:center;color:#999999;">
                            <p style="margin:0;">Unsupported block type: ${block.type}</p>
                        </td>
                    </tr>
                `;
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
        a.download = `${newsletterData.title || 'newsletter'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Export as plain text for accessibility
    exportAsText(newsletterData) {
        if (!newsletterData.blocks || newsletterData.blocks.length === 0) {
            alert('Your newsletter is empty. Please add content before exporting.');
            return;
        }

        let textContent = `${newsletterData.title || 'Newsletter'}\n${'='.repeat(50)}\n\n`;
        
        newsletterData.blocks.forEach(block => {
            switch (block.type) {
                case 'text':
                case 'boxedText':
                    textContent += `${this.stripHtml(block.content.text)}\n\n`;
                    break;
                case 'heading':
                    textContent += `${this.stripHtml(block.content.text)}\n${'-'.repeat(20)}\n\n`;
                    break;
                case 'button':
                    textContent += `[${block.content.text}] (${block.content.href})\n\n`;
                    break;
                case 'article':
                case 'imageText':
                    textContent += `${block.content.title}\n`;
                    textContent += `${this.stripHtml(block.content.description || block.content.text)}\n`;
                    if (block.content.ctaUrl) {
                        textContent += `Read more: ${block.content.ctaUrl}\n`;
                    }
                    textContent += '\n';
                    break;
                case 'footer':
                    textContent += `${block.content.companyName}\n`;
                    textContent += `${block.content.address}\n`;
                    textContent += `${block.content.unsubscribeText}: ${block.content.unsubscribeUrl}\n\n`;
                    break;
            }
        });

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${newsletterData.title || 'newsletter'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
