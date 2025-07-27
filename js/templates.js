const EmailTemplates = {
    catalystModern: {
        name: 'Catalyst Modern',
        structure: [
            {
                type: 'header',
                content: {
                    logoUrl: 'https://mcusercontent.com/d76819924b4f0773791d6827b/images/66b9f1d7-4f68-f6ac-a802-885c31858105.jpg',
                    websiteUrl: 'https://www.catalyst-magazine.com/',
                    websiteText: 'catalyst-magazine.com',
                    backgroundColor: '#ffffff',
                    textColor: '#2b2b2b',
                    showDivider: true
                }
            },
            {
                type: 'featuredArticle',
                content: {
                    title: 'Designing a Sustainable Future with Sun, Wind, and Water',
                    description: 'Explore the latest innovations in renewable energy and sustainable technology that are shaping our future.',
                    imageUrl: 'https://via.placeholder.com/560x300/007bff/ffffff?text=Sustainable+Future',
                    ctaText: 'Read Full Article',
                    ctaUrl: 'https://www.catalyst-magazine.com/post/designing-a-sustainable-future-with-sun-wind-and-water',
                    layout: 'imageTop'
                }
            },
            {
                type: 'articleGrid',
                content: {
                    articles: [
                        {
                            title: 'Latest Research in Quantum Computing',
                            description: 'Breakthrough discoveries in quantum technology.',
                            imageUrl: 'https://via.placeholder.com/280x180/28a745/ffffff?text=Quantum',
                            ctaUrl: '#'
                        },
                        {
                            title: 'Biotechnology Innovations',
                            description: 'Revolutionary advances in medical biotechnology.',
                            imageUrl: 'https://via.placeholder.com/280x180/dc3545/ffffff?text=Biotech',
                            ctaUrl: '#'
                        }
                    ]
                }
            },
            {
                type: 'footer',
                content: {
                    companyName: 'Catalyst Magazine',
                    websiteUrl: 'https://www.catalyst-magazine.com/',
                    unsubscribeUrl: 'https://www.catalyst-magazine.com/unsubscribe',
                    backgroundColor: '#ebebeb',
                    textColor: '#666666'
                }
            }
        ]
    },

    catalystClassic: {
        name: 'Catalyst Classic',
        structure: [
            {
                type: 'brandHeader',
                content: {
                    logoUrl: 'https://mcusercontent.com/d76819924b4f0773791d6827b/images/66b9f1d7-4f68-f6ac-a802-885c31858105.jpg',
                    websiteUrl: 'https://www.catalyst-magazine.com/',
                    websiteText: 'catalyst-magazine.com',
                    backgroundColor: '#ffffff',
                    padding: '20px'
                }
            },
            {
                type: 'dottedDivider'
            },
            {
                type: 'twoColumnArticle',
                content: {
                    leftColumn: {
                        title: 'Featured Story',
                        description: 'In-depth analysis of the latest scientific breakthroughs.',
                        ctaText: 'Read More',
                        ctaUrl: '#'
                    },
                    rightColumn: {
                        imageUrl: 'https://via.placeholder.com/280x200/007bff/ffffff?text=Featured',
                        altText: 'Featured article image'
                    }
                }
            },
            {
                type: 'roundedFooter',
                content: {
                    companyName: 'Catalyst Magazine',
                    unsubscribeText: 'Unsubscribe',
                    unsubscribeUrl: '#',
                    backgroundColor: '#ffffff',
                    borderRadius: '40px'
                }
            }
        ]
    },

    catalystMinimal: {
        name: 'Catalyst Minimal',
        structure: [
            {
                type: 'simpleHeader',
                content: {
                    logoUrl: 'https://mcusercontent.com/d76819924b4f0773791d6827b/images/66b9f1d7-4f68-f6ac-a802-885c31858105.jpg',
                    websiteUrl: 'https://www.catalyst-magazine.com/',
                    maxWidth: '660px',
                    backgroundColor: '#ffffff'
                }
            },
            {
                type: 'cleanArticle',
                content: {
                    title: 'The Future of STEM Education',
                    description: 'Exploring innovative approaches to science, technology, engineering, and mathematics education.',
                    ctaText: 'Learn More',
                    ctaUrl: '#',
                    padding: '30px 24px'
                }
            },
            {
                type: 'minimalFooter',
                content: {
                    text: 'Unsubscribe',
                    url: '#',
                    fontSize: '10px',
                    textAlign: 'center',
                    backgroundColor: '#ffffff'
                }
            }
        ]
    }
};

