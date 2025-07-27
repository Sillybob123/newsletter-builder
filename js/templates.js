const EmailTemplates = {
    modern: {
        name: 'Modern',
        structure: [
            {
                type: 'header',
                content: {
                    title: 'STEM Newsletter',
                    subtitle: 'Latest in Science, Technology, Engineering & Math',
                    backgroundColor: '#007bff',
                    textColor: '#ffffff'
                }
            },
            {
                type: 'article',
                content: {
                    title: 'Designing a Sustainable Future with Sun, Wind, and Water',
                    description: 'Explore the latest innovations in renewable energy and sustainable technology that are shaping our future.',
                    imageUrl: 'https://via.placeholder.com/560x300/007bff/ffffff?text=Article+Image',
                    ctaText: 'Read More',
                    ctaUrl: '#'
                }
            },
            {
                type: 'social',
                content: {
                    links: [
                        { platform: 'linkedin', url: 'https://linkedin.com/company/your-magazine' },
                        { platform: 'twitter', url: 'https://twitter.com/your-magazine' },
                        { platform: 'instagram', url: 'https://instagram.com/your-magazine' }
                    ]
                }
            },
            {
                type: 'footer',
                content: {
                    companyName: 'STEM Magazine',
                    address: '123 Science Street, Tech City, TC 12345',
                    unsubscribeText: 'Unsubscribe from this newsletter'
                }
            }
        ]
    },

    classic: {
        name: 'Classic',
        structure: [
            {
                type: 'header',
                content: {
                    title: 'The STEM Report',
                    subtitle: 'Your Weekly Science & Technology Update',
                    backgroundColor: '#28a745',
                    textColor: '#ffffff'
                }
            },
            {
                type: 'text',
                content: {
                    text: 'Welcome to this week\'s edition of The STEM Report. We\'ve curated the most exciting developments in science and technology for you.',
                    fontSize: '16px',
                    color: '#333333'
                }
            },
            {
                type: 'article',
                content: {
                    title: 'Breaking: New Quantum Computing Breakthrough',
                    description: 'Scientists achieve major milestone in quantum computing that could revolutionize data processing.',
                    ctaText: 'Learn More',
                    ctaUrl: '#'
                }
            },
            {
                type: 'article',
                content: {
                    title: 'Sustainable Energy Solutions for 2024',
                    description: 'Discover the innovative approaches to renewable energy that are gaining traction worldwide.',
                    ctaText: 'Explore',
                    ctaUrl: '#'
                }
            },
            {
                type: 'footer',
                content: {
                    companyName: 'The STEM Report',
                    address: '456 Innovation Ave, Future City, FC 67890',
                    unsubscribeText: 'Update preferences or unsubscribe'
                }
            }
        ]
    },

    minimal: {
        name: 'Minimal',
        structure: [
            {
                type: 'header',
                content: {
                    title: 'STEM Digest',
                    subtitle: '',
                    backgroundColor: '#ffffff',
                    textColor: '#333333',
                    borderBottom: '3px solid #6c757d'
                }
            },
            {
                type: 'article',
                content: {
                    title: 'Featured Article: The Future of Biotechnology',
                    description: 'An in-depth look at how biotechnology is transforming medicine, agriculture, and environmental science.',
                    ctaText: 'Read Article',
                    ctaUrl: '#',
                    layout: 'minimal'
                }
            },
            {
                type: 'text',
                content: {
                    text: 'Quick Links: Recent Publications | Research Database | Subscribe to Updates',
                    fontSize: '14px',
                    color: '#666666',
                    textAlign: 'center'
                }
            },
            {
                type: 'footer',
                content: {
                    companyName: 'STEM Digest',
                    address: '',
                    unsubscribeText: 'Unsubscribe',
                    minimal: true
                }
            }
        ]
    }
};

