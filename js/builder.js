class NewsletterBuilder {
    constructor() {
        this.currentNewsletter = {
            title: 'My Newsletter',
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
        this.updatePreview();
        this.saveToHistory();
    }

    bindEvents() {
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectTemplate(e.currentTarget.dataset.template));
        });

        document.querySelectorAll('.block-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addContentBlock(e.currentTarget.dataset.block));
        });

        document.getElementById('preview-btn').addEventListener('click', () => this.showPreview());
        document.getElementById('export-btn').addEventListener('click', () => newsletterExporter.exportNewsletter(this.currentNewsletter));
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearNewsletter());
        document.getElementById('spam-check-btn').addEventListener('click', () => this.runSpamCheck());

        document.querySelectorAll('.modal .close-btn').forEach(btn => btn.addEventListener('click', (e) => this.closeModal(e.currentTarget.closest('.modal'))));
        document.getElementById('preview-modal').addEventListener('click', (e) => e.target.id === 'preview-modal' && this.closeModal(e.target));
        document.getElementById('spam-report-modal').addEventListener('click', (e) => e.target.id === 'spam-report-modal' && this.closeModal(e.target));

        document.querySelectorAll('.preview-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPreviewTab(e.currentTarget));
        });
    }

    selectTemplate(templateName) {
        if (!EmailTemplates[templateName]) return;
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        document.querySelector(`[data-template="${templateName}"]`).classList.add('active');
        this.currentNewsletter.content = JSON.parse(JSON.stringify(EmailTemplates[templateName].structure));
        this.updatePreview();
        this.saveToHistory();
    }

    addContentBlock(blockType) {
        const newBlock = this.createContentBlock(blockType);
        this.currentNewsletter.content.push(newBlock);
        this.updatePreview();
        this.saveToHistory();
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
            canvas.innerHTML = `<div class="empty-state">...</div>`; // Keep your empty state
            return;
        }
        this.currentNewsletter.content.forEach((block, index) => {
            const blockHtml = (TemplateRenderer[`render${this.capitalizeFirst(block.type)}`] || (() => ''))(block.content);
            const wrapper = document.createElement('div');
            wrapper.className = 'content-block';
            wrapper.dataset.blockIndex = index;
            wrapper.innerHTML = `
                <div class="block-controls">
                    <button class="control-btn move-up" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                    <button class="control-btn move-down" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                    <button class="control-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
                ${blockHtml}
            `;
            canvas.appendChild(wrapper);
        });
        this.bindBlockEvents();
    }

    bindBlockEvents() {
        document.querySelectorAll('.content-block').forEach(blockEl => {
            blockEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectBlock(parseInt(e.currentTarget.dataset.blockIndex));
            });
            blockEl.querySelector('.delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBlock(parseInt(blockEl.dataset.blockIndex));
            });
             blockEl.querySelector('.move-up').addEventListener('click', (e) => {
                e.stopPropagation();
                this.moveBlock(parseInt(blockEl.dataset.blockIndex), 'up');
            });
            blockEl.querySelector('.move-down').addEventListener('click', (e) => {
                e.stopPropagation();
                this.moveBlock(parseInt(blockEl.dataset.blockIndex), 'down');
            });
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.content-block') && !e.target.closest('.properties-panel')) {
                this.deselectBlock();
            }
        });
    }

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
        const panel = document.getElementById('properties-content');
        let formHtml = `<div class="property-group"><h4>${this.capitalizeFirst(block.type)} Properties</h4></div>`;

        Object.keys(block.content).forEach(key => {
            const value = block.content[key];
            if (key === 'images' || key === 'links') return; // Handled separately
            formHtml += `<div class="property-group">
                <label for="prop-${key}">${this.capitalizeFirst(key)}</label>`;
            if (key.includes('Color')) {
                formHtml += `<input type="color" id="prop-${key}" value="${value}">`;
            } else if (typeof value === 'string' && value.length > 50) {
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
    
    moveBlock(index, direction) {
        const content = this.currentNewsletter.content;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < content.length) {
            [content[index], content[newIndex]] = [content[newIndex], content[index]];
            this.updatePreview();
            this.saveToHistory();
            this.selectBlock(newIndex);
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
    
    runSpamCheck() {
        const reportModal = document.getElementById('spam-report-modal');
        const reportContent = document.getElementById('spam-report-content');
        let issues = [];
        
        // 1. Check for missing alt text
        this.currentNewsletter.content.forEach(block => {
            if (block.type.includes('image') && !block.content.alt) {
                issues.push('<li>An image is missing alt text. This hurts accessibility and can increase spam scores.</li>');
            }
        });

        // 2. Check for an unsubscribe link
        const hasUnsubscribe = JSON.stringify(this.currentNewsletter.content).includes('unsubscribe');
        if (!hasUnsubscribe) {
            issues.push('<li>Your newsletter is missing an unsubscribe link. This is required by CAN-SPAM law.</li>');
        }

        // 3. Simple check for spammy words
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
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        previewContent.innerHTML = '';
        previewContent.appendChild(iframe);
        
        let iframeContent = html;
        if (mode === 'dark') {
            iframeContent = `<style>body { background-color: #121212; color: #ffffff; }</style>${html}`;
        }
        
        iframe.srcdoc = iframeContent;
        previewContent.className = 'preview-content'; // reset class
        if (mode === 'mobile') {
            previewContent.classList.add('mobile-preview');
        }
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
