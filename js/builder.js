class NewsletterBuilder {
    constructor() {
        this.exporter = new NewsletterExporter();
        this.initElements();
        this.initState();
        this.init();
    }

    initElements() {
        this.elements = {
            canvas: document.getElementById('email-canvas'),
            propertiesContent: document.getElementById('properties-content'),
            undoBtn: document.getElementById('undo-btn'),
            redoBtn: document.getElementById('redo-btn'),
            exportBtn: document.getElementById('export-btn'),
            previewBtn: document.getElementById('preview-btn'),
            templatesBtn: document.getElementById('templates-btn'),
            darkModeBtn: document.getElementById('dark-mode-btn'),
            mobilePreviewBtn: document.getElementById('mobile-preview'),
            desktopPreviewBtn: document.getElementById('desktop-preview'),
            clearCanvasBtn: document.getElementById('clear-canvas-btn'),
            newsletterTitle: document.getElementById('newsletter-title'),
            contentBlocks: document.querySelectorAll('.content-block-btn'),
            sidebarTabs: document.querySelectorAll('.sidebar-tab'),
            tabContents: document.querySelectorAll('.tab-content'),
            previewModal: document.getElementById('preview-modal'),
            templatesModal: document.getElementById('templates-modal'),
            previewContent: document.getElementById('preview-content'),
            templateList: document.getElementById('template-list'),
            globalFont: document.getElementById('global-font'),
            primaryColor: document.getElementById('primary-color'),
        };
    }

    initState() {
        this.state = {
            newsletterData: {
                title: 'Untitled Newsletter',
                blocks: [],
                globalStyles: {
                    fontFamily: 'Inter, sans-serif',
                    primaryColor: '#007bff',
                    bodyBackgroundColor: '#f4f4f4',
                    canvasBackgroundColor: '#ffffff',
                },
            },
            selectedBlockId: null,
            history: [],
            historyIndex: -1,
            isDragging: false,
        };
    }

    init() {
        this.addEventListeners();
        this.loadState();
        this.updateCanvas();
        this.saveState(true);
        this.updateHistoryButtons();
    }

    addEventListeners() {
        // Top bar buttons
        this.elements.exportBtn.addEventListener('click', () => this.exporter.exportNewsletter(this.state.newsletterData));
        this.elements.previewBtn.addEventListener('click', () => this.showPreview());
        this.elements.templatesBtn.addEventListener('click', () => this.showTemplates());
        this.elements.darkModeBtn.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
        this.elements.undoBtn.addEventListener('click', () => this.undo());
        this.elements.redoBtn.addEventListener('click', () => this.redo());

        // Canvas controls
        this.elements.mobilePreviewBtn.addEventListener('click', () => this.setPreviewMode('mobile'));
        this.elements.desktopPreviewBtn.addEventListener('click', () => this.setPreviewMode('desktop'));
        this.elements.clearCanvasBtn.addEventListener('click', () => this.clearCanvas());
        this.elements.newsletterTitle.addEventListener('input', e => {
            this.state.newsletterData.title = e.target.textContent;
            this.scheduleSave();
        });

        // Drag and Drop
        this.elements.contentBlocks.forEach(block => {
            block.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', block.dataset.block);
                this.isDragging = true;
                setTimeout(() => block.classList.add('dragging'), 0);
            });
            block.addEventListener('dragend', () => {
                block.classList.remove('dragging');
                this.isDragging = false;
                this.removeDropIndicator();
            });
        });

        this.elements.canvas.addEventListener('dragover', e => this.handleDragOver(e));
        this.elements.canvas.addEventListener('dragleave', () => this.removeDropIndicator());
        this.elements.canvas.addEventListener('drop', e => this.handleDrop(e));
        
        // Canvas/Property interactions
        this.elements.canvas.addEventListener('click', e => this.handleCanvasClick(e));
        document.addEventListener('click', e => {
            if (!this.elements.canvas.contains(e.target) && !this.elements.propertiesContent.contains(e.target)) {
                this.selectBlock(null);
                this.updateCanvas();
            }
        });

        // Modals & Tabs
        this.elements.sidebarTabs.forEach(tab => tab.addEventListener('click', () => this.switchTab(tab.dataset.tab)));
        document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal').classList.remove('active')));
        
        // Global Styles
        this.elements.globalFont.addEventListener('change', e => this.updateGlobalStyle('fontFamily', e.target.value));
        this.elements.primaryColor.addEventListener('input', e => this.updateGlobalStyle('primaryColor', e.target.value));
    }

    // Main Methods
    updateCanvas() {
        const { canvas } = this.elements;
        const { blocks } = this.state.newsletterData;

        canvas.innerHTML = '';
        if (blocks.length === 0) {
            canvas.innerHTML = `<div class="canvas-empty-state"><i class="fas fa-magic"></i><h3>Design Your Newsletter</h3><p>Drag content blocks from the left sidebar to begin.</p></div>`;
        } else {
            blocks.forEach((block, index) => {
                const blockHtml = this.exporter.generateBlockHTML(block, this.state.newsletterData.globalStyles);
                const wrapper = document.createElement('div');
                wrapper.className = 'email-block';
                wrapper.dataset.blockId = block.id;
                wrapper.innerHTML = blockHtml;
                
                if (block.id === this.state.selectedBlockId) {
                    wrapper.classList.add('selected');
                    wrapper.appendChild(this.createBlockControls(block.id, index, blocks.length));
                }
                canvas.appendChild(wrapper);
            });
        }
        this.updatePropertiesPanel();
    }

    createBlock(type) {
        const base = { id: `block-${Date.now()}`, type, content: { padding: { top: 15, right: 20, bottom: 15, left: 20 } } };
        switch (type) {
            case 'text': return { ...base, content: { ...base.content, text: 'This is a paragraph. You can edit this text.', fontSize: 16, lineHeight: 1.6, color: '#333333', textAlign: 'left' } };
            case 'heading': return { ...base, content: { ...base.content, text: 'This is a Heading', fontSize: 28, color: '#222222', textAlign: 'left', fontWeight: 'bold' } };
            case 'image': return { ...base, content: { padding: { top: 0, right: 0, bottom: 0, left: 0 }, src: 'https://via.placeholder.com/600x300', alt: 'Image', link: '', borderRadius: 0, align: 'center' } };
            case 'button': return { ...base, content: { padding: { top: 15, right: 30, bottom: 15, left: 30 }, href: '#', text: 'Click Here', backgroundColor: '#007bff', color: '#ffffff', borderRadius: 5, align: 'center', fontWeight: 'bold', fontSize: 16 } };
            case 'divider': return { ...base, content: { padding: { top: 10, right: 20, bottom: 10, left: 20 }, color: '#dddddd', height: 1, style: 'solid' } };
            case 'spacer': return { ...base, content: { height: 30 } };
            case 'header': return { ...base, content: { padding: {}, imageUrl: 'https://via.placeholder.com/600x150/007bff/ffffff?text=Your+Logo', link: '#' } };
            case 'footer': return { ...base, content: { padding: {}, backgroundColor: '#f0f0f0', textColor: '#666666', companyName: 'Your Company Name', address: '123 Main St, Anytown, USA', unsubscribeUrl: '#', socialLinks: [{ platform: 'linkedin', url: '#' }, { platform: 'instagram', url: '#' }] } };
            case 'article': return { ...base, content: { ...base.content, title: 'Article Title', description: 'This is the description for the article. It provides a brief summary of the content.', imageUrl: 'https://via.placeholder.com/250', imageLeft: true, ctaText: 'Read More', ctaUrl: '#', imageWidth: 250 } };
            default: return { ...base, content: { ...base.content } };
        }
    }

    // Properties Panel Logic
    updatePropertiesPanel() {
        const { propertiesContent } = this.elements;
        const block = this.getSelectedBlock();

        if (!block) {
            propertiesContent.innerHTML = `<div class="properties-placeholder"><i class="fas fa-paint-brush"></i><p>Select a block to edit</p></div>`;
            return;
        }

        propertiesContent.innerHTML = `<h3>${block.type.charAt(0).toUpperCase() + block.type.slice(1)} Properties</h3>`;
        const controls = this.getControlsForBlock(block);
        controls.forEach(control => propertiesContent.appendChild(control));
    }

    getControlsForBlock(block) {
        const standardControls = {
            text: [this.createTextArea('text', 'Text'), this.createInput('fontSize', 'Font Size', 'number'), this.createInput('color', 'Color', 'color'), this.createSelect('textAlign', 'Alignment', ['left', 'center', 'right'])],
            heading: [this.createTextArea('text', 'Text'), this.createInput('fontSize', 'Font Size', 'number'), this.createInput('color', 'Color', 'color'), this.createSelect('textAlign', 'Alignment', ['left', 'center', 'right']), this.createSelect('fontWeight', 'Weight', ['normal', 'bold'])],
            image: [this.createInput('src', 'Image URL'), this.createInput('alt', 'Alt Text'), this.createInput('link', 'Link URL'), this.createInput('borderRadius', 'Border Radius', 'number'), this.createSelect('align', 'Alignment', ['left', 'center', 'right'])],
            button: [this.createInput('text', 'Button Text'), this.createInput('href', 'Link URL'), this.createInput('backgroundColor', 'Bg Color', 'color'), this.createInput('color', 'Text Color', 'color'), this.createInput('borderRadius', 'Border Radius', 'number')],
            divider: [this.createInput('color', 'Color', 'color'), this.createInput('height', 'Height', 'number'), this.createSelect('style', 'Style', ['solid', 'dashed', 'dotted'])],
            spacer: [this.createInput('height', 'Height', 'number')],
            header: [this.createInput('imageUrl', 'Logo URL'), this.createInput('link', 'Link URL')],
            footer: [this.createInput('companyName', 'Company Name'), this.createInput('address', 'Address'), this.createInput('unsubscribeUrl', 'Unsubscribe URL'), this.createInput('backgroundColor', 'Bg Color', 'color'), this.createInput('textColor', 'Text Color', 'color')],
            article: [this.createInput('title', 'Title'), this.createTextArea('description', 'Description'), this.createInput('imageUrl', 'Image URL'), this.createInput('ctaText', 'Button Text'), this.createInput('ctaUrl', 'Button URL'), this.createToggle('imageLeft', 'Image on Left?')],
        };
        const controls = standardControls[block.type] || [];
        if (block.content.padding) {
            controls.push(this.createSpacingInputs('padding', 'Padding'));
        }
        return controls;
    }

    createControl(label, controlElement) {
        const group = document.createElement('div');
        group.className = 'property-group';
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        group.append(labelEl, controlElement);
        return group;
    }

    createInput(key, label, type = 'text') {
        const input = document.createElement('input');
        input.type = type;
        input.value = this.getSelectedBlock().content[key] || '';
        if (type === 'color') {
            const container = document.createElement('div');
            container.className = 'color-input-group';
            const textInput = input.cloneNode();
            textInput.type = 'text';
            container.append(input, textInput);
            input.addEventListener('input', e => {
                textInput.value = e.target.value;
                this.updateBlockProperty(key, e.target.value);
            });
            textInput.addEventListener('input', e => {
                input.value = e.target.value;
                this.updateBlockProperty(key, e.target.value);
            });
            return this.createControl(label, container);
        }
        input.addEventListener('input', e => this.updateBlockProperty(key, e.target.value));
        return this.createControl(label, input);
    }
    
    createTextArea(key, label) {
        const textarea = document.createElement('textarea');
        textarea.rows = 4;
        textarea.value = this.getSelectedBlock().content[key] || '';
        textarea.addEventListener('input', e => this.updateBlockProperty(key, e.target.value));
        return this.createControl(label, textarea);
    }
    
    createSelect(key, label, options) {
        const select = document.createElement('select');
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
            option.selected = this.getSelectedBlock().content[key] === opt;
            select.appendChild(option);
        });
        select.addEventListener('change', e => this.updateBlockProperty(key, e.target.value));
        return this.createControl(label, select);
    }

    createSpacingInputs(key, label) {
        const container = document.createElement('div');
        container.className = 'spacing-group';
        const currentValues = this.getSelectedBlock().content[key];
        ['top', 'right', 'bottom', 'left'].forEach(side => {
            const sideContainer = document.createElement('div');
            sideContainer.className = 'spacing-input';
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = side.charAt(0).toUpperCase();
            input.value = currentValues[side] || 0;
            input.addEventListener('input', e => this.updateBlockProperty(`${key}.${side}`, e.target.value));
            sideContainer.appendChild(input);
            container.appendChild(sideContainer);
        });
        return this.createControl(label, container);
    }
    
    createToggle(key, label) {
        const container = document.createElement('div');
        container.className = 'toggle-switch';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `toggle-${key}`;
        input.checked = this.getSelectedBlock().content[key];
        const toggleLabel = document.createElement('label');
        toggleLabel.htmlFor = `toggle-${key}`;
        container.append(input, toggleLabel);
        input.addEventListener('change', e => this.updateBlockProperty(key, e.target.checked));
        return this.createControl(label, container);
    }

    updateBlockProperty(key, value) {
        const block = this.getSelectedBlock();
        if (block) {
            const keys = key.split('.');
            if (keys.length > 1) {
                block.content[keys[0]][keys[1]] = value;
            } else {
                block.content[key] = value;
            }
            this.updateCanvas();
            this.scheduleSave();
        }
    }
    
    updateGlobalStyle(key, value) {
        this.state.newsletterData.globalStyles[key] = value;
        this.updateCanvas();
        this.scheduleSave();
    }
    
    // Event Handlers
    handleDragOver(e) {
        e.preventDefault();
        const dropTarget = this.getDropTarget(e.clientY);
        this.insertDropIndicator(dropTarget);
    }

    getDropTarget(y) {
        const blockElements = [...this.elements.canvas.querySelectorAll('.email-block:not(.dragging-source)')];
        return blockElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    insertDropIndicator(target) {
        this.removeDropIndicator();
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        if (target) {
            this.elements.canvas.insertBefore(indicator, target);
        } else {
            this.elements.canvas.appendChild(indicator);
        }
    }

    removeDropIndicator() {
        const indicator = this.elements.canvas.querySelector('.drop-indicator');
        if (indicator) indicator.remove();
    }

    handleDrop(e) {
        e.preventDefault();
        const blockType = e.dataTransfer.getData('text/plain');
        if (!blockType) return;

        const newBlock = this.createBlock(blockType);
        const dropTarget = this.getDropTarget(e.clientY);
        const dropIndex = dropTarget ? [...this.elements.canvas.querySelectorAll('.email-block')].indexOf(dropTarget) : this.state.newsletterData.blocks.length;

        this.state.newsletterData.blocks.splice(dropIndex, 0, newBlock);
        this.selectBlock(newBlock.id);
        this.updateCanvas();
        this.saveState();
        this.removeDropIndicator();
    }

    handleCanvasClick(e) {
        if (this.isDragging) return;
        const blockElement = e.target.closest('.email-block');
        this.selectBlock(blockElement ? blockElement.dataset.blockId : null);
        this.updateCanvas();
    }
    
    // Block Management
    selectBlock(blockId) { this.state.selectedBlockId = blockId; }
    getSelectedBlock() { return this.state.newsletterData.blocks.find(b => b.id === this.state.selectedBlockId); }
    
    moveBlock(blockId, direction) {
        const { blocks } = this.state.newsletterData;
        const index = blocks.findIndex(b => b.id === blockId);
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < blocks.length) {
            [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
            this.updateCanvas();
            this.saveState();
        }
    }

    duplicateBlock(blockId) {
        const { blocks } = this.state.newsletterData;
        const blockToCopy = blocks.find(b => b.id === blockId);
        if (blockToCopy) {
            const index = blocks.indexOf(blockToCopy);
            const newBlock = JSON.parse(JSON.stringify(blockToCopy)); // Deep copy
            newBlock.id = `block-${Date.now()}`;
            blocks.splice(index + 1, 0, newBlock);
            this.selectBlock(newBlock.id);
            this.updateCanvas();
            this.saveState();
        }
    }

    deleteBlock(blockId) {
        this.state.newsletterData.blocks = this.state.newsletterData.blocks.filter(b => b.id !== blockId);
        if (this.state.selectedBlockId === blockId) this.selectBlock(null);
        this.updateCanvas();
        this.saveState();
    }
    
    // UI & Modals
    showPreview() {
        const html = this.exporter.generateEmailHTML(this.state.newsletterData);
        this.elements.previewContent.innerHTML = `<iframe srcdoc="${this.escapeHtml(html)}" style="width:100%; height:100%; border:0;"></iframe>`;
        this.elements.previewModal.classList.add('active');
    }
    
    showTemplates() {
        this.elements.templateList.innerHTML = '';
        Object.entries(EmailTemplates).forEach(([key, template]) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${template.name}</span><button class="btn">Load</button>`;
            li.querySelector('button').addEventListener('click', () => this.loadTemplate(key));
            this.elements.templateList.appendChild(li);
        });
        this.elements.templatesModal.classList.add('active');
    }
    
    loadTemplate(key) {
        const template = JSON.parse(JSON.stringify(EmailTemplates[key]));
        this.state.newsletterData.blocks = template.structure;
        this.state.newsletterData.title = template.name;
        this.elements.newsletterTitle.textContent = template.name;
        this.selectBlock(null);
        this.updateCanvas();
        this.saveState();
        this.elements.templatesModal.classList.remove('active');
    }
    
    switchTab(tabId) {
        this.elements.sidebarTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabId));
        this.elements.tabContents.forEach(content => content.style.display = content.id === `${tabId}-tab` ? 'block' : 'none');
    }
    
    setPreviewMode(mode) {
        this.elements.canvas.style.width = mode === 'mobile' ? '375px' : '600px';
        this.elements.mobilePreviewBtn.classList.toggle('btn-primary', mode === 'mobile');
        this.elements.desktopPreviewBtn.classList.toggle('btn-primary', mode !== 'mobile');
    }
    
    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            this.state.newsletterData.blocks = [];
            this.selectBlock(null);
            this.updateCanvas();
            this.saveState();
        }
    }

    // State Management
    scheduleSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.saveState(), 500);
    }
    
    saveState(isInitial = false) {
        const currentState = JSON.stringify(this.state.newsletterData);
        localStorage.setItem('newsletterState', currentState);
        if (isInitial || (this.state.history.length > 0 && this.state.history[this.state.historyIndex] === currentState)) {
            return;
        }
        this.state.history.splice(this.state.historyIndex + 1);
        this.state.history.push(currentState);
        this.state.historyIndex++;
        this.updateHistoryButtons();
    }

    loadState() {
        const savedState = localStorage.getItem('newsletterState');
        if (savedState) {
            this.state.newsletterData = JSON.parse(savedState);
            this.elements.newsletterTitle.textContent = this.state.newsletterData.title;
            this.elements.globalFont.value = this.state.newsletterData.globalStyles.fontFamily;
            this.elements.primaryColor.value = this.state.newsletterData.globalStyles.primaryColor;
        }
    }

    undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            this.state.newsletterData = JSON.parse(this.state.history[this.state.historyIndex]);
            this.selectBlock(null);
            this.updateCanvas();
            this.updateHistoryButtons();
            localStorage.setItem('newsletterState', this.state.history[this.state.historyIndex]);
        }
    }

    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            this.state.newsletterData = JSON.parse(this.state.history[this.state.historyIndex]);
            this.selectBlock(null);
            this.updateCanvas();
            this.updateHistoryButtons();
            localStorage.setItem('newsletterState', this.state.history[this.state.historyIndex]);
        }
    }
    
    updateHistoryButtons() {
        this.elements.undoBtn.disabled = this.state.historyIndex <= 0;
        this.elements.redoBtn.disabled = this.state.historyIndex >= this.state.history.length - 1;
    }

    // Utilities
    createBlockControls(blockId, index, total) {
        const controls = document.createElement('div');
        controls.className = 'block-controls';
        const createBtn = (icon, title, action) => {
            const btn = document.createElement('button');
            btn.className = `block-control-btn`;
            btn.title = title;
            btn.innerHTML = `<i class="fas ${icon}"></i>`;
            btn.addEventListener('click', e => { e.stopPropagation(); action(); });
            return btn;
        };
        const moveUp = createBtn('fa-arrow-up', 'Move Up', () => this.moveBlock(blockId, -1));
        if (index === 0) moveUp.disabled = true;
        const moveDown = createBtn('fa-arrow-down', 'Move Down', () => this.moveBlock(blockId, 1));
        if (index === total - 1) moveDown.disabled = true;
        const duplicate = createBtn('fa-copy', 'Duplicate', () => this.duplicateBlock(blockId));
        const del = createBtn('fa-trash', 'Delete', () => this.deleteBlock(blockId));
        del.classList.add('delete');
        controls.append(moveUp, moveDown, duplicate, del);
        return controls;
    }

    escapeHtml(html) { return html.replace(/"/g, '&quot;'); }
}

document.addEventListener('DOMContentLoaded', () => {
    window.newsletterForge = new NewsletterBuilder();
});