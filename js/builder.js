class NewsletterBuilder {
    constructor() {
        this.currentNewsletter = {
            title: 'My Newsletter',
            content: [],
        };
        this.selectedElement = null;
        this.history = [];
        this.historyIndex = -1;
        this.init();
    }

    init() {
        this.bindGlobalEvents();
        this.updatePreview();
        this.saveToHistory();
    }

    // --- EVENT BINDING ---
    bindGlobalEvents() {
        // Template Selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectTemplate(e.currentTarget.dataset.template));
        });

        // Sidebar Dragging
        document.querySelectorAll('.block-btn').forEach(btn => {
            btn.addEventListener('dragstart', this.handleSidebarDragStart.bind(this));
        });

        // Canvas Drop Zone
        const canvas = document.getElementById('newsletter-canvas');
        canvas.addEventListener('dragover', this.handleCanvasDragOver.bind(this));
        canvas.addEventListener('dragleave', this.handleCanvasDragLeave.bind(this));
        canvas.addEventListener('drop', this.handleCanvasDrop.bind(this));

        // Top Toolbar
        document.getElementById('preview-btn').addEventListener('click', () => this.showPreview());
        document.getElementById('export-btn').addEventListener('click', () => newsletterExporter.exportNewsletter(this.currentNewsletter));
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearNewsletter());
        document.getElementById('spam-check-btn').addEventListener('click', () => this.runSpamCheck());

        // Modals
        document.querySelectorAll('.modal .close-btn').forEach(btn => btn.addEventListener('click', (e) => this.closeModal(e.currentTarget.closest('.modal'))));
        document.getElementById('preview-modal').addEventListener('click', (e) => e.target.id === 'preview-modal' && this.closeModal(e.target));
        document.getElementById('spam-report-modal').addEventListener('click', (e) => e.target.id === 'spam-report-modal' && this.closeModal(e.target));
        document.querySelectorAll('.preview-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPreviewTab(e.currentTarget));
        });

        // Deselect listener
         document.addEventListener('click', (e) => {
            if (!e.target.closest('.content-block') && !e.target.closest('.properties-panel')) {
                this.deselectBlock();
            }
        });
    }
    
    bindBlockEvents() {
        document.querySelectorAll('.content-block').forEach(blockEl => {
            blockEl.setAttribute('draggable', 'true');
            blockEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectBlock(parseInt(e.currentTarget.dataset.blockIndex));
            });
            blockEl.addEventListener('dragstart', this.handleBlockDragStart.bind(this));
            blockEl.querySelector('.delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBlock(parseInt(blockEl.dataset.blockIndex));
            });
        });
    }

    // --- DRAG & DROP LOGIC ---
    handleSidebarDragStart(e) {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', e.currentTarget.dataset.block);
    }
    
    handleBlockDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `move:${e.currentTarget.dataset.blockIndex}`);
        // Add a slight delay to allow the browser to render the drag image
        setTimeout(() => {
            e.target.style.opacity = '0.5';
        }, 0);
    }

    handleCanvasDragOver(e) {
        e.preventDefault();
        const canvas = e.currentTarget;
        canvas.classList.add('drag-over');

        // Remove existing indicators
        this.removeDropIndicator();

        // Find the element we are hovering over
        const afterElement = this.getDragAfterElement(canvas, e.clientY);
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';

        if (afterElement == null) {
            canvas.appendChild(indicator);
        } else {
            canvas.insertBefore(indicator, afterElement);
        }
    }
    
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.content-block:not(.dragging)')];
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

    handleCanvasDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
        this.removeDropIndicator();
    }

    handleCanvasDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        this.removeDropIndicator();
        
        document.querySelectorAll('.content-block').forEach(el => el.style.opacity = '1');

        const data = e.dataTransfer.getData('text/plain');
        const afterElement = this.getDragAfterElement(e.currentTarget, e.clientY);
        const dropIndex = afterElement ? parseInt(afterElement.dataset.blockIndex) : this.currentNewsletter.content.length;

        if (data.startsWith('move:')) {
            // Re-ordering existing block
            const originalIndex = parseInt(data.split(':')[1]);
            const movedBlock = this.currentNewsletter.content.splice(originalIndex, 1)[0];
            const finalIndex = originalIndex < dropIndex ? dropIndex - 1 : dropIndex;
            this.currentNewsletter.content.splice(finalIndex, 0, movedBlock);
            this.deselectBlock();
        } else {
            // Adding new block from sidebar
            this.addContentBlockAtIndex(data, dropIndex);
        }
        
        this.updatePreview();
        this.saveToHistory();
    }
    
    removeDropIndicator() {
        const indicator = document.querySelector('.drop-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // --- CORE BUILDER FUNCTIONS ---
    selectTemplate(templateName) {
        if (!EmailTemplates[templateName]) return;
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        document.querySelector(`[data-template="${templateName}"]`).classList.add('active');
        this.currentNewsletter.content = JSON.parse(JSON.stringify(EmailTemplates[templateName].structure));
        this.updatePreview();
        this.saveToHistory();
    }
    
    addContentBlockAtIndex(blockType, index) {
        const newBlock = this.createContentBlock(blockType);
        this.currentNewsletter.content.splice(index, 0, newBlock);
    }

    createContentBlock(type) {
        const blockData = {
            heading: { type: 'heading', content: { text: 'Headline Text', fontSize: '32px', color: '#222222', textAlign: 'left' } },
            text: { type: 'text', content: { text: 'This is a paragraph of text. You can edit it in the properties panel.', fontSize: '16px', color: '#555555' } },
            boxedText: { type: 'boxedText', content: { text: 'This is text inside a styled box.', backgroundColor: '#f0f0f0', border: '1px solid #dddddd' } },
            image: { type: 'image', content: { src: 'https://via.placeholder.com/600x300', alt: 'Placeholder image', width: '600px', borderRadius: '0' } },
            imageGroup: { type: 'imageGroup', content: { images: [{ src: 'https://via.placeholder.com/290x200', alt: 'Image 1' }, { src: 'https://via.placeholder.com/290x200', alt: 'Image 2' }] } },
            imageText: { type: 'imageText', content: { src: 'https://via.placeholder.com/180x150', alt: 'Image', title: 'Feature Title', text: 'A short description of the feature.', imagePosition: 'left' } },
            button: { type: 'button', content: { text: 'Click Here', href: '#', backgroundColor: '#007bff', color: '#ffffff', align: 'center' } },
            divider: { type: 'divider', content: { width: '2px', style: 'solid', color: '#dddddd' } },
            spacer: { type: 'spacer', content: { height: '20px' } },
            social: { type: 'social', content: { links: [{ platform: 'twitter', url: '#' }, { platform: 'facebook', url: '#' }] } },
            footer: { type: 'footer', content: { text: '© 2025 Your Company. All Rights Reserved.', unsubscribeUrl: '#' } },
        };
        const newBlock = JSON.parse(JSON.stringify(blockData[type] || blockData.text));
        newBlock.id = `block-${Date.now()}`;
        return newBlock;
    }

    updatePreview() {
        const canvas = document.getElementById('newsletter-canvas');
        canvas.innerHTML = '';
        if (this.currentNewsletter.content.length === 0) {
            canvas.innerHTML = `<div class="empty-state">
                <i class="fas fa-mouse-pointer"></i>
                <h3>Start Building Your Newsletter</h3>
                <p>Drag content blocks from the left sidebar and drop them here.</p>
            </div>`;
            return;
        }
        this.currentNewsletter.content.forEach((block, index) => {
            const blockHtml = (TemplateRenderer[`render${this.capitalizeFirst(block.type)}`] || (() => ''))(block.content);
            const wrapper = document.createElement('div');
            wrapper.className = 'content-block';
            wrapper.dataset.blockIndex = index;
            wrapper.innerHTML = `<div class="block-controls"><button class="control-btn delete" title="Delete"><i class="fas fa-trash"></i></button></div>${blockHtml}`;
            canvas.appendChild(wrapper);
        });
        this.bindBlockEvents();
    }
    
    // --- UI & STATE MANAGEMENT ---
    selectBlock(index) {
        this.selectedElement = index;
        document.querySelectorAll('.content-block').forEach((el, i) => {
            el.classList.toggle('selected', i === index);
        });
        this.showBlockProperties(index);
    }
    
    deselectBlock() {
        this.selectedElement = null;
        document.querySelectorAll('.content-block.selected').forEach(el => el.classList.remove('selected'));
        document.getElementById('properties-content').innerHTML = '<p class="no-selection">Select an element to edit its properties.</p>';
    }

    showBlockProperties(index) {
        const block = this.currentNewsletter.content[index];
        if (!block) return;
        const panel = document.getElementById('properties-content');
        let formHtml = `<div class="property-group"><h4>${this.capitalizeFirst(block.type)} Properties</h4></div>`;

        Object.keys(block.content).forEach(key => {
            const value = block.content[key];
            if (typeof value === 'object' && value !== null) return;
            formHtml += `<div class="property-group">
                <label for="prop-${key}">${this.capitalizeFirst(key)}</label>`;
            if (key.includes('Color')) {
                formHtml += `<input type="color" id="prop-${key}" value="${value}">`;
            } else if (key === 'text' && value.length > 50) {
                 formHtml += `<textarea id="prop-${key}" rows="4">${value}</textarea>`;
            } else {
                 formHtml += `<input type="text" id="prop-${key}" value="${value}">`;
            }
            formHtml += `</div>`;
        });

        panel.innerHTML = formHtml;
        panel.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateBlockProperty(index, e.target.id.replace('prop-', ''), e.target.value);
            });
        });
    }

    updateBlockProperty(index, key, value) {
        if (this.currentNewsletter.content[index]) {
            this.currentNewsletter.content[index].content[key] = value;
            this.updatePreview();
            this.saveToHistory();
        }
    }
    
    deleteBlock(index) {
        this.currentNewsletter.content.splice(index, 1);
        this.deselectBlock();
        this.updatePreview();
        this.saveToHistory();
    }
    
    saveToHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.parse(JSON.stringify(this.currentNewsletter)));
        this.historyIndex = this.history.length - 1;
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentNewsletter = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.updatePreview();
            this.deselectBlock();
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentNewsletter = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.updatePreview();
            this.deselectBlock();
            this.updateUndoRedoButtons();
        }
    }

    updateUndoRedoButtons() {
        document.getElementById('undo-btn').disabled = this.historyIndex <= 0;
        document.getElementById('redo-btn').disabled = this.historyIndex >= this.history.length - 1;
    }
    
    clearNewsletter() {
        if (confirm('Are you sure you want to clear the entire newsletter?')) {
            this.currentNewsletter.content = [];
            this.deselectBlock();
            this.updatePreview();
            this.saveToHistory();
        }
    }
    
    // --- FEATURES ---
    runSpamCheck() {
        const reportModal = document.getElementById('spam-report-modal');
        const reportContent = document.getElementById('spam-report-content');
        let issues = [];
        this.currentNewsletter.content.forEach(block => {
            if (block.type.includes('image') && !block.content.alt) {
                issues.push('<li>An image is missing alt text. This hurts accessibility and can increase spam scores.</li>');
            }
        });
        if (!JSON.stringify(this.currentNewsletter.content).includes('unsubscribe')) {
            issues.push('<li>Your newsletter is missing an unsubscribe link. This is required by CAN-SPAM law.</li>');
        }
        const spamWords = ['free', 'viagra', 'win', '$$$', 'act now'];
        const textContent = this.currentNewsletter.content.map(b => b.content.text || b.content.title || '').join(' ').toLowerCase();
        spamWords.forEach(word => {
            if (textContent.includes(word)) {
                issues.push(`<li>The word "<strong>${word}</strong>" can sometimes trigger spam filters.</li>`);
            }
        });
        if (issues.length === 0) {
            reportContent.innerHTML = '<h4><i class="fas fa-check-circle" style="color: green;"></i> Looks good!</h4><p>No major issues found.</p>';
        } else {
            reportContent.innerHTML = '<h4><i class="fas fa-exclamation-triangle" style="color: orange;"></i> Potential Issues Found:</h4><ul>' + issues.join('') + '</ul>';
        }
        reportModal.style.display = 'block';
    }

    showPreview() {
        document.getElementById('preview-modal').style.display = 'block';
        this.switchPreviewTab(document.querySelector('.preview-tabs .tab-btn.active'));
    }

    switchPreviewTab(activeBtn) {
        document.querySelectorAll('.preview-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        const mode = activeBtn.dataset.tab;
        const previewContent = document.getElementById('preview-content');
        const { html } = newsletterExporter.generateEmailHTML(this.currentNewsletter, { raw: true });
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        previewContent.innerHTML = '';
        previewContent.appendChild(iframe);
        iframe.srcdoc = mode === 'dark' ? `<style>body { background-color: #121212; color: #ffffff; }</style>${html}` : html;
        previewContent.className = 'preview-content';
        if (mode === 'mobile') previewContent.classList.add('mobile-preview');
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize the builder
document.addEventListener('DOMContentLoaded', () => {
    window.newsletterBuilder = new NewsletterBuilder();
});