// Template renderer functions
const TemplateRenderer = {
    renderHeader(content) {
        const style = `
            background-color: ${content.backgroundColor || '#007bff'};
            color: ${content.textColor || '#ffffff'};
            padding: 30px 20px;
            text-align: center;
            ${content.borderBottom ? `border-bottom: ${content.borderBottom};` : ''}
        `;

        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${style}">
                <tr>
                    <td>
                        <h1 style="margin: 0; font-size: 28px; font-weight: 700; font-family: 'DM Sans', Arial, sans-serif;">
                            ${content.title}
                        </h1>
                        ${content.subtitle ? `
                            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; font-family: 'DM Sans', Arial, sans-serif;">
                                ${content.subtitle}
                            </p>
                        ` : ''}
                    </td>
                </tr>
            </table>
        `;
    },

    renderArticle(content) {
        const containerStyle = `
            padding: 30px 20px;
            border-bottom: ${content.layout === 'minimal' ? 'none' : '1px solid #e9ecef'};
        `;

        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${containerStyle}">
                <tr>
                    <td>
                        ${content.imageUrl ? `
                            <img src="${content.imageUrl}" alt="Article Image" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px; display: block;">
                        ` : ''}
                        <h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: bold; color: #000000; line-height: 1.3; font-family: 'DM Sans', Arial, sans-serif;">
                            ${content.title}
                        </h2>
                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #666666; line-height: 1.6; font-family: 'DM Sans', Arial, sans-serif;">
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

    renderText(content) {
        const textAlign = content.textAlign || 'left';
        const style = `
            padding: 20px;
            text-align: ${textAlign};
        `;

        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${style}">
                <tr>
                    <td>
                        <p style="margin: 0; font-size: ${content.fontSize || '16px'}; color: ${content.color || '#333333'}; line-height: 1.6; font-family: 'DM Sans', Arial, sans-serif;">
                            ${content.text}
                        </p>
                    </td>
                </tr>
            </table>
        `;
    },

    renderSocial(content) {
        const socialIcons = {
            linkedin: 'https://cdn-icons-png.flaticon.com/32/174/174857.png',
            twitter: 'https://cdn-icons-png.flaticon.com/32/733/733579.png',
            instagram: 'https://cdn-icons-png.flaticon.com/32/174/174855.png',
            facebook: 'https://cdn-icons-png.flaticon.com/32/733/733547.png'
        };

        const linksHtml = content.links.map(link => `
            <a href="${link.url}" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <img src="${socialIcons[link.platform]}" alt="${link.platform}" style="width: 32px; height: 32px; border-radius: 50%;">
            </a>
        `).join('');

        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 30px 20px; text-align: center;">
                <tr>
                    <td>
                        <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; font-family: 'DM Sans', Arial, sans-serif;">
                            Follow us for more updates:
                        </p>
                        ${linksHtml}
                    </td>
                </tr>
            </table>
        `;
    },

    renderFooter(content) {
        if (content.minimal) {
            return ` <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <tr>
                        <td>
                            <p style="margin: 0; font-size: 12px; color: #666666; font-family: 'DM Sans', Arial, sans-serif;">
                                © ${new Date().getFullYear()} ${content.companyName}
                                ${content.unsubscribeText ? ` | <a href="#" style="color: #007bff; text-decoration: none;">${content.unsubscribeText}</a>` : ''}
                            </p>
                        </td>
                    </tr>
                </table>
            `;
        }

        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 30px 20px; text-align: center;">
                <tr>
                    <td>
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #333333; font-weight: 600; font-family: 'DM Sans', Arial, sans-serif;">
                            ${content.companyName}
                        </p>
                        ${content.address ? `
                            <p style="margin: 0 0 15px 0; font-size: 12px; color: #666666; font-family: 'DM Sans', Arial, sans-serif;">
                                ${content.address}
                            </p>
                        ` : ''}
                        <p style="margin: 0; font-size: 12px; color: #666666; font-family: 'DM Sans', Arial, sans-serif;">
                            © ${new Date().getFullYear()} ${content.companyName}. All rights reserved.
                            <br>
                            <a href="#" style="color: #007bff; text-decoration: none;">${content.unsubscribeText}</a>
                        </p>
                    </td>
                </tr>
            </table>
        `;
    }
};
