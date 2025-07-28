document.addEventListener('DOMContentLoaded', () => {
    const newsletterForge = {
        // DOM Elements
        elements: {
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
            clearCanvasBtn: document.getElementById('clear-canvas'),
            newsletterTitle: document.getElementById('newsletter-title'),
            contentBlocks: document.querySelectorAll('.content-block-btn'),
            sidebarTabs: document.querySelectorAll('.sidebar-tab'),
            tabContents: document.querySelectorAll('.tab-content'),
            previewModal: document.getElementById('preview-modal'),
            templatesModal: document.getElementById('templates-modal'),
            previewContent: document.getElementById('preview-content'),
            templateList: document.getElementById('template-list'),
        },

        // Application State
        state: {
            newsletterData: {
                title: 'Untitled Newsletter',
                blocks: [],
                globalStyles: {
                    fontFamily: 'Inter, sans-serif',
                    primaryColor: '#007bff',
                    backgroundColor: '#ffffff',
                },
            },
            selectedBlock: null,
            history: [],
            historyIndex: -1,
        },

        // Initialization
        init() {
            this.addEventListeners();
            this.updateCanvas();
            this.saveState();
        },

        // Event Listeners
        addEventListeners() {
            const { elements } = this;
            elements.exportBtn.addEventListener('click', () => this.exportHTML());
            elements.previewBtn.addEventListener('click', () => this.showPreview());
            elements.templatesBtn.addEventListener('click', () => this.showTemplates());
            elements.darkModeBtn.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
            elements.mobilePreviewBtn.addEventListener('click', () => this.setPreviewMode('mobile'));
            elements.desktopPreviewBtn.addEventListener('click', () => this.setPreviewMode('desktop'));
            elements.clearCanvasBtn.addEventListener('click', () => this.clearCanvas());
            elements.undoBtn.addEventListener('click', () => this.undo());
            elements.redoBtn.addEventListener('click', () => this.redo());

            elements.contentBlocks.forEach(block => {
                block.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', block.dataset.block);
                    block.classList.add('dragging');
                });
                block.addEventListener('dragend', () => block.classList.remove('dragging'));
            });

            elements.canvas.addEventListener('dragover', e => {
                e.preventDefault();
                elements.canvas.classList.add('drag-over');
            });

            elements.canvas.addEventListener('dragleave', () => elements.canvas.classList.remove('drag-over'));
            elements.canvas.addEventListener('drop', e => this.handleDrop(e));

            elements.sidebarTabs.forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
            });
            
            elements.canvas.addEventListener('click', e => this.handleCanvasClick(e));

            document.querySelectorAll('.modal-close').forEach(btn => {
                btn.addEventListener('click', () => btn.closest('.modal').classList.remove('active'));
            });
        },
        
        // Drag and Drop
        handleDrop(e) {
            e.preventDefault();
            this.elements.canvas.classList.remove('drag-over');
            const blockType = e.dataTransfer.getData('text/plain');
            const newBlock = this.createBlock(blockType);
            this.state.newsletterData.blocks.push(newBlock);
            this.updateCanvas();
            this.saveState();
        },

        // Block Creation
        createBlock(type) {
            const baseBlock = { id: `block-${Date.now()}`, type };
            switch (type) {
                case 'text':
                    return { ...baseBlock, content: { text: 'This is a new text block.', padding: { top: '10px', right: '20px', bottom: '10px', left: '20px' }, fontSize: '16px', color: '#333333', textAlign: 'left' } };
                case 'heading':
                    return { ...baseBlock, content: { text: 'This is a Heading', padding: { top: '10px', right: '20px', bottom: '10px', left: '20px' }, fontSize: '24px', color: '#333333', textAlign: 'left', fontWeight: 'bold' } };
                case 'image':
                    return { ...baseBlock, content: { src: 'https://via.placeholder.com/600x300', alt: 'placeholder image', padding: { top: '10px', right: '10px', bottom: '10px', left: '10px' }, width: '100%', height: 'auto', borderRadius: '0px', link: '' } };
                case 'button':
                    return { ...baseBlock, content: { text: 'Click Me', href: '#', padding: { top: '10px', right: '20px', bottom: '10px', left: '20px' }, backgroundColor: '#007bff', color: '#ffffff', borderRadius: '5px', textAlign: 'center' } };
                // Add other block types here from your exporter
                default:
                    return { ...baseBlock, content: {} };
            }
        },

        // Canvas Updates
        updateCanvas() {
            const { canvas } = this.elements;
            const { newsletterData } = this.state;
            
            if (newsletterData.blocks.length === 0) {
                canvas.innerHTML = `
                    <div class="canvas-empty-state">
                        <i class="fas fa-mouse-pointer"></i>
                        <h3>Start Building Your Newsletter</h3>
                        <p>Drag content blocks from the left sidebar to get started, or choose from our templates.</p>
                    </div>`;
                return;
            }

            canvas.innerHTML = '';
            const exporter = new NewsletterExporter();
            newsletterData.blocks.forEach(block => {
                const blockHtml = exporter.generateBlockHTML(block, newsletterData.globalStyles);
                const blockWrapper = document.createElement('div');
                blockWrapper.classList.add('email-block');
                blockWrapper.dataset.blockId = block.id;
                blockWrapper.innerHTML = blockHtml;
                canvas.appendChild(blockWrapper);
            });
            this.updatePropertiesPanel();
        },

        // Properties Panel
        updatePropertiesPanel() {
            const { propertiesContent } = this.elements;
            const { selectedBlock, newsletterData } = this.state;

            if (!selectedBlock) {
                propertiesContent.innerHTML = `
                    <div style="text-align: center; color: var(--secondary); margin-top: 2rem;">
                        <i class="fas fa-hand-pointer" style="font-size: 2rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                        <p>Select a block to edit its properties</p>
                    </div>`;
                return;
            }

            const block = newsletterData.blocks.find(b => b.id === selectedBlock);
            if (!block) return;

            let propertiesHTML = '';
            for (const key in block.content) {
                const value = block.content[key];
                propertiesHTML += `
                    <div class="property-group">
                        <label for="prop-${key}">${key}</label>
                        <input type="text" id="prop-${key}" data-key="${key}" value="${this.escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}">
                    </div>
                `;
            }
            propertiesContent.innerHTML = propertiesHTML;

            propertiesContent.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', e => this.updateBlockProperty(e.target.dataset.key, e.target.value));
            });
        },

        updateBlockProperty(key, value) {
            const { selectedBlock, newsletterData } = this.state;
            const block = newsletterData.blocks.find(b => b.id === selectedBlock);
            if (block) {
                try {
                    // Attempt to parse object-like strings
                    block.content[key] = JSON.parse(value);
                } catch (e) {
                    block.content[key] = value;
                }
                this.updateCanvas();
                // Debounce saving state
                clearTimeout(this.saveTimeout);
                this.saveTimeout = setTimeout(() => this.saveState(), 500);
            }
        },

        // Event Handlers
        handleCanvasClick(e) {
            const blockElement = e.target.closest('.email-block');
            if (blockElement) {
                this.state.selectedBlock = blockElement.dataset.blockId;
                document.querySelectorAll('.email-block.selected').forEach(el => el.classList.remove('selected'));
                blockElement.classList.add('selected');
            } else {
                this.state.selectedBlock = null;
                document.querySelectorAll('.email-block.selected').forEach(el => el.classList.remove('selected'));
            }
            this.updatePropertiesPanel();
        },

        switchTab(tabId) {
            this.elements.sidebarTabs.forEach(tab => tab.classList.remove('active'));
            this.elements.tabContents.forEach(content => content.style.display = 'none');
            document.querySelector(`.sidebar-tab[data-tab="${tabId}"]`).classList.add('active');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        },

        // Preview and Export
        showPreview() {
            const exporter = new NewsletterExporter();
            const html = exporter.generateEmailHTML(this.state.newsletterData);
            this.elements.previewContent.innerHTML = `<iframe srcdoc="${this.escapeHtml(html)}" style="width:100%; height:100%; border:0;"></iframe>`;
            this.elements.previewModal.classList.add('active');
        },

        exportHTML() {
            const exporter = new NewsletterExporter();
            exporter.exportNewsletter(this.state.newsletterData);
        },
        
        // Templates
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
        },
        
        loadTemplate(key) {
            this.state.newsletterData = JSON.parse(JSON.stringify(EmailTemplates[key].structure));
            // Remap structure to blocks for compatibility
            this.state.newsletterData.blocks = EmailTemplates[key].structure;
            this.elements.newsletterTitle.textContent = EmailTemplates[key].name;
            this.state.newsletterData.title = EmailTemplates[key].name;
            this.updateCanvas();
            this.saveState();
            this.elements.templatesModal.classList.remove('active');
        },

        // History (Undo/Redo)
        saveState() {
            const currentState = JSON.stringify(this.state.newsletterData);
            this.state.history.splice(this.state.historyIndex + 1);
            this.state.history.push(currentState);
            this.state.historyIndex++;
            this.updateHistoryButtons();
        },

        undo() {
            if (this.state.historyIndex > 0) {
                this.state.historyIndex--;
                this.state.newsletterData = JSON.parse(this.state.history[this.state.historyIndex]);
                this.updateCanvas();
                this.updateHistoryButtons();
            }
        },

        redo() {
            if (this.state.historyIndex < this.state.history.length - 1) {
                this.state.historyIndex++;
                this.state.newsletterData = JSON.parse(this.state.history[this.state.historyIndex]);
                this.updateCanvas();
                this.updateHistoryButtons();
            }
        },
        
        updateHistoryButtons() {
            this.elements.undoBtn.disabled = this.state.historyIndex <= 0;
            this.elements.redoBtn.disabled = this.state.historyIndex >= this.state.history.length - 1;
        },

        // Utility
        setPreviewMode(mode) {
            if (mode === 'mobile') {
                this.elements.canvas.style.width = '375px';
                this.elements.mobilePreviewBtn.classList.add('btn-primary');
                this.elements.desktopPreviewBtn.classList.remove('btn-primary');
            } else {
                this.elements.canvas.style.width = '600px';
                this.elements.desktopPreviewBtn.classList.add('btn-primary');
                this.elements.mobilePreviewBtn.classList.remove('btn-primary');
            }
        },

        clearCanvas() {
            if (confirm('Are you sure you want to clear the entire canvas?')) {
                this.state.newsletterData.blocks = [];
                this.state.selectedBlock = null;
                this.updateCanvas();
                this.saveState();
            }
        },
        
        escapeHtml(str) {
            const p = document.createElement('p');
            p.textContent = str;
            return p.innerHTML;
        }
    };

    newsletterForge.init();
});