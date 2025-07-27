class NewsletterBuilder {
    constructor() {
        this.currentNewsletter = {
            title: '',
            content: [],
            settings: {
                brandColor: '#007bff',
                fontSize: '16px'
            }
        };
        this.selectedElement = null;
        this.history = [];
        this.historyIndex = -1;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTemplates();
        this.setupDragAndDrop();
    }

    bindEvents() {
        // Template selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectTemplate(e.currentTarget.dataset.template);
            });
        });

        // Content block buttons
        document.querySelectorAll('.block-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addContentBlock(e.currentTarget.dataset.block);
            });
        });

        // Settings inputs
        document.getElementById('newsletter-title').addEventListener('input', (e) => {
            this.currentNewsletter.title = e.target.value;
            this.saveToHistory();
        });

        document.getElementById('brand-color').addEventListener('change', (e) => {
            this.currentNewsletter.settings.brandColor = e.target.value;
            this.updatePreview();
            this.saveToHistory();
        });

        document.getElementById('font-size').addEventListener('change', (e) => {
            this.currentNewsletter.settings.fontSize = e.target.value + 'px';
            this.updatePreview();
            this.saveToHistory();
        });

        // Toolbar buttons
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.showPreview();
        });

        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportNewsletter();
        });

        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undo();
        });

        document.getElementById('redo-btn').addEventListener('click', () => {
            this.redo();
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearNewsletter();
        });

        // Modal events
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn .addEventListener('click', (e) => {
                this.switchPreviewTab(e.currentTarget.dataset.tab);
            });
        });

        // Close modal on outside click
        document.getElementById('preview-modal').addEventListener('click', (e) => {
            if (e.target.id === 'preview-modal') {
                this.closeModal();
            }
        });
    }

    loadTemplates() {
        // Templates are loaded from templates.js
        console.log('Templates loaded:', Object.keys(EmailTemplates));
    }

    selectTemplate(templateName) {
        // Remove active class from all templates
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected template
        document.querySelector(`[data-template="${templateName}"]`).classList.add('active');

        // Load template structure
        if (EmailTemplates[templateName]) {
            this.currentNewsletter.content = [...EmailTemplates[templateName].structure];
            this.updatePreview();
            this.saveToHistory();
        }
    }

    addContentBlock(blockType) {
        const newBlock = this.createContentBlock(blockType);
        this.currentNewsletter.content.push(newBlock);
        this.updatePreview();
        this.saveToHistory();
    }

    createContentBlock(type) {
        const blockTemplates = {
            header: {
                type: 'header',
                content: {
                    logoUrl: 'https://mcusercontent.com/d76819924b4f0773791d6827b/images/66b9f1d7-4f68-f6ac-a802-885c31858105.jpg',
                    websiteUrl: 'https://www.catalyst-magazine.com/',
                    websiteText: 'catalyst-magazine.com',
                    backgroundColor: '#ffffff',
                    textColor: '#2b2b2b'
                }
            },
            brandHeader: {
                type: 'brandHeader',
                content: {
                    logoUrl: 'https://mcusercontent.com/d76819924b4f0773791d6827b/images/66b9f1d7-4f68-f6ac-a802-885c31858105.jpg',
                    websiteUrl: 'https://www.catalyst-magazine.com/',
                    websiteText: 'catalyst-magazine.com',
                    backgroundColor: '#ffffff',
                    padding: '20px'
                }
            },
            simpleHeader: {
                type: 'simpleHeader',
                content: {
                    logoUrl: 'https://mcusercontent.com/d76819924b4f0773791d6827b/images/66b9f1d7-4f68-f6ac-a802-885c31858105.jpg',
                    websiteUrl: 'https://www.catalyst-magazine.com/',
                    maxWidth: '660px',
                    backgroundColor: '#ffffff'
                }
            },
            featuredArticle: {
                type: 'featuredArticle',
                content: {
                    title: 'Featured Article Title',
                    description: 'This is a featured article with prominent placement and styling.',
                    imageUrl: 'https://via.placeholder.com/560x300/007bff/ffffff?text=Featured+Article',
                    ctaText: 'Read Full Article',
                    ctaUrl: '#',
                    layout: 'imageTop'
                }
            },
            twoColumnArticle: {
                type: 'twoColumnArticle',
                content: {
                    leftColumn: {
                        title: 'Article Title',
                        description: 'Article description goes here with engaging content.',
                        ctaText: 'Read More',
                        ctaUrl: '#'
                    },
                    rightColumn: {
                        imageUrl: 'https://via.placeholder.com/280x200/007bff/ffffff?text=Article+Image',
                        altText: 'Article image'
                    }
                }
            },
            articleGrid: {
                type: 'articleGrid',
                content: {
                    articles: [
                        {
                            title: 'Article One',
                            description: 'Brief description of the first article.',
                            imageUrl: 'https://via.placeholder.com/280x180/28a745/ffffff?text=Article+1',
                            ctaUrl: '#'
                        },
                        {
                            title: 'Article Two',
                            description: 'Brief description of the second article.',
                            imageUrl: 'https://via.placeholder.com/280x180/dc3545/ffffff?text=Article+2',
                            ctaUrl: '#'
                        }
                    ]
                }
            },
            cleanArticle: {
                type: 'cleanArticle',
                content: {
                    title: 'Clean Article Title',
                    description: 'Clean, minimal article layout perfect for focused content.',
                    ctaText: 'Learn More',
                    ctaUrl: '#',
                    padding: '30px 24px'
                }
            },
            article: {
                type: 'article',
                content: {
                    title: 'Article Title',
                    description: 'Article description goes here. Add your content to engage your readers.',
                    imageUrl: 'https://via.placeholder.com/560x300/007bff/ffffff?text=Article+Image',
                    ctaText: 'Read More',
                    ctaUrl: '#'
                }
            },
            text: {
                type: 'text',
                content: {
                    text: 'Add your text content here.',
                    fontSize: this.currentNewsletter.settings.fontSize,
                    color: '#333333',
                    textAlign: 'left'
                }
            },
            image: {
                type: 'image',
                content: {
                    imageUrl: 'https://via.placeholder.com/560x300/f8f9fa/333333?text=Image+Placeholder',
                    altText: 'Image description'
                }
            },
            dottedDivider: {
                type: 'dottedDivider',
                content: {}
            },
            social: {
                type: 'social',
                content: {
                    links: [
                        { platform: 'linkedin', url: 'https://linkedin.com/company/your-company' },
                        { platform: 'twitter', url: 'https://twitter.com/your-company' },
                        { platform: 'instagram', url: 'https://instagram.com/your-company' }
                    ]
                }
            },
            footer: {
                type: 'footer',
                content: {
                    companyName: 'Your Company Name',
                    websiteUrl: 'https://www.catalyst-magazine.com/',
                    unsubscribeUrl: 'https://www.catalyst-magazine.com/unsubscribe',
                    backgroundColor: '#ebebeb',
                    textColor: '#666666'
                }
            },
            roundedFooter: {
                type: 'roundedFooter',
                content: {
                    companyName: 'Your Company Name',
                    unsubscribeText: 'Unsubscribe',
                    unsubscribeUrl: '#',
                    backgroundColor: '#ffffff',
                    borderRadius: '40px'
                }
            },
            minimalFooter: {
                type: 'minimalFooter',
                content: {
                    text: 'Unsubscribe',
                    url: '#',
                    fontSize: '10px',
                    textAlign: 'center',
                    backgroundColor: '#ffffff'
                }
            }
        };

        return blockTemplates[type] || blockTemplates.text;
    }

    updatePreview() {
        const canvas = document.getElementById('newsletter-canvas');
        const emptyState = canvas.querySelector('.empty-state');
        
        if (this.currentNewsletter.content.length === 0) {
            if (!emptyState) {
                canvas.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-mouse-pointer"></i>
                        <h3>Start Building Your Newsletter</h3>
                        <p>Select a template or add content blocks to get started</p>
                    </div>
                `;
            }
            return;
        }

        // Remove empty state
        if (emptyState) {
            emptyState.remove();
        }

        // Generate preview HTML
        const previewHTML = this.generatePreviewHTML();
        canvas.innerHTML = `
            <div class="newsletter-preview">
                ${previewHTML}
            </div>
        `;

        // Add event listeners to content blocks
        this.bindContentBlockEvents();
    }

    generatePreviewHTML() {
        return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
                ${this.currentNewsletter.content.map((block, index) => 
                    this.renderPreviewBlock(block, index)
                ).join('')}
            </table>
        `;
    }

    renderPreviewBlock(block, index) {
        const blockHtml = TemplateRenderer[`render${this.capitalizeFirst(block.type)}`](block.content);
        
        return `
            <tr>
                <td class="content-block" data-block-index="${index}" data-block-type="${block.type}">
                    <div class="block-controls">
                        <button class="control-btn edit" onclick="newsletterBuilder.editBlock(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="control-btn move-up" onclick="newsletterBuilder.moveBlock(${index}, 'up')" ${index === 0 ? 'disabled' : ''}>
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button class="control-btn move-down" onclick="newsletterBuilder.moveBlock(${index}, 'down')" ${index === this.currentNewsletter.content.length - 1 ? 'disabled' : ''}>
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        <button class="control-btn delete" onclick="newsletterBuilder.deleteBlock(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    ${blockHtml}
                </td>
            </tr>
        `;
    }

    bindContentBlockEvents() {
        document.querySelectorAll('.content-block').forEach(block => {
            block.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectBlock(parseInt(block.dataset.blockIndex));
            });
        });

        // Deselect when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.content-block') && !e.target.closest('.properties-panel')) {
                this.deselectBlock();
            }
        });
    }

    selectBlock(index) {
        // Remove previous selection
        document.querySelectorAll('.content-block').forEach(block => {
            block.classList.remove('selected');
        });

        // Select new block
        const blockElement = document.querySelector(`[data-block-index="${index}"]`);
        if (blockElement) {
            blockElement.classList.add('selected');
            this.selectedElement = index;
            this.showBlockProperties(index);
        }
    }

    deselectBlock() {
        document.querySelectorAll('.content-block').forEach(block => {
            block.classList.remove('selected');
        });
        this.selectedElement = null;
        this.hideBlockProperties();
    }

    showBlockProperties(index) {
        const block = this.currentNewsletter.content[index];
        const propertiesPanel = document.getElementById('properties-content');
        
        propertiesPanel.innerHTML = this.generatePropertiesForm(block, index);
        this.bindPropertiesEvents(index);
    }

    generatePropertiesForm(block, index) {
        const { type, content } = block;
        
        switch (type) {
            case 'header':
                return `
                    <div class="property-group">
                        <label>Logo URL:</label>
                        <input type="url" id="prop-logo-url" value="${content.logoUrl}">
                    </div>
                    <div class="property-group">
                        <label>Website URL:</label>
                        <input type="url" id="prop-website-url" value="${content.websiteUrl}">
                    </div>
                    <div class="property-group">
                        <label>Website Text:</label>
                        <input type="text" id="prop-website-text" value="${content.websiteText}">
                    </div>
                    <div class="property-group">
                        <label>Background Color:</label>
                        <input type="color" id="prop-bg-color" value="${content.backgroundColor}">
                    </div>
                    <div class="property-group">
                        <label>Text Color:</label>
                        <input type="color" id="prop-text-color" value="${content.textColor}">
                    </div>
                `;

            case 'brandHeader':
                return `
                    <div class="property-group">
                        <label>Logo URL:</label>
                        <input type="url" id="prop-logo-url" value="${content.logoUrl}">
                    </div>
                    <div class="property-group">
                        <label>Website URL:</label>
                        <input type="url" id="prop-website-url" value="${content.websiteUrl}">
                    </div>
                    <div class="property-group">
                        <label>Website Text:</label>
                        <input type="text" id="prop-website-text" value="${content.websiteText}">
                    </div>
                    <div class="property-group">
                        <label>Background Color:</label>
                        <input type="color" id="prop-bg-color" value="${content.backgroundColor}">
                    </div>
                `;

            case 'simpleHeader':
                return `
                    <div class="property-group">
                        <label>Logo URL:</label>
                        <input type="url" id="prop-logo-url" value="${content.logoUrl}">
                    </div>
                    <div class="property-group">
                        <label>Website URL:</label>
                        <input type="url" id="prop-website-url" value="${content.websiteUrl}">
                    </div>
                    <div class="property-group">
                        <label>Max Width:</label>
                        <input type="text" id="prop-max-width" value="${content.maxWidth}">
                    </div>
                    <div class="property-group">
                        <label>Background Color:</label>
                        <input type="color" id="prop-bg-color" value="${content.backgroundColor}">
                    </div>
                `;

            case 'featuredArticle':
                return `
                    <div class="property-group">
                        <label>Title:</label>
                        <input type="text" id="prop-title" value="${content.title}">
                    </div>
                    <div class="property-group">
                        <label>Description:</label>
                        <textarea id="prop-description" rows="4">${content.description}</textarea>
                    </div>
                    <div class="property-group">
                        <label>Image URL:</label>
                        <input type="url" id="prop-image-url" value="${content.imageUrl || ''}">
                    </div>
                    <div class="property-group">
                        <label>Button Text:</label>
                        <input type="text" id="prop-cta-text" value="${content.ctaText || ''}">
                    </div>
                    <div class="property-group">
                        <label>Button URL:</label>
                        <input type="url" id="prop-cta-url" value="${content.ctaUrl || ''}">
                    </div>
                `;

            case 'twoColumnArticle':
                return `
                    <div class="property-group">
                        <h4>Left Column</h4>
                        <label>Title:</label>
                        <input type="text" id="prop-left-title" value="${content.leftColumn.title}">
                        <label>Description:</label>
                        <textarea id="prop-left-description" rows="3">${content.leftColumn.description}</textarea>
                        <label>Button Text:</label>
                        <input type="text" id="prop-left-cta-text" value="${content.leftColumn.ctaText || ''}">
                        <label>Button URL:</label>
                        <input type="url" id="prop-left-cta-url" value="${content.leftColumn.ctaUrl || ''}">
                    </div>
                    <div class="property-group">
                        <h4>Right Column</h4>
                        <label>Image URL:</label>
                        <input type="url" id="prop-right-image-url" value="${content.rightColumn.imageUrl}">
                        <label>Alt Text:</label>
                        <input type="text" id="prop-right-alt-text" value="${content.rightColumn.altText || ''}">
                    </div>
                `;

            case 'articleGrid':
                return `
                    <div class="property-group">
                        <label>Articles:</label>
                        ${content.articles.map((article, i) => `
                            <div class="article-item" style="border: 1px solid #e9ecef; padding: 15px; margin: 10px 0; border-radius: 6px;">
                                <h5>Article ${i + 1}</h5>
                                <label>Title:</label>
                                <input type="text" id="prop-article-title-${i}" value="${article.title}">
                                <label>Description:</label>
                                <textarea id="prop-article-description-${i}" rows="2">${article.description}</textarea>
                                <label>Image URL:</label>
                                <input type="url" id="prop-article-image-${i}" value="${article.imageUrl}">
                                <label>URL:</label>
                                <input type="url" id="prop-article-url-${i}" value="${article.ctaUrl}">
                                <button type="button" class="btn btn-sm btn-danger" onclick="newsletterBuilder.removeArticle(${index}, ${i})" style="margin-top: 10px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Remove</button>
                            </div>
                        `).join('')}
                        <button type="button" class="btn btn-secondary" onclick="newsletterBuilder.addArticle(${index})" style="margin-top: 10px; padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-plus"></i> Add Article
                        </button>
                    </div>
                `;

            case 'cleanArticle':
                return `
                    <div class="property-group">
                        <label>Title:</label>
                        <input type="text" id="prop-title" value="${content.title}">
                    </div>
                    <div class="property-group">
                        <label>Description:</label>
                        <textarea id="prop-description" rows="4">${content.description}</textarea>
                    </div>
                    <div class="property-group">
                        <label>Button Text:</label>
                        <input type="text" id="prop-cta-text" value="${content.ctaText || ''}">
                    </div>
                    <div class="property-group">
                        <label>Button URL:</label>
                        <input type="url" id="prop-cta-url" value="${content.ctaUrl || ''}">
                    </div>
                    <div class="property-group">
                        <label>Padding:</label>
                        <input type="text" id="prop-padding" value="${content.padding || '30px 24px'}">
                    </div>
                `;

            case 'article':
                return `
                    <div class="property-group">
                        <label>Title:</label>
                        <input type="text" id="prop-title" value="${content.title}">
                    </div>
                    <div class="property-group">
                        <label>Description:</label>
                        <textarea id="prop-description" rows="4">${content.description}</textarea>
                    </div>
                    <div class="property-group">
                        <label>Image URL:</label>
                        <input type="url" id="prop-image-url" value="${content.imageUrl || ''}">
                    </div>
                    <div class="property-group">
                        <label>Button Text:</label>
                        <input type="text" id="prop-cta-text" value="${content.ctaText || ''}">
                    </div>
                    <div class="property-group">
                        <label>Button URL:</label>
                        <input type="url" id="prop-cta-url" value="${content.ctaUrl || ''}">
                    </div>
                `;

            case 'text':
                return `
                    <div class="property-group">
                        <label>Text:</label>
                        <textarea id="prop-text" rows="6">${content.text}</textarea>
                    </div>
                    <div class="property-group">
                        <label>Font Size:</label>
                        <select id="prop-font-size">
                            <option value="12px" ${content.fontSize === '12px' ? 'selected' : ''}>12px</option>
                            <option value="14px" ${content.fontSize === '14px' ? 'selected' : ''}>14px</option>
                            <option value="16px" ${content.fontSize === '16px' ? 'selected' : ''}>16px</option>
                            <option value="18px" ${content.fontSize === '18px' ? 'selected' : ''}>18px</option>
                            <option value="20px" ${content.fontSize === '20px' ? 'selected' : ''}>20px</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label>Text Color:</label>
                        <input type="color" id="prop-text-color" value="${content.color}">
                    </div>
                    <div class="property-group">
                        <label>Alignment:</label>
                        <select id="prop-text-align">
                            <option value="left" ${content.textAlign === 'left' ? 'selected' : ''}>Left</option>
                            <option value="center" ${content.textAlign === 'center' ? 'selected' : ''}>Center</option>
                            <option value="right" ${content.textAlign === 'right' ? 'selected' : ''}>Right</option>
                        </select>
                    </div>
                `;

            case 'image':
                return `
                    <div class="property-group">
                        <label>Image URL:</label>
                        <input type="url" id="prop-image-url" value="${content.imageUrl}">
                    </div>
                    <div class="property-group">
                        <label>Alt Text:</label>
                        <input type="text" id="prop-alt-text" value="${content.altText || ''}">
                    </div>
                `;

            case 'social':
                return `
                    <div class="property-group">
                        <label>Social Links:</label>
                        ${content.links.map((link, i) => `
                            <div class="social-link-item" style="border: 1px solid #e9ecef; padding: 10px; margin: 10px 0; border-radius: 4px;">
                                <select id="prop-social-platform-${i}">
                                    <option value="linkedin" ${link.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                                    <option value="twitter" ${link.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                                    <option value="instagram" ${link.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                                    <option value="facebook" ${link.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                                </select>
                                <input type="url" id="prop-social-url-${i}" value="${link.url}" placeholder="URL" style="width: 100%; margin: 5px 0;">
                                <button type="button" class="remove-social-btn" onclick="newsletterBuilder.removeSocialLink(${index}, ${i})" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                        <button type="button" class="btn btn-secondary" onclick="newsletterBuilder.addSocialLink(${index})" style="margin-top: 10px; padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-plus"></i> Add Link
                        </button>
                    </div>
                `;

            case 'footer':
                return `
                    <div class="property-group">
                        <label>Company Name:</label>
                        <input type="text" id="prop-company-name" value="${content.companyName}">
                    </div>
                    <div class="property-group">
                        <label>Website URL:</label>
                        <input type="url" id="prop-website-url" value="${content.websiteUrl || ''}">
                    </div>
                    <div class="property-group">
                        <label>Unsubscribe URL:</label>
                        <input type="url" id="prop-unsubscribe-url" value="${content.unsubscribeUrl || ''}">
                    </div>
                    <div class="property-group">
                        <label>Background Color:</label>
                        <input type="color" id="prop-bg-color" value="${content.backgroundColor || '#ebebeb'}">
                    </div>
                    <div class="property-group">
                        <label>Text Color:</label>
                        <input type="color" id="prop-text-color" value="${content.textColor || '#666666'}">
                    </div>
                `;

            case 'roundedFooter':
                return `
                    <div class="property-group">
                        <label>Company Name:</label>
                        <input type="text" id="prop-company-name" value="${content.companyName}">
                    </div>
                    <div class="property-group">
                        <label>Unsubscribe Text:</label>
                        <input type="text" id="prop-unsubscribe-text" value="${content.unsubscribeText}">
                    </div>
                    <div class="property-group">
                        <label>Unsubscribe URL:</label>
                        <input type="url" id="prop-unsubscribe-url" value="${content.unsubscribeUrl}">
                    </div>
                    <div class="property-group">
                        <label>Background Color:</label>
                        <input type="color" id="prop-bg-color" value="${content.backgroundColor}">
                    </div>
                    <div class="property-group">
                        <label>Border Radius:</label>
                        <input type="text" id="prop-border-radius" value="${content.borderRadius}">
                    </div>
                `;

            case 'minimalFooter':
                return `
                    <div class="property-group">
                        <label>Text:</label>
                        <input type="text" id="prop-text" value="${content.text}">
                    </div>
                    <div class="property-group">
                        <label>URL:</label>
                        <input type="url" id="prop-url" value="${content.url}">
                    </div>
                    <div class="property-group">
                        <label>Font Size:</label>
                        <select id="prop-font-size">
                            <option value="8px" ${content.fontSize === '8px' ? 'selected' : ''}>8px</option>
                            <option value="10px" ${content.fontSize === '10px' ? 'selected' : ''}>10px</option>
                            <option value="12px" ${content.fontSize === '12px' ? 'selected' : ''}>12px</option>
                            <option value="14px" ${content.fontSize === '14px' ? 'selected' : ''}>14px</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label>Text Alignment:</label>
                        <select id="prop-text-align">
                            <option value="left" ${content.textAlign === 'left' ? 'selected' : ''}>Left</option>
                            <option value="center" ${content.textAlign === 'center' ? 'selected' : ''}>Center</option>
                            <option value="right" ${content.textAlign === 'right' ? 'selected' : ''}>Right</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label>Background Color:</label>
                        <input type="color" id="prop-bg-color" value="${content.backgroundColor}">
                    </div>
                `;

            case 'dottedDivider':
                return `
                    <div class="property-group">
                        <p>This is a dotted divider line. No customization options available.</p>
                    </div>
                `;

            default:
                return '<p class="no-selection">No properties available for this block type.</p>';
        }
    }

    bindPropertiesEvents(index) {
        const propertiesPanel = document.getElementById('properties-content');
        
        propertiesPanel.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                this.updateBlockProperty(index, input);
            });
            
            input.addEventListener('change', () => {
                this.updateBlockProperty(index, input);
            });
        });
    }

    updateBlockProperty(index, input) {
        const block = this.currentNewsletter.content[index];
        const propId = input.id;
        const value = input.value;

        // Enhanced property mapping
        const propertyMap = {
            'prop-title': 'title',
            'prop-subtitle': 'subtitle',
            'prop-bg-color': 'backgroundColor',
            'prop-text-color': 'textColor',
            'prop-description': 'description',
            'prop-image-url': 'imageUrl',
            'prop-cta-text': 'ctaText',
            'prop-cta-url': 'ctaUrl',
            'prop-text': 'text',
            'prop-font-size': 'fontSize',
            'prop-text-align': 'textAlign',
            'prop-alt-text': 'altText',
            'prop-company-name': 'companyName',
            'prop-address': 'address',
            'prop-unsubscribe-text': 'unsubscribeText',
            'prop-unsubscribe-url': 'unsubscribeUrl',
            'prop-logo-url': 'logoUrl',
            'prop-website-url': 'websiteUrl',
            'prop-website-text': 'websiteText',
            'prop-border-radius': 'borderRadius',
            'prop-url': 'url',
            'prop-max-width': 'maxWidth',
            'prop-padding': 'padding'
        };

        // Handle two-column article properties
        if (propId.startsWith('prop-left-')) {
            const property = propId.replace('prop-left-', '').replace('-', '');
            const propertyMapping = {
                'title': 'title',
                'description': 'description',
                'ctatext': 'ctaText',
                'ctaurl': 'ctaUrl'
            };
            
            if (propertyMapping[property]) {
                block.content.leftColumn[propertyMapping[property]] = value;
            }
        } else if (propId.startsWith('prop-right-')) {
            const property = propId.replace('prop-right-', '').replace('-', '');
            const propertyMapping = {
                'imageurl': 'imageUrl',
                'alttext': 'altText'
            };
            
            if (propertyMapping[property]) {
                block.content.rightColumn[propertyMapping[property]] = value;
            }
        }
        // Handle article grid properties
        else if (propId.startsWith('prop-article-')) {
            const parts = propId.split('-');
            const property = parts[2];
            const articleIndex = parseInt(parts[3]);
            
            const propertyMapping = {
                'title': 'title',
                'description': 'description',
                'image': 'imageUrl',
                'url': 'ctaUrl'
            };
            
            if (propertyMapping[property] && block.content.articles[articleIndex]) {
                block.content.articles[articleIndex][propertyMapping[property]] = value;
            }
        }
        // Handle social links separately
        else if (propId.startsWith('prop-social-')) {
            const parts = propId.split('-');
            const linkIndex = parseInt(parts[3]);
            
            if (parts[2] === 'platform') {
                block.content.links[linkIndex].platform = value;
            } else if (parts[2] === 'url') {
                block.content.links[linkIndex].url = value;
            }
        }
        // Handle standard properties
        else if (propertyMap[propId]) {
            block.content[propertyMap[propId]] = value;
        }

        // Handle color properties for text blocks
        if (propId === 'prop-text-color' && block.type === 'text') {
            block.content.color = value;
        }

        this.updatePreview();
        this.saveToHistory();
    }

    addArticle(blockIndex) {
        const block = this.currentNewsletter.content[blockIndex];
        block.content.articles.push({
            title: 'New Article',
            description: 'Article description here.',
            imageUrl: 'https://via.placeholder.com/280x180/007bff/ffffff?text=New+Article',
            ctaUrl: '#'
        });
        
        this.showBlockProperties(blockIndex);
        this.updatePreview();
        this.saveToHistory();
    }

    removeArticle(blockIndex, articleIndex) {
        const block = this.currentNewsletter.content[blockIndex];
        if (block.content.articles.length > 1) {
            block.content.articles.splice(articleIndex, 1);
            this.showBlockProperties(blockIndex);
            this.updatePreview();
            this.saveToHistory();
        } else {
            alert('You must have at least one article.');
        }
    }

    addSocialLink(blockIndex) {
        const block = this.currentNewsletter.content[blockIndex];
        block.content.links.push({
            platform: 'linkedin',
            url: 'https://linkedin.com/company/your-company'
        });
        
        this.showBlockProperties(blockIndex);
        this.updatePreview();
        this.saveToHistory();
    }

    removeSocialLink(blockIndex, linkIndex) {
        const block = this.currentNewsletter.content[blockIndex];
        block.content.links.splice(linkIndex, 1);
        
        this.showBlockProperties(blockIndex);
        this.updatePreview();
        this.saveToHistory();
    }

    hideBlockProperties() {
        document.getElementById('properties-content').innerHTML = 
            '<p class="no-selection">Select an element to edit its properties</p>';
    }

    editBlock(index) {
        this.selectBlock(index);
    }

    moveBlock(index, direction) {
        const content = this.currentNewsletter.content;
        
        if (direction === 'up' && index > 0) {
            [content[index], content[index - 1]] = [content[index - 1], content[index]];
            this.selectedElement = index - 1;
        } else if (direction === 'down' && index < content.length - 1) {
            [content[index], content[index + 1]] = [content[index + 1], content[index]];
            this.selectedElement = index + 1;
        }

        this.updatePreview();
        this.saveToHistory();
        
        // Reselect the moved block
        setTimeout(() => {
            if (this.selectedElement !== null) {
                this.selectBlock(this.selectedElement);
            }
        }, 100);
    }

    deleteBlock(index) {
        if (confirm('Are you sure you want to delete this block?')) {
            this.currentNewsletter.content.splice(index, 1);
            this.deselectBlock();
            this.updatePreview();
            this.saveToHistory();
        }
    }

    showPreview() {
        const modal = document.getElementById('preview-modal');
        const previewContent = document.getElementById('preview-content');
        
        // Generate full email HTML
        const emailHTML = newsletterExporter.generateEmailHTML(this.currentNewsletter);
        
        previewContent.innerHTML = `
            <iframe 
                srcdoc="${this.escapeHtml(emailHTML)}" 
                style="width: 100%; height: 100%; border: none; background: white;"
                frameborder="0">
            </iframe>
        `;
        
        modal.style.display = 'block';
    }

    switchPreviewTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        const iframe = document.querySelector('#preview-content iframe');
        if (tab === 'mobile') {
            iframe.style.width = '375px';
            iframe.style.margin = '0 auto';
        } else {
            iframe.style.width = '100%';
            iframe.style.margin = '0';
        }
    }

    closeModal() {
        document.getElementById('preview-modal').style.display = 'none';
    }

    exportNewsletter() {
        if (this.currentNewsletter.content.length === 0) {
            alert('Please add some content to your newsletter before exporting.');
            return;
        }

        const title = this.currentNewsletter.title || 'newsletter';
        const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.html`;
        
        newsletterExporter.exportNewsletter(this.currentNewsletter);
        
        // Show success message
        this.showNotification('Newsletter exported successfully!', 'success');
    }

    clearNewsletter() {
        if (confirm('Are you sure you want to clear the entire newsletter? This action cannot be undone.')) {
            this.currentNewsletter = {
                title: '',
                content: [],
                settings: {
                    brandColor: '#007bff',
                    fontSize: '16px'
                }
            };
            
            document.getElementById('newsletter-title').value = '';
            document.getElementById('brand-color').value = '#007bff';
            document.getElementById('font-size').value = '16';
            
            this.deselectBlock();
            this.updatePreview();
            this.saveToHistory();
        }
    }

    setupDragAndDrop() {
        // This would implement drag and drop functionality
        // For now, we'll use the click-to-add approach
    }

    saveToHistory() {
        // Remove any future history if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add current state to history
        this.history.push(JSON.parse(JSON.stringify(this.currentNewsletter)));
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
        
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentNewsletter = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.updatePreview();
            this.updateUndoRedoButtons();
            this.syncSettingsInputs();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentNewsletter = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.updatePreview();
            this.updateUndoRedoButtons();
            this.syncSettingsInputs();
        }
    }

    updateUndoRedoButtons() {
        document.getElementById('undo-btn').disabled = this.historyIndex <= 0;
        document.getElementById('redo-btn').disabled = this.historyIndex >= this.history.length - 1;
    }

    syncSettingsInputs() {
        document.getElementById('newsletter-title').value = this.currentNewsletter.title || '';
        document.getElementById('brand-color').value = this.currentNewsletter.settings.brandColor || '#007bff';
        document.getElementById('font-size').value = parseInt(this.currentNewsletter.settings.fontSize) || 16;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the newsletter builder when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.newsletterBuilder = new NewsletterBuilder();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1001;
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #28a745;
        color: #155724;
    }
    
    .notification-success i {
        color: #28a745;
    }
    
    .notification-info {
        border-left: 4px solid #007bff;
        color: #004085;
    }
    
    .notification-info i {
        color: #007bff;
    }

    .property-group {
        margin-bottom: 1rem;
    }

    .property-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #495057;
        margin-bottom: 0.25rem;
    }

    .property-group input,
    .property-group textarea,
    .property-group select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    .property-group input:focus,
    .property-group textarea:focus,
    .property-group select:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .property-group h4 {
        color: #495057;
        font-size: 1rem;
        margin-bottom: 0.5rem;
        padding-bottom: 0.25rem;
        border-bottom: 1px solid #e9ecef;
    }
`;

// Add notification styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
