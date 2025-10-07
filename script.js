// Vintage Travel Poster Generator with Real Pollinations.ai Integration

class VintagePosterGenerator {
    constructor() {
        this.basePrompt = 'Create a vintage travel poster in mid-century modern style featuring [DESTINATION], with a bold color palette of [COLORS], geometric shapes and simplified forms, retro typography displaying "[POSTER_TEXT]" in classic sans-serif font, flat illustration style with subtle texture overlay, [PERSPECTIVE] emphasizing the iconic architecture or landscape, stylized clouds and sun rays, decorative border frame, nostalgic 1960s aesthetic, vector-style artwork, clean composition, professional poster design, aspect ratio 2:3';
        
        this.templates = [
            {
                name: "Paris Elegance",
                destination: "Eiffel Tower at golden sunset with Parisian rooftops",
                colors: "coral pink, turquoise, mustard yellow, and cream",
                posterText: "PARIS",
                perspective: "dramatic low angle perspective"
            },
            {
                name: "Santorini Dreams", 
                destination: "white-washed Greek buildings with blue domes overlooking the Aegean Sea",
                colors: "sunset orange, deep teal, golden yellow, and ivory",
                posterText: "SANTORINI",
                perspective: "panoramic coastal landscape"
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
                colors: "ice blue, pine green, snow white, and charcoal",
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
        this.setupImageGenerationToggle();
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
    
    setupImageGenerationToggle() {
        const toggleSwitch = document.getElementById('generateImages');
        if (toggleSwitch) {
            toggleSwitch.addEventListener('change', (e) => {
                const advancedOptions = document.getElementById('advancedOptions');
                if (e.target.checked) {
                    advancedOptions.style.display = 'block';
                } else {
                    advancedOptions.style.display = 'none';
                }
            });
        }
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isGenerating) {
            return; // Prevent multiple simultaneous generations
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
            await this.generatePoster(formData);
        } catch (error) {
            console.error('Error generating poster:', error);
            this.showError('A apărut o eroare la generarea posterului. Te rog încearcă din nou.');
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
                <h3>🎨 Se generează posterul...</h3>
                <p>Folosim Pollinations.ai pentru a crea posterul tău vintage</p>
                <small>Aceasta poate dura 10-30 de secunde</small>
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
    
    async generatePoster(formData) {
        const colors = formData.colorScheme === 'custom' ? formData.customColors : formData.colorScheme;
        
        // Generate ONE high-quality poster prompt
        const posterData = {
            destination: formData.destination,
            colors: colors,
            posterText: formData.posterText,
            perspective: formData.perspective
        };
        
        const prompt = this.generatePrompt(posterData);
        
        // Clear previous results
        const posterCardsContainer = document.getElementById('posterCards');
        
        if (formData.generateImages) {
            // Generate real image using Pollinations.ai
            const imageUrl = await this.generatePollinationsImage(prompt);
            posterCardsContainer.innerHTML = this.createImageCard(posterData, prompt, imageUrl);
        } else {
            // Show only prompt
            posterCardsContainer.innerHTML = this.createPromptCard(posterData, prompt);
        }
        
        // Show success message
        setTimeout(() => {
            this.showSuccessMessage(formData.generateImages);
        }, 1000);
    }
    
    async generatePollinationsImage(prompt) {
        try {
            // Construct Pollinations.ai URL following official documentation
            const baseUrl = 'https://image.pollinations.ai/prompt/';
            const encodedPrompt = encodeURIComponent(prompt);
            
            // Parameters for high-quality vintage poster
            const params = new URLSearchParams({
                width: '1024',        // Good quality
                height: '1536',       // 2:3 aspect ratio for posters
                model: 'flux',        // Best quality model
                enhance: 'true',      // Let AI enhance the prompt
                nologo: 'true',       // Remove logo if possible
                seed: Math.floor(Math.random() * 1000000), // Random seed for variety
                referrer: 'vintage-poster-generator'
            });
            
            const fullUrl = `${baseUrl}${encodedPrompt}?${params.toString()}`;
            
            console.log('Generated Pollinations URL:', fullUrl);
            return fullUrl;
            
        } catch (error) {
            console.error('Error creating Pollinations URL:', error);
            throw error;
        }
    }
    
    generatePrompt(data) {
        return this.basePrompt
            .replace('[DESTINATION]', data.destination)
            .replace('[COLORS]', data.colors)
            .replace('[POSTER_TEXT]', data.posterText)
            .replace('[PERSPECTIVE]', data.perspective);
    }
    
    createImageCard(data, prompt, imageUrl) {
        const safeText = this.escapeHtml(data.posterText);
        const safeDestination = this.escapeHtml(data.destination);
        const downloadFilename = `${safeText.toLowerCase().replace(/\s+/g, '-')}-poster`;
        
        return `
            <div class="poster-card main-poster">
                <h3>🎨 Posterul Tău Vintage</h3>
                
                <div class="image-section">
                    <div class="image-wrapper">
                        <div class="image-loader" id="imageLoader">
                            <div class="spinner"></div>
                            <p>Se încarcă posterul de la Pollinations.ai...</p>
                            <small>Timp estimat: 10-30 secunde</small>
                        </div>
                        
                        <img src="${imageUrl}" 
                             alt="Poster vintage pentru ${safeDestination}"
                             class="generated-poster"
                             onload="this.style.opacity='1'; document.getElementById('imageLoader').style.display='none'; document.querySelector('.image-actions').style.display='flex';"
                             onerror="document.getElementById('imageLoader').innerHTML='<div class=\"error\">❌ Imaginea nu s-a putut genera. Pollinations.ai este temporar indisponibil.</div>'; document.querySelector('.download-actions').style.display='block';">
                        
                        <div class="image-actions" style="display:none;">
                            <a href="${imageUrl}" target="_blank" download="${downloadFilename}.jpg" class="action-btn download-btn">
                                ⬇️ Descarcă Posterul
                            </a>
                            <button onclick="this.previousElementSibling.click()" class="action-btn secondary-btn">
                                🔗 Deschide în Tab Nou
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="poster-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>🏛️ Destinația:</strong> ${safeDestination}
                        </div>
                        <div class="detail-item">
                            <strong>🎨 Culorile:</strong> ${this.escapeHtml(data.colors)}
                        </div>
                        <div class="detail-item">
                            <strong>📝 Textul:</strong> ${safeText}
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
                        <button class="copy-btn" onclick="copyToClipboard('mainPrompt')" title="Copiază prompt-ul">📋 Copiază</button>
                        <pre id="mainPrompt">${this.escapeHtml(prompt)}</pre>
                    </div>
                    <div class="prompt-info">
                        <small>💡 <strong>Tip:</strong> Folosește acest prompt cu Midjourney (/imagine), DALL-E, sau Stable Diffusion pentru rezultate profesionale</small>
                    </div>
                </div>
                
                <div class="download-actions" style="display:none;">
                    <p>🎯 <strong>Prompt-ul este gata!</strong> Copiază-l și folosește-l cu serviciile AI preferate:</p>
                    <div class="service-links">
                        <a href="https://www.midjourney.com" target="_blank" class="service-btn midjourney">Midjourney</a>
                        <a href="https://openai.com/dall-e-3" target="_blank" class="service-btn dalle">DALL-E</a>
                        <a href="https://stability.ai" target="_blank" class="service-btn stable">Stable Diffusion</a>
                    </div>
                </div>
            </div>
        `;
    }
    
    createPromptCard(data, prompt) {
        const safeText = this.escapeHtml(data.posterText);
        const safeDestination = this.escapeHtml(data.destination);
        
        return `
            <div class="poster-card prompt-only">
                <h3>📝 Prompt-ul Posterului</h3>
                
                <div class="poster-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>🏛️ Destinația:</strong> ${safeDestination}
                        </div>
                        <div class="detail-item">
                            <strong>🎨 Culorile:</strong> ${this.escapeHtml(data.colors)}
                        </div>
                        <div class="detail-item">
                            <strong>📝 Textul:</strong> ${safeText}
                        </div>
                        <div class="detail-item">
                            <strong>👁️ Perspectiva:</strong> ${this.escapeHtml(data.perspective)}
                        </div>
                    </div>
                    ${this.createColorPalette(data.colors)}
                </div>
                
                <div class="prompt-section">
                    <div class="prompt-box">
                        <button class="copy-btn" onclick="copyToClipboard('promptOnly')" title="Copiază prompt-ul">📋 Copiază Prompt-ul</button>
                        <pre id="promptOnly">${this.escapeHtml(prompt)}</pre>
                    </div>
                </div>
                
                <div class="ai-services">
                    <h4>🤖 Folosește cu aceste servicii AI:</h4>
                    <div class="service-links">
                        <a href="https://www.midjourney.com" target="_blank" class="service-btn midjourney">🎨 Midjourney</a>
                        <a href="https://openai.com/dall-e-3" target="_blank" class="service-btn dalle">🖼️ DALL-E</a>
                        <a href="https://stability.ai" target="_blank" class="service-btn stable">⚡ Stable Diffusion</a>
                        <a href="https://leonardo.ai" target="_blank" class="service-btn leonardo">🖌️ Leonardo AI</a>
                    </div>
                </div>
            </div>
        `;
    }
    
    showSuccessMessage(withImage) {
        const posterCardsContainer = document.getElementById('posterCards');
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <div class="success-content">
                <h3>🎉 Generat cu succes!</h3>
                <p>Posterul tău vintage ${withImage ? 'și imaginea au fost generate' : 'a fost configurat'}!</p>
                ${withImage ? '<small>Imaginea poate dura câteva secunde să se încarce complet.</small>' : '<small>Copiază prompt-ul și folosește-l cu serviciile AI preferate.</small>'}
            </div>
        `;
        
        posterCardsContainer.appendChild(successMsg);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.remove();
            }
        }, 5000);
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
            'charcoal': '#36454F'
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
        // Find the copy button
        const button = element.parentNode.querySelector('.copy-btn');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '✅ Copiat!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 2000);
        }
        
        // Show global notification
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
    console.log('🔗 Powered by Pollinations.ai');
    
    // Add smooth loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
});