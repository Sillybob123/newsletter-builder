const EmailTemplates = {
    productLaunch: {
        name: 'Product Launch',
        structure: [
            {
                type: 'header',
                content: { imageUrl: 'https://via.placeholder.com/600x200/4a4a4a/ffffff?text=Our+New+Product', link: '#' }
            },
            {
                type: 'heading',
                content: { padding: { top: 30, right: 30, bottom: 10, left: 30 }, text: 'It’s Here: The Future of Innovation', fontSize: 32, color: '#222222', textAlign: 'center', fontWeight: 'bold' }
            },
            {
                type: 'text',
                content: { padding: { top: 10, right: 40, bottom: 20, left: 40 }, text: 'We are incredibly excited to announce the launch of our revolutionary new product. After months of hard work and dedication, we’ve created something that will change the way you work.', fontSize: 18, lineHeight: 1.6, color: '#555555', textAlign: 'center' }
            },
            {
                type: 'button',
                content: { padding: { top: 10, right: 30, bottom: 30, left: 30 }, href: '#', text: 'Discover The Product', backgroundColor: '#007bff', color: '#ffffff', borderRadius: 5, align: 'center', fontWeight: 'bold', fontSize: 18 }
            },
            {
                type: 'article',
                content: { padding: { top: 20, right: 20, bottom: 20, left: 20 }, title: 'Unmatched Performance', description: 'Experience speed and efficiency like never before. Our new product is built on a next-generation platform, delivering unparalleled performance.', imageUrl: 'https://via.placeholder.com/250x200/007bff/ffffff', imageLeft: true, ctaText: 'Learn More', ctaUrl: '#' }
            },
            {
                type: 'divider',
                content: { padding: { top: 20, right: 20, bottom: 20, left: 20 }, color: '#eeeeee', height: 1, style: 'solid' }
            },
            {
                type: 'article',
                content: { padding: { top: 20, right: 20, bottom: 20, left: 20 }, title: 'Sleek, Intuitive Design', description: 'A beautiful interface that is a joy to use. We designed every pixel to create the most intuitive and user-friendly experience possible.', imageUrl: 'https://via.placeholder.com/250x200/333333/ffffff', imageLeft: false, ctaText: 'See The Gallery', ctaUrl: '#' }
            },
            {
                type: 'footer',
                content: { backgroundColor: '#f8f9fa', textColor: '#6c757d', companyName: 'Innovate Inc.', address: '123 Innovation Drive, Techville, USA', unsubscribeUrl: '#', socialLinks: [{ platform: 'linkedin', url: '#' }, { platform: 'instagram', url: '#' }] }
            }
        ]
    },
    weeklyDigest: {
        name: 'Weekly Digest',
        structure: [
            {
                type: 'heading',
                content: { padding: { top: 30, right: 30, bottom: 0, left: 30 }, text: 'Your Weekly Digest', fontSize: 36, color: '#2c3e50', textAlign: 'left', fontWeight: 'bold' }
            },
            {
                type: 'text',
                content: { padding: { top: 5, right: 30, bottom: 20, left: 30 }, text: 'The most important updates from the past week.', fontSize: 18, color: '#7f8c8d', textAlign: 'left' }
            },
            {
                type: 'image',
                content: { padding: { top: 0, right: 0, bottom: 0, left: 0 }, src: 'https://via.placeholder.com/600x250/3498db/ffffff?text=Featured+Story', alt: 'Featured Story', link: '#', borderRadius: 0 }
            },
            {
                type: 'heading',
                content: { padding: { top: 20, right: 30, bottom: 10, left: 30 }, text: 'The Week\'s Top Story', fontSize: 24, color: '#34495e', textAlign: 'left', fontWeight: 'bold' }
            },
            {
                type: 'text',
                content: { padding: { top: 0, right: 30, bottom: 20, left: 30 }, text: 'This week, we saw major developments in the industry. Here is a quick breakdown of what you need to know and why it matters for the future.', fontSize: 16, lineHeight: 1.6, color: '#333333', textAlign: 'left' }
            },
            {
                type: 'button',
                content: { padding: { top: 0, right: 30, bottom: 30, left: 30 }, href: '#', text: 'Read Full Story', backgroundColor: '#3498db', color: '#ffffff', borderRadius: 5, align: 'left', fontWeight: 'bold', fontSize: 16 }
            },
            {
                type: 'footer',
                content: { backgroundColor: '#ecf0f1', textColor: '#95a5a6', companyName: 'Digestible News', address: '456 Knowledge Ave, Infotown, USA', unsubscribeUrl: '#', socialLinks: [{ platform: 'linkedin', url: '#' }, { platform: 'instagram', url: '#' }] }
            }
        ]
    },
};