// Enhanced Template Renderer matching your design
const TemplateRenderer = {
    renderHeader(content) {
        const containerStyle = `
            margin: 0px auto;
            max-width: 660px;
        `;
        
        const tableStyle = `
            width: 100%;
            border-collapse: collapse;
        `;
        
        const cellStyle = `
            direction: ltr;
            font-size: 0px;
            padding: 20px;
            text-align: center;
        `;
        
        const leftColumnStyle = `
            font-size: 0px;
            text-align: left;
            direction: ltr;
            display: inline-block;
            vertical-align: middle;
            width: 50%;
        `;
        
        const rightColumnStyle = `
            font-size: 0px;
            text-align: left;
            direction: ltr;
            display: inline-block;
            vertical-align: top;
            width: 50%;
        `;

        return `
            <div style="${containerStyle}">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="${tableStyle}">
                    <tbody>
                        <tr>
                            <td style="${cellStyle}">
                                <div style="${leftColumnStyle}">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align: middle; padding: 10px;">
                                                    <a href="${content.websiteUrl}" style="font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: bold; color: ${content.textColor || '#2b2b2b'}; text-decoration: none;" target="_blank">
                                                        ${content.websiteText || 'catalyst-magazine.com'}
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div style="${rightColumnStyle}">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align: top; padding: 0;">
                                                    <a href="${content.websiteUrl}" target="_blank">
                                                        <img alt="Catalyst Magazine Logo" src="${content.logoUrl}" style="border: 0; display: block; outline: none; text-decoration: none; height: auto; width: 100%; max-width: 660px;" width="660">
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    renderBrandHeader(content) {
        return `
            <tbody>
                <tr>
                    <td style="direction: ltr; font-size: 0px; padding: 20px 0; text-align: center;">
                        <div style="margin: 0px auto; max-width: 660px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <td style="direction: ltr; font-size: 0px; padding: 0; text-align: center;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-size: 0px; word-break: break-word;">
                                                            <a href="${content.websiteUrl}" style="word-break: break-word; display: block;" target="_blank">
                                                                <img alt="Catalyst Magazine Logo" src="${content.logoUrl}" style="border: 0; display: block; outline: none; text-decoration: none; height: auto; width: 100%; max-width: 660px;" width="660">
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        `;
    },

    renderSimpleHeader(content) {
        return `
            <tbody>
                <tr>
                    <td style="direction: ltr; font-size: 0px; padding: 20px 0; text-align: center;">
                        <div style="margin: 0px auto; max-width: ${content.maxWidth || '660px'};">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <td style="direction: ltr; font-size: 0px; padding: 0; text-align: center;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-size: 0px; word-break: break-word;">
                                                            <a href="${content.websiteUrl}" style="word-break: break-word; display: block;" target="_blank">
                                                                <img alt="Catalyst Magazine Logo" src="${content.logoUrl}" style="border: 0; display: block; outline: none; text-decoration: none; height: auto; width: 100%; max-width: 660px;" width="660">
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        `;
    },

    renderDottedDivider() {
        return `
            <tr>
                <td style="padding: 30px 24px 0 24px;">
                    <table role="presentation" style="border-top: 1px dotted #000000; width: 100%;" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                            <tr>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        `;
    },

    renderFeaturedArticle(content) {
        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
                <tr>
                    <td style="padding: 40px 30px;">
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
                                    <td style="background-color: #007bff; border-radius: 6px;">
                                        <a href="${content.ctaUrl}" style="display: inline-block; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: 500; font-size: 16px; font-family: 'DM Sans', Arial, sans-serif; border-radius: 6px;">
                                            ${content.ctaText}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        ` : ''}
                    </td>
                </tr>
            </table>
        `;
    },

    renderTwoColumnArticle(content) {
        return `
            <div style="margin: 0px auto; max-width: 660px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                    <tbody>
                        <tr>
                            <td style="direction: ltr; font-size: 0px; padding: 20px; text-align: center;">
                                <div style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: middle; width: 50%;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align: middle; padding: 10px;">
                                                    <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: bold; color: #000000; font-family: 'DM Sans', Arial, sans-serif;">
                                                        ${content.leftColumn.title}
                                                    </h3>
                                                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #666666; line-height: 1.5; font-family: 'DM Sans', Arial, sans-serif;">
                                                        ${content.leftColumn.description}
                                                    </p>
                                                    ${content.leftColumn.ctaText ? `
                                                        <a href="${content.leftColumn.ctaUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 14px; font-family: 'DM Sans', Arial, sans-serif;">
                                                            ${content.leftColumn.ctaText}
                                                        </a>
                                                    ` : ''}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 50%;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align: top; padding: 0;">
                                                    <img src="${content.rightColumn.imageUrl}" alt="${content.rightColumn.altText}" style="width: 100%; height: auto; border-radius: 8px; display: block;">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    renderArticleGrid(content) {
        const articlesHtml = content.articles.map(article => `
            <div style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 50%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                    <tbody>
                        <tr>
                            <td style="padding: 15px;">
                                <img src="${article.imageUrl}" alt="${article.title}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; display: block;">
                                <h4 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #000000; line-height: 1.3; font-family: 'DM Sans', Arial, sans-serif;">
                                    ${article.title}
                                </h4>
                                <p style="margin: 0 0 15px 0; font-size: 14px; color: #666666; line-height: 1.5; font-family: 'DM Sans', Arial, sans-serif;">
                                    ${article.description}
                                </p>
                                <a href="${article.ctaUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; font-size: 14px; font-family: 'DM Sans', Arial, sans-serif;">
                                    Read More
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `).join('');

        return `
            <div style="margin: 0px auto; max-width: 660px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                    <tbody>
                        <tr>
                            <td style="direction: ltr; font-size: 0px; padding: 20px; text-align: center;">
                                ${articlesHtml}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    renderCleanArticle(content) {
        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
                <tr>
                    <td style="padding: ${content.padding || '30px 24px'};">
                        <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: bold; color: #000000; line-height: 1.3; font-family: 'DM Sans', Arial, sans-serif;">
                            ${content.title}
                        </h2>
                        <p style="margin: 0 0 25px 0; font-size: 16px; color: #666666; line-height: 1.6; font-family: 'DM Sans', Arial, sans-serif;">
                            ${content.description}
                        </p>
                        ${content.ctaText && content.ctaUrl ? `
                            <a href="${content.ctaUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 14px; font-family: 'DM Sans', Arial, sans-serif;">
                                ${content.ctaText}
                            </a>
                        ` : ''}
                    </td>
                </tr>
            </table>
        `;
    },

    renderFooter(content) {
        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${content.backgroundColor || '#ebebeb'}; padding: 40px 30px; text-align: center;">
                <tr>
                    <td>
                        <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; font-weight: 600; font-family: 'DM Sans', Arial, sans-serif;">
                            ${content.companyName}
                        </p>
                        <p style="margin: 0; font-size: 12px; color: ${content.textColor || '#666666'}; font-family: 'DM Sans', Arial, sans-serif; line-height: 1.5;">
                            © ${new Date().getFullYear()} ${content.companyName}. All rights reserved.
                            <br><br>
                            <a href="${content.websiteUrl}" style="color: #007bff; text-decoration: none;">
                                Visit our website
                            </a>
                            |
                            <a href="${content.unsubscribeUrl}" style="color: #007bff; text-decoration: none;">
                                Unsubscribe
                            </a>
                        </p>
                    </td>
                </tr>
            </table>
        `;
    },

    renderRoundedFooter(content) {
        return `
            <table width="100%" style="border: 0px; background-color: ${content.backgroundColor || '#ffffff'}; border-radius: 0px 0px ${content.borderRadius || '40px'} ${content.borderRadius || '40px'};">
                <tbody>
                    <tr>
                        <td style="word-break: break-word; padding: 12px 0px 0px;">
                            <div style="font-family: 'DM Sans', sans-serif; color: rgb(0,0,0); width: 657px;">
                                <p style="margin: 0px; padding: 0px; word-break: break-word; font-size: 16px; line-height: 1.5; text-align: center; letter-spacing: 0px; direction: ltr;">
                                    <a href="${content.unsubscribeUrl}" style="color: rgb(0,0,0); word-break: break-word; direction: ltr;" target="_blank">
                                        <span style="font-size: 10px;">${content.unsubscribeText || 'Unsubscribe'}</span>
                                    </a>
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    renderMinimalFooter(content) {
        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${content.backgroundColor || '#ffffff'}; padding: 20px; text-align: ${content.textAlign || 'center'};">
                <tr>
                    <td>
                        <p style="margin: 0; font-size: ${content.fontSize || '10px'}; color: #000000; font-family: 'DM Sans', Arial, sans-serif;">
                            <a href="${content.url}" style="color: #000000; text-decoration: none;">
                                ${content.text}
                            </a>
                        </p>
                    </td>
                </tr>
            </table>
        `;
    }
};
