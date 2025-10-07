// Vintage Travel Poster Generator with Sequential Pollinations.ai Integration

class VintagePosterGenerator {
    constructor() {
        this.basePrompt = 'Create a vintage travel poster in mid-century modern style featuring [DESTINATION], with a bold color palette of [COLORS], geometric shapes and simplified forms, retro typography displaying "[POSTER_TEXT]" in classic sans-serif font, flat illustration style with subtle texture overlay, [PERSPECTIVE] emphasizing the iconic architecture or landscape, stylized clouds and sun rays, decorative border frame, nostalgic 1960s aesthetic, vector-style artwork, clean composition, professional poster design, aspect ratio 2:3';
        
        this.templates = [
            {
                name: "Paris Elegance",
                destination: "Eiffel Tower at golden sunset with Parisian rooftops",
                colors: "coral pink, turquoise, mustard yellow, and cream",
                posterText: "PARIS",
                perspective: "dramatic perspective"
            },
            {
                name: "Santorini Dreams", 
                destination: "white-washed Greek buildings with blue domes overlooking the Aegean Sea",
                colors: "sunset orange, deep teal, golden yellow, and ivory",
                posterText: "SANTORINI",
                perspective: "panoramic landscape"
            },
            {
                name: "Tokyo Modern",
                destination: "Mount Fuji with cherry blossoms and Tokyo skyline silhouette",
                colors: "sage green, burnt orange, navy blue, and beige",
                posterText: "TOKYO", 
                perspective: "dramatic perspective with mountain backdrop"
            },
            {
                name: "New York Energy",
                destination: "Manhattan Art Deco skyline with Empire State Building",
                colors: "burgundy, forest green, gold, and off-white",
                posterText: "NEW YORK",
                perspective: "bird's eye view of urban canyon"
            },
            {
                name: "Tuscany Countryside",
                destination: "rolling Tuscan hills with cypress trees and vineyard",
                colors: "dusty rose, mint green, warm gray, and cream", 
                posterText: "TUSCANY",
                perspective: "sweeping panoramic landscape"
            },
            {
                name: "Swiss Alps Adventure",
                destination: "snow-capped Alpine peaks with vintage cable car",
                colors: "dusty rose, mint green, warm gray, and cream",
                posterText: "SWISS ALPS",
                perspective: "dramatic mountain perspective"
            }
        ];
        
        this.isGenerating = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderTemplates();
        this.setupColorSchemeHandler();
    }
    
