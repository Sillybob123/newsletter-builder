const EmailTemplates = {
    minimalist: {
        name: 'Minimalist',
        structure: [
            {
                type: 'heading',
                content: {
                    text: 'Weekly Briefing',
                    padding: { top: '30', right: '30', bottom: '10', left: '30' },
                    fontSize: '36',
                    color: '#222222',
                    textAlign: 'left',
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                content: {
                    text: 'A curated summary of this week’s most important news and insights. Designed for clarity and focus.',
                    padding: { top: '10', right: '30', bottom: '30', left: '30' },
                    fontSize: '18',
                    color: '#555555',
                    textAlign: 'left'
                }
            },
            {
                type: 'divider',
                content: {
                    padding: { top: '10', right: '30', bottom: '10', left: '30' },
                    color: '#eeeeee',
                    height: '1'
                }
            },
            {
                type: 'heading',
                content: {
                    text: 'Lead Story',
                    padding: { top: '20', right: '30', bottom: '10', left: '30' },
                    fontSize: '24',
                    color: '#333333',
                    textAlign: 'left',
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                content: {
                    text: 'This section contains the main article. It is concise and to the point, respecting the reader’s time while delivering maximum value.',
                    padding: { top: '10', right: '30', bottom: '20', left: '30' },
                    fontSize: '16',
                    color: '#333333',
                    textAlign: 'left'
                }
            },
            {
                type: 'button',
                content: {
                    text: 'Read More',
                    href: '#',
                    padding: { top: '12', right: '24', bottom: '12', left: '24' },
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    borderRadius: '5',
                    textAlign: 'left'
                }
            }
        ]
    },
    catalyst_v1: {
        name: 'Catalyst V1',
        structure: [
            {
                type: 'header',
                content: {
                    imageUrl: 'https://ci3.googleusercontent.com/meips/ADKq_NbgAwWYM_MMSu5omcK5--beMjfR_An8j288ytZQKGZsUQSJ_rdf97s-i8YNkX-lyRIin0c7rRuKXtNBzqM3lNiv1m1KxbGZKL0SWmmZIsF_lHclQyhr6KWC0mkVDS5stCAmqnhjHJppX3XN1pYmb88UsH8JV7FxEfE=s0-d-e1-ft#https://mcusercontent.com/d76819924b4f0773791d6827b/images/66b9f1d7-4f68-f6ac-a802-885c31858105.jpg',
                    link: 'https://www.catalyst-magazine.com/'
                }
            },
            {
                type: 'text',
                content: {
                    text: 'A scientist\'s path is rarely a straight line; sometimes the most profound work begins with an unexpected crisis. <br><br> This edition of Catalyst shares stories of ingenuity born from necessity. We feature a pioneer whose harrowing illness redefined the field of biosecurity, a researcher uncovering how coastal forests adapt to survive, and an innovator whose work is creating a more sustainable and equitable world.<br><br>Read on and rediscover the joy of curiosity.',
                    backgroundColor: '#2c2c2e',
                    textColor: '#ffffff',
                    borderRadius: '30px',
                    padding: '18px 24px'
                }
            },
            {
                type: 'article',
                content: {
                    title: 'From Battling a Bioweapon Pathogen to Pioneering Global Health Security',
                    description: 'A battle with a rare, weaponized pathogen led Dr. Rebecca Katz to pioneer the field of global health security. From advising on post-9/11 attacks to COVID-19, Katz remains a critical expert shaping public health and national defense.',
                    imageUrl: 'https://ci3.googleusercontent.com/meips/ADKq_NbE-6OfNMsUi_pzBjCHJ8Th8gZ2UWUigX_Kktl2CDLdDxhNgEnmq1K_tcigVS3um7DgAOMXflFUV0qLCQPnoiOZRPgaB2IzseKt__Bzeezz-LBXhHmeAOIXQGgn-Y38TZZag41sOws7qhfLjectoJdhsw89Pl4OcNix=s0-d-e1-ft#https://mcusercontent.com/d76819924b4f0773791d6827b/images/75a6eef0-fc3d-d3dd-7816-46ff5270a673.jpeg',
                    ctaText: 'See more',
                    ctaUrl: 'https://www.catalyst-magazine.com/post/reframing-health-as-a-national-security-issue',
                    imageLeft: true
                }
            },
            {
                type: 'article',
                content: {
                    title: 'Designing a Sustainable Future with Sun, Wind, and Water',
                    description: 'For innovator Scott Sklar, renewable energy is about more than the grid, it\'s about human impact. His vision is for a practical and accessible energy future.',
                    imageUrl: 'https://ci3.googleusercontent.com/meips/ADKq_NY0mX0MjUrchH53JswSqcxOoqZogPpSxp6lJt9Miw4H9a5lmxl-dIbwiwG0YLviZhfCy7Q1OJlSiCGGCb6vHFCwQfWZUjyrh-Jl555tk3qt5G0yvs-57kvD9MYWXWoIJFBGAyP80mg1tQkotRDQeCXGHhHK7-WlTGOu=s0-d-e1-ft#https://mcusercontent.com/d76819924b4f0773791d6827b/images/2479cf95-1358-74d5-ad9b-fc5767e0b760.jpeg',
                    ctaText: 'See more',
                    ctaUrl: 'https://www.catalyst-magazine.com/post/designing-a-sustainable-future-with-sun-wind-and-water',
                    imageLeft: false
                }
            }
        ]
    }
};