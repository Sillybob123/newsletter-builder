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
            },
            {
                type: 'brainTeaser',
                content: {
                    title: 'Solve Our Brain Teaser',
                    question: 'A man is asked about his children. He replies with two curious statements:<br><br><i>"Every son I have has the same number of brothers as he has sisters."</i><br><br><i>"Every daughter I have has twice as many brothers as she has sisters."</i><br><br>How many sons and daughters does the man have?',
                    imageUrl: 'https://ci3.googleusercontent.com/meips/ADKq_NbUnHkUSjlsnm3Jv7NKBhk1byklJyqOK3LSNMbHQrqCpfdmJgfCz1Dw6en83pVY2EzIcwAhVtW8-ARNMtBmehIilYtnIXKSPydnWAVQblCSx-PfD_QkOHtFFHBC0hCx2NicI05bjHWkxx18JOAAa_gFTrM8QQppLG2k=s0-d-e1-ft#https://mcusercontent.com/d76819924b4f0773791d6827b/images/7d3828a4-5525-72a0-6b9c-7426b23c1595.jpeg',
                    ctaText: 'Submit Your Answer',
                    ctaUrl: 'https://www.catalyst-magazine.com/#teaser'
                }
            },
            {
                type: 'footer',
                content: {
                    companyName: 'catalyst-magazine.com',
                    companyUrl: 'http://catalyst-magazine.com/',
                    socialLinks: [
                        { platform: 'linkedin', url: 'https://www.linkedin.com/company/the-catalyst-stem-magazine' },
                        { platform: 'instagram', url: 'https://www.instagram.com/thecatalyst_dc' }
                    ]
                }
            }
        ]
    },
    catalyst_v2: {
        name: 'Catalyst V2',
        structure: [
            {
                type: 'header',
                content: {
                    imageUrl: 'https://ci3.googleusercontent.com/meips/ADKq_NbgAwWYM_MMSu5omcK5--beMjfR_An8j288ytZQKGZsUQSJ_rdf97s-i8YNkX-lyRIin0c7rRuKXtNBzqM3lNiv1m1KxbGZKL0SWmmZIsF_lHclQyhr6KWC0mkVDS5stCAmqnhjHJppX3XN1pYmb88UsH8JV7FxEfE=s0-d-e1-ft#https://mcusercontent.com/d76819924b4f0773791d6827b/images/66b9f1d7-4f68-f6ac-a802-885c31858105.jpg',
                    link: 'https://catalyst-magazine.com/'
                }
            },
            {
                type: 'text',
                content: {
                    text: '<em>In this issue, we break down real-world science, from Dr. Song Gao’s take on how atmospheric chemistry meets policy to Tyler Wyka’s work on decarbonizing energy systems. We also uncover the genetics behind insect coloration and explore why you can’t tickle yourself silly.</em><br><br><em>As <strong>Albert Einstein</strong> once said, “I have no special talent. I am only passionately curious.” Let that spark your curiosity, and dive into the articles below!</em>',
                    backgroundColor: '#2c2c2e',
                    textColor: '#ffffff',
                    borderRadius: '30px',
                    padding: '18px 24px'
                }
            },
            {
                type: 'article',
                content: {
                    title: 'Pollution to Solution: Dr. Song Gao on Environmental Sustainability',
                    description: 'Dr. Song Gao bridges science and policy to tackle climate change. From aerosols to ozone, his work reveals how atmospheric chemistry and flexible international agreements like the Montreal Protocol can shape real-world sustainability and environmental solutions.',
                    imageUrl: 'https://ci3.googleusercontent.com/meips/ADKq_NYV1ZpPcHjRVY0d2y1r-hjgIUTXgIbwQcG5_JuNWCrd7Rvl9Aecmi8auARj6K6GHaVmo0IrmJyBf4JmAqqeajVAL4oaFUB-s3yF3z4l05n6U3_0n8QpGtMA334Oixf3G8CimWMoNsR5DEHEzHe6mLawfASCuZWDDKlN=s0-d-e1-ft#https://mcusercontent.com/d76819924b4f0773791d6827b/images/8ee205f5-06ff-99e6-b269-f8e4e0d9d1e8.jpeg',
                    ctaText: 'See more',
                    ctaUrl: 'https://www.catalyst-magazine.com/post/pollution-to-solution-dr-song-gao-on-science-policy-and-environmental-sustainability',
                    imageLeft: true
                }
            },
            {
                type: 'article',
                content: {
                    title: 'How One Engineer is Changing Sustainable Fuels',
                    description: 'Tyler Wyka blends engineering, policy, and global collaboration to tackle climate change. From turbine fuel research to building solar infrastructure in Sierra Leone, his journey shows how curiosity, innovation, and interdisciplinary action can drive sustainable change.',
                    imageUrl: 'https://ci3.googleusercontent.com/meips/ADKq_NbUV3iE24tnoSnOchHSVHd3tzMrR8eLrhdF9hskQ-mFfVdthM_jV903wEplWy60RvYaw9y-hcjur_Lrc3jBizdP_hj9Bv6BwticggTfzHf_mSfm7pDbdhh1vAjBVIFCtU_50DmSMKkGl885rDps9-MAJvZMV4wQQHY9=s0-d-e1-ft#https://mcusercontent.com/d76819924b4f0773791d6827b/images/c4e38886-74cc-51f5-1784-01e9ea397787.jpeg',
                    ctaText: 'See more',
                    ctaUrl: 'https://www.catalyst-magazine.com/post/how-one-engineer-is-changing-sustainable-fuels',
                    imageLeft: false
                }
            },
            {
                type: 'brainTeaser',
                content: {
                    title: 'The Elevator Escape',
                    question: 'An elevator is on the ground floor. There are four people in the elevator including me. When the lift reaches the first floor, one person gets out and three people get in. The lift goes up to the second floor, two people get out, six people get in. It then goes up to the next floor, no one gets out but 12 people get in. Halfway up to the next floor, the elevator cable <strong>snaps</strong>. It crashes to the floor. Everyone else dies in the elevator except me.<br><br><em><strong>How did I survive?</strong></em>',
                    imageUrl: 'https://ci3.googleusercontent.com/meips/ADKq_NaPT4Nak-HNyFS_F-1hiMSHpU98TCgPsxrDfSgJAl2ZZJ1PZv98UKqfzQdqQaGZjKq0rm3ASHA8JQX1i4DgIrG-IQNsxwqR2vOFItUZHriW0sfCgMhtgl_6CCq3sIWdKZq_3OCMTAct5C-qgEI0JPrzv6LM-3mJjcdG=s0-d-e1-ft#https://mcusercontent.com/d76819924b4f0773791d6827b/images/ce0579ed-9b2e-d587-e8bd-e1ca22e3fb51.jpeg',
                    ctaText: 'Submit Your Answer',
                    ctaUrl: 'https://www.catalyst-magazine.com/#teaser'
                }
            },
            {
                type: 'footer',
                content: {
                    companyName: 'catalyst-magazine.com',
                    companyUrl: 'http://catalyst-magazine.com/',
                    socialLinks: [
                        { platform: 'linkedin', url: 'https://www.linkedin.com/company/the-catalyst-stem-magazine' },
                        { platform: 'instagram', url: 'https://www.instagram.com/thecatalyst_dc' }
                    ],
                    unsubscribeUrl: 'https://www.catalyst-magazine.com/unsubscribe'
                }
            }
        ]
    }
};