    setupEventListeners() {
        const form = document.getElementById('posterForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    setupColorSchemeHandler() {
        const colorSchemeSelect = document.getElementById('colorScheme');
        const customColorGroup = document.getElementById('customColorGroup');
        
        colorSchemeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customColorGroup.style.display = 'block';
            } else {
                customColorGroup.style.display = 'none';
            }
        });
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isGenerating) {
            return;
        }
        
        const formData = {
            destination: document.getElementById('destination').value.trim(),
            colorScheme: document.getElementById('colorScheme').value,
            customColors: document.getElementById('customColors')?.value.trim(),
            posterText: document.getElementById('destinationName').value.trim(),
            perspective: document.getElementById('style').value,
            generateImages: document.getElementById('generateImages')?.checked || false
        };
        
        // Validation
        if (!formData.destination || !formData.posterText) {
            this.showError('Te rog completează toate câmpurile obligatorii!');
            return;
        }
        
        this.isGenerating = true;
        this.showLoadingState();
        
        try {
            await this.generatePosters(formData);
        } catch (error) {
            console.error('Error generating posters:', error);
            this.showError('A apărut o eroare la generarea posterelor. Te rog încearcă din nou.');
        } finally {
            this.isGenerating = false;
            this.hideLoadingState();
        }
    }
    
    showLoadingState() {
        const btn = document.querySelector('.generate-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <h3>🎨 Se generează posterele...</h3>
                <p>Folosim Pollinations.ai pentru a crea 4 variații secvențial</p>
                <small>Aceasta poate dura 1-2 minute pentru toate imaginile</small>
            </div>
        `;
    }
    
    hideLoadingState() {
        const btn = document.querySelector('.generate-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
    
    showError(message) {
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Eroare</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">🔄 Încearcă din nou</button>
            </div>
        `;
    }
    
    async generatePosters(formData) {
        const colors = formData.colorScheme === 'custom' ? formData.customColors : formData.colorScheme;
        
        // Generate 4 variations with different approaches
        const variations = [
            {
                type: "🎯 Originală",
                destination: formData.destination,
                colors: colors,
                posterText: formData.posterText,
                perspective: formData.perspective
            },
            {
                type: "🔄 Perspectivă Alternativă",
                destination: formData.destination,
                colors: colors,
                posterText: formData.posterText,
                perspective: this.getAlternativePerspective(formData.perspective)
            },
            {
                type: "🎨 Variație de Culori",
                destination: formData.destination,
                colors: this.getComplementaryColors(colors),
                posterText: formData.posterText,
                perspective: formData.perspective
            },
            {
                type: "✨ Detalii Îmbunătățite",
                destination: `${formData.destination} with intricate architectural details and enhanced lighting`,
                colors: colors,
                posterText: formData.posterText,
                perspective: "close-up architectural detail"
            }
        ];
        
        // Clear previous results and setup grid
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.innerHTML = '<div class="posters-grid"></div>';
        const postersGrid = posterCardsContainer.querySelector('.posters-grid');
        
        // Create cards for each variation
        variations.forEach((variation, index) => {
            const card = this.createPosterCard(variation, index);
            postersGrid.appendChild(card);
        });
        
        if (formData.generateImages) {
            // Generate images SEQUENTIALLY to avoid rate limiting
            for (let i = 0; i < variations.length; i++) {
                await this.generateImageForCard(variations[i], i);
                // Add a small delay between generations
                if (i < variations.length - 1) {
                    await this.delay(1000);
                }
            }
        }
        
        this.showSuccessMessage(variations.length, formData.generateImages);
    }
    
    createPosterCard(data, index) {
        const prompt = this.generatePrompt(data);
        const card = document.createElement('div');
        card.className = 'poster-card';
        card.innerHTML = `
            <h3>${data.type}</h3>
            
            <div class="image-section" id="image-section-${index}">
                <div class="image-wrapper">
                    <div class="image-loader" id="loader-${index}">
                        <div class="spinner"></div>
                        <p>Se generează imaginea...</p>
                        <small>Pollinations.ai</small>
                    </div>
                    <img id="image-${index}" class="generated-poster" style="display:none;" alt="Poster pentru ${data.posterText}">
                    <div class="image-actions" id="actions-${index}" style="display:none;">
                        <button class="action-btn download-btn" id="download-${index}">
                            ⬇️ Descarcă
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="poster-details">
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>🏛️ Destinația:</strong> ${this.escapeHtml(data.destination)}
                    </div>
                    <div class="detail-item">
                        <strong>🎨 Culorile:</strong> ${this.escapeHtml(data.colors)}
                    </div>
                    <div class="detail-item">
                        <strong>📝 Textul:</strong> ${this.escapeHtml(data.posterText)}
                    </div>
                    <div class="detail-item">
                        <strong>👁️ Perspectiva:</strong> ${this.escapeHtml(data.perspective)}
                    </div>
                </div>
                ${this.createColorPalette(data.colors)}
            </div>
            
            <div class="prompt-section">
                <h4>📋 Prompt-ul Generat</h4>
                <div class="prompt-box">
                    <button class="copy-btn" onclick="copyToClipboard('prompt-${index}')" title="Copiază prompt-ul">📋 Copiază</button>
                    <pre id="prompt-${index}">${this.escapeHtml(prompt)}</pre>
                </div>
                <div class="prompt-info">
                    <small>💡 <strong>Tip:</strong> Folosește acest prompt cu Midjourney, DALL-E, sau Stable Diffusion</small>
                </div>
            </div>
        `;
        
        return card;
    }
    
    async generateImageForCard(data, index) {
        try {
            const prompt = this.generatePrompt(data);
            const imageUrl = await this.generatePollinationsImage(prompt);
            
            const img = document.getElementById(`image-${index}`);
            const loader = document.getElementById(`loader-${index}`);
            const actions = document.getElementById(`actions-${index}`);
            const downloadBtn = document.getElementById(`download-${index}`);
            
            // Wait for actual image load
            await this.loadImage(imageUrl);
            
            img.src = imageUrl;
            img.style.display = 'block';
            loader.style.display = 'none';
            actions.style.display = 'flex';
            
            // Setup download button
            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = imageUrl;
                a.download = `${data.posterText.toLowerCase().replace(/\s+/g, '-')}-${index + 1}.jpg`;
                a.click();
            };
            
        } catch (error) {
            console.error(`Error generating image ${index + 1}:`, error);
            const loader = document.getElementById(`loader-${index}`);
            loader.innerHTML = `
                <div class="error-content">
                    <p>❌ Eroare la generare</p>
                    <small>Folosește prompt-ul pentru generare manuală</small>
                </div>
            `;
        }
    }
    
    async generatePollinationsImage(prompt) {
        const baseUrl = 'https://image.pollinations.ai/prompt/';
        const encodedPrompt = encodeURIComponent(prompt);
        
        const params = new URLSearchParams({
            width: '1024',
            height: '1536',
            model: 'flux',
            enhance: 'true',
            nologo: 'true',
            seed: Math.floor(Math.random() * 1000000),
            referrer: 'vintage-poster-generator'
        });
        
        return `${baseUrl}${encodedPrompt}?${params.toString()}`;
    }
    
    // Promise-based image loading to ensure sequential generation
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
            
            // Timeout after 30 seconds
            setTimeout(() => reject(new Error('Image load timeout')), 30000);
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    generatePrompt(data) {
        return this.basePrompt
            .replace('[DESTINATION]', data.destination)
            .replace('[COLORS]', data.colors)
            .replace('[POSTER_TEXT]', data.posterText)
            .replace('[PERSPECTIVE]', data.perspective);
    }
    
    getAlternativePerspective(current) {
        const perspectives = [
            'dramatic perspective',
            'bird\'s eye view',
            'close-up architectural detail',
            'panoramic landscape'
        ];
        
        const alternatives = perspectives.filter(p => p !== current);
        return alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    
    getComplementaryColors(originalColors) {
        const colorSets = [
            'burgundy, forest green, gold, and off-white',
            'dusty rose, mint green, warm gray, and cream',
            'sage green, burnt orange, navy blue, and beige',
            'sunset orange, deep teal, golden yellow, and ivory',
            'ice blue, pine green, snow white, and charcoal',
            'terracotta, sage green, cream, and charcoal'
        ];
        
        const alternatives = colorSets.filter(set => set !== originalColors);
        return alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    
    createColorPalette(colorString) {
        const colors = colorString.split(',').map(c => c.trim());
        const colorMap = {
            'coral pink': '#FF7F7F',
            'turquoise': '#40E0D0', 
            'mustard yellow': '#FFDB58',
            'cream': '#F5F5DC',
            'sunset orange': '#FF8C69',
            'deep teal': '#008B8B',
            'golden yellow': '#FFD700',
            'ivory': '#FFFFF0',
            'sage green': '#9CAF88',
            'burnt orange': '#CC5500',
            'navy blue': '#000080',
            'beige': '#F5F5DC',
            'burgundy': '#800020',
            'forest green': '#228B22',
            'gold': '#FFD700',
            'off-white': '#FAF0E6',
            'dusty rose': '#DCAE96',
            'mint green': '#98FB98',
            'warm gray': '#808080',
            'ice blue': '#B0E0E6',
            'pine green': '#01796F',
            'snow white': '#FFFAFA',
            'charcoal': '#36454F',
            'terracotta': '#E2725B'
        };
        
        let paletteHTML = '<div class="color-palette"><span class="palette-label">Paleta de culori:</span>';
        colors.forEach(color => {
            const hexColor = colorMap[color.toLowerCase()] || this.stringToColor(color);
            paletteHTML += `<div class="color-swatch" style="background-color: ${hexColor}" title="${color}"></div>`;
        });
        paletteHTML += '</div>';
        
        return paletteHTML;
    }
    
    stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = Math.abs(hash).toString(16).substring(0, 6);
        return '#' + '000000'.substring(0, 6 - color.length) + color;
    }
    
    showSuccessMessage(count, withImages) {
        const posterCardsContainer = document.getElementById('posterCards');
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <div class="success-content">
                <h3>🎉 Generat cu succes!</h3>
                <p>Am generat <strong>${count} variații</strong> ale posterului tău ${withImages ? 'cu imagini' : 'cu prompt-uri'}!</p>
                ${withImages ? '<small>Toate imaginile au fost generate secvențial pentru fiabilitate maximă.</small>' : '<small>Copiază prompt-urile și folosește-le cu serviciile AI preferate.</small>'}
            </div>
        `;
        
        posterCardsContainer.appendChild(successMsg);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.remove();
            }
        }, 8000);
    }
    
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    renderTemplates() {
        const templatesGrid = document.getElementById('templatesGrid');
        
        this.templates.forEach((template, index) => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.onclick = () => this.useTemplate(template);
            
            templateCard.innerHTML = `
                <div class="template-header">
                    <h3>🏛️ ${template.name}</h3>
                    <span class="template-badge">Template</span>
                </div>
                <div class="template-preview">
                    <p><strong>📍 Destinația:</strong> ${template.destination}</p>
                    <p><strong>📝 Text:</strong> "${template.posterText}"</p>
                    <p><strong>👁️ Stil:</strong> ${template.perspective}</p>
                </div>
                ${this.createColorPalette(template.colors)}
                <div class="template-action">
                    <small>👆 Click pentru a folosi acest template</small>
                </div>
            `;
            
            templatesGrid.appendChild(templateCard);
        });
    }
    
    useTemplate(template) {
        // Fill form with template data
        document.getElementById('destination').value = template.destination;
        document.getElementById('destinationName').value = template.posterText;
        document.getElementById('style').value = template.perspective;
        
        // Set color scheme
        const colorSelect = document.getElementById('colorScheme');
        const colorOptions = Array.from(colorSelect.options);
        const matchingOption = colorOptions.find(option => option.value === template.colors);
        
        if (matchingOption) {
            colorSelect.value = template.colors;
            document.getElementById('customColorGroup').style.display = 'none';
        } else {
            colorSelect.value = 'custom';
            document.getElementById('customColors').value = template.colors;
            document.getElementById('customColorGroup').style.display = 'block';
        }
        
        // Show feedback
        this.showTemplateSuccess(template.name);
        
        // Scroll to form smoothly
        document.querySelector('.form-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    showTemplateSuccess(templateName) {
        const existingMsg = document.querySelector('.template-success');
        if (existingMsg) existingMsg.remove();
        
        const successMsg = document.createElement('div');
        successMsg.className = 'template-success';
        successMsg.innerHTML = `✅ Template "${templateName}" încărcat cu succes!`;
        
        const formSection = document.querySelector('.form-section');
        formSection.insertBefore(successMsg, formSection.firstChild);
        
        setTimeout(() => successMsg.remove(), 4000);
    }
}

// Utility functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent || element.value;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('📋 Prompt copiat în clipboard!', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        showNotification('📋 Prompt copiat!', 'success');
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VintagePosterGenerator();
    
    console.log('🎨 Vintage Poster Generator încărcat cu succes!');
    console.log('🔗 Powered by Pollinations.ai cu generare secvențială');
});
