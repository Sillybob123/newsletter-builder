class NewsletterForge {
    constructor() {
        this.newsletter = null;
        this.selectedBlock = null;
        this.history = [];
        this.historyIndex = -1;
        this.darkMode = false;
        this.mobilePreview = false;
        this.autosaveTimer = null;
        this.templates = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTemplates();
        if (this.templates.length > 0) {
            this.load(this.templates[0].id);
        } else {
            this.createNewNewsletter();
        }
        this.saveToHistory();
        this.startAutosave();
    }
    
    createNewNewsletter(title = 'Untitled Newsletter') {
        this.newsletter = {
            id: 'nl_' + Date.now(),
            title: title,
            blocks: [],
            globalStyles: {
                fontFamily: 'Inter, sans-serif',
                primaryColor: '#007bff',
                backgroundColor: '#ffffff'
            }
        };
        document.getElementById('newsletter-title').textContent = this.newsletter.title;
        this.renderCanvas();
    }

    setupEventListeners() {
        // Sidebar tabs
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchSidebarTab(e.target.dataset.tab));
        });

        // Content block drag start
        document.querySelectorAll('.content-block-btn').forEach(btn => {
            btn.addEventListener('dragstart', (e) => this.handleDragStart(e));
        });

        // Canvas drop events
        const canvas = document.getElementById('email-canvas');
        canvas.addEventListener('dragover', (e) => this.handleDragOver(e));
        canvas.addEventListener('drop', (e) => this.handleDrop(e));
        canvas.addEventListener('dragleave', (e) => this.handleDragLeave(e));

        // Toolbar buttons
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('preview-btn').addEventListener('click', () => this.showPreview());
        document.getElementById('export-btn').addEventListener('click', () => this.exportHTML());
        document.getElementById('spam-check-btn').addEventListener('click', () => this.runSpamCheck());
        document.getElementById('dark-mode-btn').addEventListener('click', () => this.toggleDarkMode());
        document.getElementById('clear-canvas').addEventListener('click', () => this.clearCanvas());
        document.getElementById('mobile-preview').addEventListener('click', () => this.toggleMobilePreview());
        document.getElementById('desktop-preview').addEventListener('click', () => this.toggleDesktopPreview());
        document.getElementById('templates-btn').addEventListener('click', () => this.showTemplates());
        document.getElementById('save-template-btn').addEventListener('click', () => this.save());
        document.getElementById('new-template-btn').addEventListener('click', () => {
            const title = prompt('Enter a title for your new newsletter:');
            if (title) {
                this.createNewNewsletter(title);
                this.save();
                this.loadTemplates(); // Refresh list
                this.showTemplates();
            }
        });

        // Global styles
        document.getElementById('global-font').addEventListener('change', (e) => this.updateGlobalStyle('fontFamily', e.target.value));
        document.getElementById('primary-color').addEventListener('change', (e) => this.updateGlobalStyle('primaryColor', e.target.value));
        document.getElementById('bg-color').addEventListener('change', (e) => this.updateGlobalStyle('backgroundColor', e.target.value));

        // Color input sync
        document.getElementById('primary-color').addEventListener('input', (e) => {
            document.getElementById('primary-color-text').value = e.target.value;
        });
        document.getElementById('primary-color-text').addEventListener('input', (e) => {
            document.getElementById('primary-color').value = e.target.value;
            this.updateGlobalStyle('primaryColor', e.target.value);
        });

        document.getElementById('bg-color').addEventListener('input', (e) => {
            document.getElementById('bg-color-text').value = e.target.value;
        });
        document.getElementById('bg-color-text').addEventListener('input', (e) => {
            document.getElementById('bg-color').value = e.target.value;
            this.updateGlobalStyle('backgroundColor', e.target.value);
        });

        // Preview tabs
        document.querySelectorAll('.preview-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchPreviewTab(e.currentTarget.dataset.preview));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Click outside to deselect
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.email-block') && !e.target.closest('.properties-content')) {
                this.selectBlock(null);
            }
        });
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
                case 's':
                    e.preventDefault();
                    this.save();
                    break;
            }
        }
    }

    switchSidebarTab(tabName) {
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = content.id === `${tabName}-tab` ? 'block' : 'none';
        });
    }

    handleDragStart(e) {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'new-block',
            blockType: e.currentTarget.dataset.block
        }));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        
        const canvas = e.currentTarget;
        canvas.classList.add('drag-over');
        
        // Remove existing drop indicators
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        
        // Find drop position
        const afterElement = this.getDragAfterElement(canvas, e.clientY);
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        
        if (afterElement) {
            canvas.insertBefore(indicator, afterElement);
        } else {
            canvas.appendChild(indicator);
        }
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
    }

    handleDrop(e) {
        e.preventDefault();
        const canvas = e.currentTarget;
        canvas.classList.remove('drag-over');
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            
            if (data.type === 'new-block') {
                const afterElement = this.getDragAfterElement(canvas, e.clientY);
                const insertIndex = afterElement ? 
                    Array.from(canvas.children).indexOf(afterElement) : 
                    this.newsletter.blocks.length;
                
                this.addBlock(data.blockType, insertIndex);
            }
        } catch (err) {
            console.error('Drop error:', err);
        }
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.email-block:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    addBlock(blockType, index = null) {
        const blockData = this.createBlockData(blockType);
        
        if (index !== null) {
            this.newsletter.blocks.splice(index, 0, blockData);
        } else {
            this.newsletter.blocks.push(blockData);
        }
        
        this.renderCanvas();
        this.saveToHistory();
        this.triggerAutosave();
    }

    createBlockData(type) {
        const defaultPadding = { top: '10px', right: '20px', bottom: '10px', left: '20px' };
        const defaultMargins = { top: '0', right: '0', bottom: '0', left: '0' };
    
        const blockTemplates = {
            text: {
                type: 'text',
                content: {
                    text: 'Enter your text here. You can edit this in the properties panel.',
                    fontSize: '16px',
                    fontWeight: 'normal',
                    color: '#333333',
                    textAlign: 'left',
                    padding: defaultPadding,
                    margin: defaultMargins,
                }
            },
            heading: {
                type: 'heading',
                content: {
                    text: 'Your Heading Here',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#333333',
                    textAlign: 'left',
                    padding: { top: '20px', right: '20px', bottom: '10px', left: '20px' },
                    margin: defaultMargins,
                }
            },
            image: {
                type: 'image',
                content: {
                    src: 'https://via.placeholder.com/600x300/007bff/ffffff?text=Your+Image',
                    alt: 'Image description',
                    width: '100%',
                    height: 'auto',
                    borderRadius: '0px',
                    padding: defaultPadding,
                    margin: defaultMargins,
                }
            },
            button: {
                type: 'button',
                content: {
                    text: 'Click Here',
                    href: 'https://example.com',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    padding: { top: '12px', right: '24px', bottom: '12px', left: '24px' },
                    textAlign: 'center'
                }
            },
            divider: {
                type: 'divider',
                content: {
                    height: '1px',
                    color: '#dddddd',
                    padding: defaultPadding,
                }
            },
            spacer: {
                type: 'spacer',
                content: {
                    height: '40px'
                }
            },
            boxedText: {
                type: 'boxedText',
                content: {
                    text: 'This is text inside a styled box. Perfect for callouts and important information.',
                    backgroundColor: '#f8f9fa',
                    borderColor: '#dee2e6',
                    borderWidth: '1px',
                    borderRadius: '8px',
                    padding: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
                    margin: { top: '10px', right: '20px', bottom: '10px', left: '20px' },
                    fontSize: '16px',
                    color: '#333333'
                }
            },
            social: {
                type: 'social',
                content: {
                    title: 'Follow Us',
                    links: [
                        { platform: 'facebook', url: 'https://facebook.com/yourpage' },
                        { platform: 'twitter', url: 'https://twitter.com/yourhandle' },
                        { platform: 'instagram', url: 'https://instagram.com/yourhandle' },
                        { platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany' }
                    ],
                    iconSize: '32px',
                    padding: defaultPadding,
                }
            },
            footer: {
                type: 'footer',
                content: {
                    companyName: 'Your Company Name',
                    address: '123 Main Street, City, State 12345',
                    unsubscribeText: 'Unsubscribe from this newsletter',
                    unsubscribeUrl: '#unsubscribe',
                    backgroundColor: '#f8f9fa',
                    textColor: '#666666',
                    fontSize: '12px',
                    padding: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
                }
            },
            code: {
                type: 'code',
                content: {
                    html: '<div style="padding: 20px; background: #f8f9fa; border-radius: 8px;"><p>Custom HTML content goes here</p></div>',
                    padding: defaultPadding
                }
            },
            video: {
                type: 'video',
                content: {
                    thumbnailUrl: 'https://via.placeholder.com/600x300/dc3545/ffffff?text=Video+Thumbnail',
                    videoUrl: 'https://example.com/video',
                    alt: 'Video thumbnail',
                    playButtonColor: '#ffffff',
                    padding: defaultPadding
                }
            }
        };

        const blockData = blockTemplates[type] || blockTemplates.text;
        blockData.id = this.generateId();
        return JSON.parse(JSON.stringify(blockData)); // Deep copy
    }

    generateId() {
        return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    renderCanvas() {
        const canvas = document.getElementById('email-canvas');
        
        if (this.newsletter.blocks.length === 0) {
            canvas.innerHTML = `
                <div class="canvas-empty-state">
                    <i class="fas fa-mouse-pointer"></i>
                    <h3>Start Building Your Newsletter</h3>
                    <p>Drag content blocks from the left sidebar to get started.</p>
                </div>
            `;
            return;
        }

        canvas.innerHTML = '';
        
        this.newsletter.blocks.forEach((block, index) => {
            const blockElement = this.createBlockElement(block, index);
            canvas.appendChild(blockElement);
        });
    }

    createBlockElement(block, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'email-block';
        wrapper.dataset.blockId = block.id;
        wrapper.dataset.blockIndex = index;
        
        // Add block controls
        const controls = document.createElement('div');
        controls.className = 'block-controls';
        controls.innerHTML = `
            <button class="block-control-btn" onclick="newsletterForge.duplicateBlock('${block.id}')" title="Duplicate">
                <i class="fas fa-copy"></i>
            </button>
            <button class="block-control-btn" onclick="newsletterForge.moveBlockUp('${block.id}')" title="Move Up">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button class="block-control-btn" onclick="newsletterForge.moveBlockDown('${block.id}')" title="Move Down">
                <i class="fas fa-arrow-down"></i>
            </button>
            <button class="block-control-btn delete" onclick="newsletterForge.deleteBlock('${block.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        wrapper.appendChild(controls);
        wrapper.appendChild(this.renderBlock(block));
        
        // Add click handler for selection
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectBlock(block.id);
        });
        
        return wrapper;
    }

    renderBlock(block) {
        const element = document.createElement('div');
        
        const getPadding = (p) => `${p.top} ${p.right} ${p.bottom} ${p.left}`;

        switch (block.type) {
            case 'text':
                element.innerHTML = `
                    <div class="email-text" style="
                        padding: ${getPadding(block.content.padding)};
                        font-size: ${block.content.fontSize};
                        font-weight: ${block.content.fontWeight};
                        color: ${block.content.color};
                        text-align: ${block.content.textAlign};
                        font-family: ${this.newsletter.globalStyles.fontFamily};
                    ">${block.content.text}</div>
                `;
                break;
                
            case 'heading':
                element.innerHTML = `
                    <h2 class="email-heading" style="
                        padding: ${getPadding(block.content.padding)};
                        font-size: ${block.content.fontSize};
                        font-weight: ${block.content.fontWeight};
                        color: ${block.content.color};
                        text-align: ${block.content.textAlign};
                        font-family: ${this.newsletter.globalStyles.fontFamily};
                        margin: 0;
                    ">${block.content.text}</h2>
                `;
                break;
                
            case 'image':
                element.innerHTML = `
                    <div style="padding: ${getPadding(block.content.padding)}; text-align: center;">
                        <img class="email-image" 
                             src="${block.content.src}" 
                             alt="${block.content.alt}"
                             style="
                                width: ${block.content.width};
                                height: ${block.content.height};
                                border-radius: ${block.content.borderRadius};
                                display: block;
                                margin: 0 auto;
                             ">
                    </div>
                `;
                break;
                
            case 'button':
                element.innerHTML = `
                    <div class="email-button" style="padding: 20px; text-align: ${block.content.textAlign};">
                        <a href="${block.content.href}" style="
                            display: inline-block;
                            padding: ${getPadding(block.content.padding)};
                            background-color: ${block.content.backgroundColor};
                            color: ${block.content.color};
                            font-size: ${block.content.fontSize};
                            font-weight: ${block.content.fontWeight};
                            border-radius: ${block.content.borderRadius};
                            text-decoration: none;
                            font-family: ${this.newsletter.globalStyles.fontFamily};
                        ">${block.content.text}</a>
                    </div>
                `;
                break;
                
            case 'divider':
                element.innerHTML = `
                    <div class="email-divider" style="padding: ${getPadding(block.content.padding)};">
                        <hr style="
                            border: none;
                            height: ${block.content.height};
                            background-color: ${block.content.color};
                            margin: 0;
                        ">
                    </div>
                `;
                break;
                
            case 'spacer':
                element.innerHTML = `
                    <div class="email-spacer" style="height: ${block.content.height};"></div>
                `;
                break;
                
            case 'boxedText':
                element.innerHTML = `
                    <div style="padding: ${getPadding(block.content.margin)};">
                        <div style="
                            background-color: ${block.content.backgroundColor};
                            border: ${block.content.borderWidth} solid ${block.content.borderColor};
                            border-radius: ${block.content.borderRadius};
                            padding: ${getPadding(block.content.padding)};
                            font-size: ${block.content.fontSize};
                            color: ${block.content.color};
                            font-family: ${this.newsletter.globalStyles.fontFamily};
                        ">${block.content.text}</div>
                    </div>
                `;
                break;
                
            case 'social':
                const socialIcons = block.content.links.map(link => {
                    const iconMap = {
                        facebook: 'fab fa-facebook',
                        twitter: 'fab fa-twitter',
                        instagram: 'fab fa-instagram',
                        linkedin: 'fab fa-linkedin'
                    };
                    return `
                        <a href="${link.url}" style="
                            display: inline-block;
                            margin: 0 10px;
                            color: ${this.newsletter.globalStyles.primaryColor};
                            font-size: ${block.content.iconSize};
                            text-decoration: none;
                        ">
                            <i class="${iconMap[link.platform] || 'fas fa-link'}"></i>
                        </a>
                    `;
                }).join('');
                
                element.innerHTML = `
                    <div class="email-social" style="
                        padding: ${getPadding(block.content.padding)};
                        text-align: center;
                        font-family: ${this.newsletter.globalStyles.fontFamily};
                    ">
                        <h3 style="margin-bottom: 15px; color: #333;">${block.content.title}</h3>
                        <div>${socialIcons}</div>
                    </div>
                `;
                break;
                
            case 'footer':
                element.innerHTML = `
                    <div class="email-footer" style="
                        background-color: ${block.content.backgroundColor};
                        color: ${block.content.textColor};
                        font-size: ${block.content.fontSize};
                        padding: ${getPadding(block.content.padding)};
                        text-align: center;
                        font-family: ${this.newsletter.globalStyles.fontFamily};
                    ">
                        <p style="margin: 0 0 10px 0;"><strong>${block.content.companyName}</strong></p>
                        <p style="margin: 0 0 10px 0;">${block.content.address}</p>
                        <p style="margin: 0;">
                            <a href="${block.content.unsubscribeUrl}" style="color: ${block.content.textColor};">
                                ${block.content.unsubscribeText}
                            </a>
                        </p>
                    </div>
                `;
                break;
                
            default:
                element.innerHTML = `<div style="padding: 20px; text-align: center; color: #999;">Unsupported block type: ${block.type}</div>`;
        }
        
        return element;
    }

    selectBlock(blockId) {
        // Remove previous selection
        document.querySelectorAll('.email-block.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        if (blockId) {
            const blockElement = document.querySelector(`[data-block-id="${blockId}"]`);
            if (blockElement) {
                blockElement.classList.add('selected');
            }
            
            const block = this.newsletter.blocks.find(b => b.id === blockId);
            if (block) {
                this.selectedBlock = blockId;
                this.showBlockProperties(block);
            }
        } else {
            this.selectedBlock = null;
            this.showDefaultProperties();
        }
    }
    
    showBlockProperties(block) {
        const propertiesContent = document.getElementById('properties-content');
        let html = `<div class="property-group"><h4>${this.capitalize(block.type)} Settings</h4></div>`;
    
        Object.entries(block.content).forEach(([key, value]) => {
            if (typeof value === 'object' && (key === 'padding' || key === 'margin')) {
                html += this.createSpacingInput(key, value, block.id);
            } else if (typeof value === 'string' || typeof value === 'number') {
                html += this.createPropertyInput(key, value, block.id);
            }
        });
    
        propertiesContent.innerHTML = html;
    
        propertiesContent.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                const property = e.target.dataset.property;
                const side = e.target.dataset.side;
                this.updateBlockProperty(block.id, property, e.target.value, side);
            });
        });
    }

    createSpacingInput(key, value, blockId) {
        const label = this.formatLabel(key);
        return `
            <div class="property-group">
                <label>${label}</label>
                <div class="spacing-group">
                    ${['top', 'right', 'bottom', 'left'].map(side => `
                        <div class="spacing-input">
                            <label for="prop-${blockId}-${key}-${side}">${this.capitalize(side)}</label>
                            <input type="text" id="prop-${blockId}-${key}-${side}" value="${value[side]}" data-property="${key}" data-side="${side}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createPropertyInput(key, value, blockId) {
        const label = this.formatLabel(key);
        const inputId = `prop-${blockId}-${key}`;
        
        if (key.toLowerCase().includes('color')) {
            return `
                <div class="property-group">
                    <label for="${inputId}">${label}</label>
                    <div class="color-input-group">
                        <input type="color" id="${inputId}" value="${value}" data-property="${key}">
                        <input type="text" value="${value}" data-property="${key}">
                    </div>
                </div>
            `;
        } else if (key === 'text' && value.length > 50) {
            return `
                <div class="property-group">
                    <label for="${inputId}">${label}</label>
                    <textarea id="${inputId}" rows="4" data-property="${key}">${value}</textarea>
                </div>
            `;
        } else if (key.includes('Align')) {
            return `
                <div class="property-group">
                    <label for="${inputId}">${label}</label>
                    <select id="${inputId}" data-property="${key}">
                        <option value="left" ${value === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${value === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${value === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                </div>
            `;
        } else if (key.includes('Weight')) {
            return `
                <div class="property-group">
                    <label for="${inputId}">${label}</label>
                    <select id="${inputId}" data-property="${key}">
                        <option value="normal" ${value === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="bold" ${value === 'bold' ? 'selected' : ''}>Bold</option>
                        <option value="lighter" ${value === 'lighter' ? 'selected' : ''}>Lighter</option>
                    </select>
                </div>
            `;
        } else {
            return `
                <div class="property-group">
                    <label for="${inputId}">${label}</label>
                    <input type="text" id="${inputId}" value="${value}" data-property="${key}">
                </div>
            `;
        }
    }

    updateBlockProperty(blockId, property, value, side = null) {
        const block = this.newsletter.blocks.find(b => b.id === blockId);
        if (block) {
            if (side) {
                block.content[property][side] = value;
            } else if (block.content.hasOwnProperty(property)) {
                block.content[property] = value;
            }
            this.renderCanvas();
            this.triggerAutosave();
        }
    }

    showDefaultProperties() {
        const propertiesContent = document.getElementById('properties-content');
        propertiesContent.innerHTML = `
            <div style="text-align: center; color: var(--secondary); margin-top: 2rem;">
                <i class="fas fa-hand-pointer" style="font-size: 2rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                <p>Select a block to edit its properties</p>
            </div>
        `;
    }

    duplicateBlock(blockId) {
        const block = this.newsletter.blocks.find(b => b.id === blockId);
        if (block) {
            const duplicatedBlock = JSON.parse(JSON.stringify(block));
            duplicatedBlock.id = this.generateId();
            
            const index = this.newsletter.blocks.findIndex(b => b.id === blockId);
            this.newsletter.blocks.splice(index + 1, 0, duplicatedBlock);
            
            this.renderCanvas();
            this.saveToHistory();
            this.triggerAutosave();
        }
    }

    moveBlockUp(blockId) {
        const index = this.newsletter.blocks.findIndex(b => b.id === blockId);
        if (index > 0) {
            const block = this.newsletter.blocks.splice(index, 1)[0];
            this.newsletter.blocks.splice(index - 1, 0, block);
            this.renderCanvas();
            this.saveToHistory();
            this.triggerAutosave();
        }
    }

    moveBlockDown(blockId) {
        const index = this.newsletter.blocks.findIndex(b => b.id === blockId);
        if (index < this.newsletter.blocks.length - 1) {
            const block = this.newsletter.blocks.splice(index, 1)[0];
            this.newsletter.blocks.splice(index + 1, 0, block);
            this.renderCanvas();
            this.saveToHistory();
            this.triggerAutosave();
        }
    }

    deleteBlock(blockId) {
        if (confirm('Are you sure you want to delete this block?')) {
            this.newsletter.blocks = this.newsletter.blocks.filter(b => b.id !== blockId);
            this.selectBlock(null);
            this.renderCanvas();
            this.saveToHistory();
            this.triggerAutosave();
        }
    }

    updateGlobalStyle(property, value) {
        this.newsletter.globalStyles[property] = value;
        this.renderCanvas();
        this.triggerAutosave();
    }

    clearCanvas() {
        if (confirm('Are you sure you want to clear the entire newsletter? This action cannot be undone.')) {
            this.newsletter.blocks = [];
            this.selectBlock(null);
            this.renderCanvas();
            this.saveToHistory();
            this.triggerAutosave();
        }
    }

    toggleMobilePreview() {
        this.mobilePreview = true;
        document.getElementById('email-canvas').style.maxWidth = '375px';
        document.getElementById('mobile-preview').classList.add('btn-primary');
        document.getElementById('desktop-preview').classList.remove('btn-primary');
    }

    toggleDesktopPreview() {
        this.mobilePreview = false;
        document.getElementById('email-canvas').style.maxWidth = '600px';
        document.getElementById('desktop-preview').classList.add('btn-primary');
        document.getElementById('mobile-preview').classList.remove('btn-primary');
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark-mode', this.darkMode);
        
        const btn = document.getElementById('dark-mode-btn');
        btn.innerHTML = this.darkMode ? 
            '<i class="fas fa-sun"></i> Light' : 
            '<i class="fas fa-moon"></i> Dark';
    }

    showPreview() {
        const modal = document.getElementById('preview-modal');
        modal.classList.add('active');
        this.switchPreviewTab('desktop');
    }

    switchPreviewTab(tabType) {
        document.querySelectorAll('.preview-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.preview === tabType);
        });
        
        const previewContent = document.getElementById('preview-content');
        const html = this.generateEmailHTML();
        
        let iframe = previewContent.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 8px;';
            previewContent.innerHTML = '';
            previewContent.appendChild(iframe);
        }
        
        let iframeHtml = html;
        
        if (tabType === 'mobile') {
            iframe.style.width = '375px';
            iframe.style.height = '667px';
            iframe.style.margin = '0 auto';
        } else if (tabType === 'dark') {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframeHtml = `
                <style>
                    body { background-color: #1a202c !important; color: #e2e8f0 !important; }
                    .email-text { color: #e2e8f0 !important; }
                    .email-heading { color: #e2e8f0 !important; }
                </style>
                ${html}
            `;
        } else {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.margin = '0';
        }
        
        iframe.srcdoc = iframeHtml;
    }

    runSpamCheck() {
        const modal = document.getElementById('spam-modal');
        const reportContent = document.getElementById('spam-report');
        
        let issues = [];
        let score = 100;
        
        // Check for missing alt text
        const imageBlocks = this.newsletter.blocks.filter(b => b.type === 'image');
        imageBlocks.forEach(block => {
            if (!block.content.alt || block.content.alt.trim() === '') {
                issues.push({
                    type: 'warning',
                    message: 'Image block is missing alt text',
                    impact: -5
                });
                score -= 5;
            }
        });

        // Check for unsubscribe link
        const hasUnsubscribe = this.newsletter.blocks.some(block => 
            JSON.stringify(block.content).toLowerCase().includes('unsubscribe')
        );
        if (!hasUnsubscribe) {
            issues.push({
                type: 'error',
                message: 'Missing unsubscribe link (required by CAN-SPAM law)',
                impact: -15
            });
            score -= 15;
        }

        // Check for spam words
        const spamWords = ['free', 'urgent', 'act now', 'limited time', 'guarantee', 'winner', 'congratulations'];
        const allText = this.newsletter.blocks
            .map(b => JSON.stringify(b.content))
            .join(' ')
            .toLowerCase();
        
        spamWords.forEach(word => {
            if (allText.includes(word)) {
                issues.push({
                    type: 'warning',
                    message: `Potential spam word detected: "${word}"`,
                    impact: -3
                });
                score -= 3;
            }
        });

        // Check text-to-image ratio
        const textBlocks = this.newsletter.blocks.filter(b => 
            ['text', 'heading', 'boxedText'].includes(b.type)
        ).length;
        const mediaBlocks = this.newsletter.blocks.filter(b => 
            ['image', 'video', 'imageGroup'].includes(b.type)
        ).length;
        
        if (mediaBlocks > textBlocks && textBlocks > 0) {
            issues.push({
                type: 'warning',
                message: 'High image-to-text ratio may trigger spam filters',
                impact: -5
            });
            score -= 5;
        }

        // Check for excessive links
        const linkCount = allText.match(/https?:\/\//g)?.length || 0;
        if (linkCount > 10) {
            issues.push({
                type: 'warning',
                message: `High number of links detected (${linkCount})`,
                impact: -10
            });
            score -= 10;
        }

        // Generate report
        let reportHtml = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: ${score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545'};">
                    Spam Score: ${Math.max(0, score)}/100
                </h3>
                <p>${score >= 80 ? 'Excellent! Your newsletter should have good deliverability.' : 
                      score >= 60 ? 'Good, but there are some improvements you can make.' : 
                      'Warning: Your newsletter may have deliverability issues.'}</p>
            </div>
        `;

        if (issues.length === 0) {
            reportHtml += '<p style="color: #28a745;"><i class="fas fa-check-circle"></i> No issues detected!</p>';
        } else {
            reportHtml += '<h4>Issues Found:</h4><ul style="margin-left: 20px;">';
            issues.forEach(issue => {
                const iconClass = issue.type === 'error' ? 'fas fa-times-circle' : 'fas fa-exclamation-triangle';
                const color = issue.type === 'error' ? '#dc3545' : '#ffc107';
                reportHtml += `<li style="margin-bottom: 10px; color: ${color};"><i class="${iconClass}"></i> ${issue.message}</li>`;
            });
            reportHtml += '</ul>';
        }

        reportContent.innerHTML = reportHtml;
        modal.classList.add('active');
    }
    
    showTemplates() {
        const modal = document.getElementById('templates-modal');
        const list = document.getElementById('template-list');
        list.innerHTML = '';

        this.templates.forEach(template => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${template.title}</span>
                <div>
                    <button class="btn" onclick="newsletterForge.load('${template.id}')"><i class="fas fa-edit"></i> Load</button>
                    <button class="btn btn-icon delete" onclick="newsletterForge.deleteTemplate('${template.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            list.appendChild(li);
        });

        modal.classList.add('active');
    }
    
    deleteTemplate(templateId) {
        if (confirm('Are you sure you want to delete this template?')) {
            this.templates = this.templates.filter(t => t.id !== templateId);
            localStorage.setItem('newsletter-templates', JSON.stringify(this.templates));
            if(this.newsletter.id === templateId) {
                this.createNewNewsletter();
            }
            this.showTemplates(); // Refresh list
        }
    }

    saveToHistory() {
        // Remove any history after current index (when undoing and making new changes)
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add current state to history
        this.history.push(JSON.parse(JSON.stringify(this.newsletter)));
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
            this.newsletter = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.renderCanvas();
            this.selectBlock(null);
            this.updateUndoRedoButtons();
            this.triggerAutosave();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.newsletter = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.renderCanvas();
            this.selectBlock(null);
            this.updateUndoRedoButtons();
            this.triggerAutosave();
        }
    }

    updateUndoRedoButtons() {
        document.getElementById('undo-btn').disabled = this.historyIndex <= 0;
        document.getElementById('redo-btn').disabled = this.historyIndex >= this.history.length - 1;
    }

    startAutosave() {
        // Autosave every 30 seconds
        setInterval(() => {
            this.save(true); // silent save
        }, 30000);
    }

    triggerAutosave() {
        // Clear existing timer
        if (this.autosaveTimer) {
            clearTimeout(this.autosaveTimer);
        }
        
        // Show saving indicator
        const indicator = document.getElementById('autosave-status');
        indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        indicator.classList.add('saving');
        
        // Save after 2 seconds of inactivity
        this.autosaveTimer = setTimeout(() => {
            this.save(true); // silent save
        }, 2000);
    }

    save(silent = false) {
        if (!this.newsletter) return;
        
        const index = this.templates.findIndex(t => t.id === this.newsletter.id);
        if (index !== -1) {
            this.templates[index] = this.newsletter;
        } else {
            this.templates.push(this.newsletter);
        }
        
        localStorage.setItem('newsletter-templates', JSON.stringify(this.templates));

        if (!silent) {
            this.showNotification('Template saved!', 'success');
        }
        
        // Update indicator
        const indicator = document.getElementById('autosave-status');
        indicator.innerHTML = '<i class="fas fa-check-circle"></i> Saved';
        indicator.classList.remove('saving');
    }

    load(templateId) {
         const template = this.templates.find(t => t.id === templateId);
        if (template) {
            this.newsletter = JSON.parse(JSON.stringify(template));
            this.renderCanvas();
            document.getElementById('newsletter-title').textContent = this.newsletter.title;
            
            // Update global styles UI
            document.getElementById('global-font').value = this.newsletter.globalStyles.fontFamily;
            document.getElementById('primary-color').value = this.newsletter.globalStyles.primaryColor;
            document.getElementById('primary-color-text').value = this.newsletter.globalStyles.primaryColor;
            document.getElementById('bg-color').value = this.newsletter.globalStyles.backgroundColor;
            document.getElementById('bg-color-text').value = this.newsletter.globalStyles.backgroundColor;
        }
        closeModal('templates-modal');
    }
    
    loadTemplates() {
        try {
            const saved = localStorage.getItem('newsletter-templates');
            if (saved) {
                this.templates = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
            this.templates = [];
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 6px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i> ${message}`;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility functions
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatLabel(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Initialize the application
let newsletterForge;
document.addEventListener('DOMContentLoaded', () => {
    newsletterForge = new NewsletterForge();
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});
