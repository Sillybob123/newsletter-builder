class NewsletterBuilder {
    constructor() {
        this.exporter = new NewsletterExporter();
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
        };

        this.state = {
            newsletterData: {
                title: 'Untitled Newsletter',
                blocks: [],
                globalStyles: {
                    fontFamily: 'Inter, sans-serif',
                    primaryColor: '#007bff',
                    backgroundColor: '#ffffff',
                },
            },
            selectedBlockId: null,
            history: [],
            historyIndex: -1,
            isDragging: false,
        };

        this.init();
    }

    init() {
        this.addEventListeners();
        this.loadState();
        this.updateCanvas();
        this.saveState(true); 
        this.updateHistoryButtons();
    }

    addEventListeners() {
        this.elements.exportBtn.addEventListener('click', () => this.exportHTML());
        this.elements.previewBtn.addEventListener('click', () => this.showPreview());
        this.elements.templatesBtn.addEventListener('click', () => this.showTemplates());
        this.elements.darkModeBtn.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
        this.elements.mobilePreviewBtn.addEventListener('click', () => this.setPreviewMode('mobile'));
        this.elements.desktopPreviewBtn.addEventListener('click', () => this.setPreviewMode('desktop'));
        this.elements.clearCanvasBtn.addEventListener('click', () => this.clearCanvas());
        this.elements.undoBtn.addEventListener('click', () => this.undo());
        this.elements.redoBtn.addEventListener('click', () => this.redo());

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
        this.elements.canvas.addEventListener('click', e => this.handleCanvasClick(e));

        this.elements.sidebarTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => btn.closest('.modal').classList.remove('active'));
        });
        
        document.addEventListener('keydown', e => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') { e.preventDefault(); this.undo(); }
                if (e.key === 'y') { e.preventDefault(); this.redo(); }
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if(this.state.selectedBlockId && document.activeElement.tagName.toLowerCase() !== 'input' && document.activeElement.tagName.toLowerCase() !== 'textarea') {
                    e.preventDefault();
                    this.deleteBlock(this.state.selectedBlockId);
                }
            }
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        const dropTarget = this.getDropTarget(e.clientY);
        this.insertDropIndicator(dropTarget);
    }
    
    getDropTarget(y) {
        const blockElements = [...this.elements.canvas.querySelectorAll('.email-block')];
        return blockElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    insertDropIndicator(targetElement) {
        this.removeDropIndicator();
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        if (targetElement) {
            this.elements.canvas.insertBefore(indicator, targetElement);
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
        const dropIndex = dropTarget ? 
            [...this.elements.canvas.querySelectorAll('.email-block')].indexOf(dropTarget) : 
            this.state.newsletterData.blocks.length;

        this.state.newsletterData.blocks.splice(dropIndex, 0, newBlock);
        this.selectBlock(newBlock.id);
        this.updateCanvas();
        this.saveState();
        this.removeDropIndicator();
        this.isDragging = false;
    }

    createBlock(type) {
        const baseBlock = { id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, type };
        switch (type) {
            case 'text': return { ...baseBlock, content: { text: 'This is a new text block. Click to edit.', padding: { top: '10', right: '20', bottom: '10', left: '20' }, fontSize: '16', color: '#333333', textAlign: 'left' } };
            case 'heading': return { ...baseBlock, content: { text: 'This is a Heading', padding: { top: '10', right: '20', bottom: '10', left: '20' }, fontSize: '24', color: '#333333', textAlign: 'left', fontWeight: 'bold' } };
            case 'image': return { ...baseBlock, content: { src: 'https://via.placeholder.com/600x300', alt: 'placeholder', padding: { top: '0', right: '0', bottom: '0', left: '0' }, link: '' } };
            case 'button': return { ...baseBlock, content: { text: 'Click Me', href: '#', padding: { top: '12', right: '24', bottom: '12', left: '24' }, backgroundColor: '#007bff', color: '#ffffff', borderRadius: '5', textAlign: 'center' } };
            case 'divider': return { ...baseBlock, content: { padding: { top: '10', right: '20', bottom: '10', left: '20' }, color: '#dddddd', height: '1' } };
            case 'spacer': return { ...baseBlock, content: { height: '30' } };
            default: return { ...baseBlock, content: {} };
        }
    }

    updateCanvas() {
        const { canvas } = this.elements;
        const { blocks } = this.state.newsletterData;

        if (blocks.length === 0) {
            canvas.innerHTML = `<div class="canvas-empty-state"><i class="fas fa-mouse-pointer"></i><h3>Start Building Your Newsletter</h3><p>Drag content blocks from the left sidebar to get started.</p></div>`;
        } else {
            canvas.innerHTML = '';
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
    
    createBlockControls(blockId, index, totalBlocks) {
        const controls = document.createElement('div');
        controls.className = 'block-controls';
        
        const moveUpBtn = this.createControlButton('move-up', 'fa-arrow-up', 'Move Up', () => this.moveBlock(blockId, -1));
        if (index === 0) moveUpBtn.disabled = true;

        const moveDownBtn = this.createControlButton('move-down', 'fa-arrow-down', 'Move Down', () => this.moveBlock(blockId, 1));
        if (index === totalBlocks - 1) moveDownBtn.disabled = true;

        const duplicateBtn = this.createControlButton('duplicate', 'fa-copy', 'Duplicate', () => this.duplicateBlock(blockId));
        const deleteBtn = this.createControlButton('delete', 'fa-trash', 'Delete', () => this.deleteBlock(blockId));
        
        controls.append(moveUpBtn, moveDownBtn, duplicateBtn, deleteBtn);
        return controls;
    }

    createControlButton(className, icon, title, onClick) {
        const button = document.createElement('button');
        button.className = `block-control-btn ${className}`;
        button.title = title;
        button.innerHTML = `<i class="fas ${icon}"></i>`;
        button.addEventListener('click', e => {
            e.stopPropagation();
            onClick();
        });
        return button;
    }

    updatePropertiesPanel() {
        const { propertiesContent } = this.elements;
        const block = this.getSelectedBlock();

        if (!block) {
            propertiesContent.innerHTML = `<div class="properties-placeholder"><i class="fas fa-hand-pointer"></i><p>Select a block to edit its properties</p></div>`;
            return;
        }

        propertiesContent.innerHTML = '';
        for (const key in block.content) {
            const value = block.content[key];
            const propertyGroup = document.createElement('div');
            propertyGroup.className = 'property-group';

            const label = document.createElement('label');
            label.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            propertyGroup.appendChild(label);
            
            if (key === 'padding') {
                propertyGroup.appendChild(this.createSpacingInputs(key, value));
            } else {
                const input = this.createGenericInput(key, value);
                propertyGroup.appendChild(input);
            }
            propertiesContent.appendChild(propertyGroup);
        }
    }
    
    createSpacingInputs(key, value) {
        const container = document.createElement('div');
        container.className = 'spacing-group';
        ['top', 'right', 'bottom', 'left'].forEach(side => {
            const sideContainer = document.createElement('div');
            sideContainer.className = 'spacing-input';
            const label = document.createElement('label');
            label.textContent = side.toUpperCase();
            const input = document.createElement('input');
            input.type = 'number';
            input.value = value[side] || 0;
            input.addEventListener('input', e => this.updateBlockProperty(`${key}.${side}`, e.target.value));
            sideContainer.append(label, input);
            container.appendChild(sideContainer);
        });
        return container;
    }
    
    createGenericInput(key, value) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.addEventListener('input', e => this.updateBlockProperty(key, e.target.value));
        return input;
    }

    updateBlockProperty(key, value) {
        const block = this.getSelectedBlock();
        if (block) {
            // Handle nested properties like "padding.top"
            const keys = key.split('.');
            if (keys.length > 1) {
                block.content[keys[0]][keys[1]] = value;
            } else {
                block.content[key] = value;
            }
            
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => this.saveState(), 300);
            this.updateCanvas();
        }
    }

    handleCanvasClick(e) {
        if (this.isDragging) return;
        const blockElement = e.target.closest('.email-block');
        this.selectBlock(blockElement ? blockElement.dataset.blockId : null);
        this.updateCanvas();
    }
    
    selectBlock(blockId) {
        this.state.selectedBlockId = blockId;
    }

    getSelectedBlock() {
        return this.state.newsletterData.blocks.find(b => b.id === this.state.selectedBlockId);
    }
    
    moveBlock(blockId, direction) {
        const { blocks } = this.state.newsletterData;
        const index = blocks.findIndex(b => b.id === blockId);
        if ((direction === -1 && index > 0) || (direction === 1 && index < blocks.length - 1)) {
            [blocks[index], blocks[index + direction]] = [blocks[index + direction], blocks[index]];
            this.updateCanvas();
            this.saveState();
        }
    }

    duplicateBlock(blockId) {
        const { blocks } = this.state.newsletterData;
        const blockToCopy = blocks.find(b => b.id === blockId);
        const index = blocks.indexOf(blockToCopy);
        if (blockToCopy) {
            const newBlock = JSON.parse(JSON.stringify(blockToCopy));
            newBlock.id = `block-${Date.now()}`;
            blocks.splice(index + 1, 0, newBlock);
            this.selectBlock(newBlock.id);
            this.updateCanvas();
            this.saveState();
        }
    }

    deleteBlock(blockId) {
        this.state.newsletterData.blocks = this.state.newsletterData.blocks.filter(b => b.id !== blockId);
        if (this.state.selectedBlockId === blockId) {
            this.selectBlock(null);
        }
        this.updateCanvas();
        this.saveState();
    }

    switchTab(tabId) {
        this.elements.sidebarTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabId));
        this.elements.tabContents.forEach(content => content.style.display = content.id === `${tabId}-tab` ? 'block' : 'none');
    }

    showPreview() {
        const html = this.exporter.generateEmailHTML(this.state.newsletterData);
        this.elements.previewContent.innerHTML = `<iframe srcdoc="${html.replace(/"/g, '&quot;')}" style="width:100%; height:100%; border:0;"></iframe>`;
        this.elements.previewModal.classList.add('active');
    }

    exportHTML() {
        this.exporter.exportNewsletter(this.state.newsletterData);
    }
    
    showTemplates() {
        this.elements.templateList.innerHTML = '';
        for (const key in EmailTemplates) {
            const template = EmailTemplates[key];
            const li = document.createElement('li');
            li.innerHTML = `<span>${template.name}</span><button class="btn">Load</button>`;
            li.querySelector('button').addEventListener('click', () => this.loadTemplate(key));
            this.elements.templateList.appendChild(li);
        }
        this.elements.templatesModal.classList.add('active');
    }
    
    loadTemplate(key) {
        const template = JSON.parse(JSON.stringify(EmailTemplates[key]));
        this.state.newsletterData.blocks = template.structure;
        this.elements.newsletterTitle.textContent = template.name;
        this.state.newsletterData.title = template.name;
        this.selectBlock(null);
        this.updateCanvas();
        this.saveState();
        this.elements.templatesModal.classList.remove('active');
    }

    saveState(isInitial = false) {
        localStorage.setItem('newsletterState', JSON.stringify(this.state.newsletterData));
        
        if (isInitial) return;
        
        const currentState = JSON.stringify(this.state.newsletterData);
        if (this.state.history.length > 0 && this.state.history[this.state.historyIndex] === currentState) {
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

    setPreviewMode(mode) {
        const canvasContainer = this.elements.canvas.parentElement;
        if (mode === 'mobile') {
            canvasContainer.style.width = '375px';
            this.elements.mobilePreviewBtn.classList.add('btn-primary');
            this.elements.desktopPreviewBtn.classList.remove('btn-primary');
        } else {
            canvasContainer.style.width = 'var(--canvas-width, 600px)';
            this.elements.desktopPreviewBtn.classList.add('btn-primary');
            this.elements.mobilePreviewBtn.classList.remove('btn-primary');
        }
    }

    clearCanvas() {
        if (confirm('Are you sure you want to clear the entire canvas? This cannot be undone.')) {
            this.state.newsletterData.blocks = [];
            this.state.selectedBlockId = null;
            this.updateCanvas();
            this.saveState();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.newsletterForge = new NewsletterBuilder();
});