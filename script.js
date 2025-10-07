// Vintage Travel Poster Generator JavaScript with Enhanced Image Generation

class VintagePosterGenerator {
    constructor() {
        this.basePrompt = `Create a vintage travel poster in mid-century modern style featuring [DESTINATION], with a bold color palette of [COLORS], geometric shapes and simplified forms, retro typography displaying "[POSTER_TEXT]" in classic sans-serif font, flat illustration style with subtle texture overlay, [PERSPECTIVE] emphasizing the iconic architecture or landscape, stylized clouds and sun rays, decorative border frame, nostalgic 1960s aesthetic, vector-style artwork, clean composition, professional poster design, aspect ratio 2:3 perfect for printing --ar 2:3 --style raw --v 6`;
        
        this.templates = [
            {
                name: "Paris Elegance",
                destination: "Eiffel Tower at sunset",
                colors: "coral pink, turquoise, mustard yellow, and cream",
                posterText: "PARIS",
                perspective: "dramatic perspective"
            },
            {
                name: "Santorini Dreams",
                destination: "white-washed buildings overlooking the Aegean Sea",
                colors: "sunset orange, deep teal, golden yellow, and ivory",
                posterText: "SANTORINI",
                perspective: "panoramic landscape"
            },
            {
                name: "Tokyo Modern",
                destination: "Mount Fuji with cherry blossoms",
                colors: "sage green, burnt orange, navy blue, and beige",
                posterText: "TOKYO",
                perspective: "dramatic perspective"
            },
            {
                name: "New York Energy",
                destination: "Manhattan skyline",
                colors: "burgundy, forest green, gold, and off-white",
                posterText: "NEW YORK",
                perspective: "bird's eye view"
            },
            {
                name: "Tuscany Countryside",
                destination: "rolling hills with cypress trees",
                colors: "dusty rose, mint green, warm gray, and cream",
                posterText: "TUSCANY",
                perspective: "panoramic landscape"
            },
            {
                name: "Swiss Alps Adventure",
                destination: "snow-capped mountain peaks",
                colors: "ice blue, pine green, snow white, and charcoal",
                posterText: "SWISS ALPS",
                perspective: "dramatic perspective"
            }
        ];
        
        this.generatedCards = [];
        this.imageGenerator = new ImageGeneratorAPI();
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
        
        const formData = {
            destination: document.getElementById('destination').value,
            colorScheme: document.getElementById('colorScheme').value,
            customColors: document.getElementById('customColors').value,
            posterText: document.getElementById('destinationName').value,
            perspective: document.getElementById('style').value,
            generateImages: document.getElementById('generateImages')?.checked || false,
            imageCount: document.getElementById('imageCount')?.value || 2,
            imageStyle: document.getElementById('imageStyle')?.value || 'detailed'
        };
        
        // Show loading state
        this.showLoadingState();
        
        try {
            await this.generatePosterVariations(formData);
        } catch (error) {
            console.error('Error generating posters:', error);
            this.showErrorMessage('A apărut o eroare la generarea posterelor. Încearcați din nou.');
        } finally {
            this.hideLoadingState();
        }
    }
    
    showLoadingState() {
        const posterCardsContainer = document.getElementById('posterCards');
        const generateBtn = document.querySelector('.generate-btn');
        const btnText = generateBtn.querySelector('.btn-text');
        const btnLoader = generateBtn.querySelector('.btn-loader');
        
        posterCardsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>🎨 Se generează posterele și imaginile... Te rog să aștepți.</p>
                <small>Folosim metoda pollination pentru a crea multiple variații creative</small>
            </div>
        `;
        
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
    }
    
    hideLoadingState() {
        const loadingContainer = document.querySelector('.loading-container');
        const generateBtn = document.querySelector('.generate-btn');
        const btnText = generateBtn.querySelector('.btn-text');
        const btnLoader = generateBtn.querySelector('.btn-loader');
        
        if (loadingContainer) {
            loadingContainer.remove();
        }
        
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
    
    showErrorMessage(message) {
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Eroare</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">🔄 Încearcă din nou</button>
            </div>
        `;
    }
    
    async generatePosterVariations(formData) {
        const colors = formData.colorScheme === 'custom' ? formData.customColors : formData.colorScheme;
        
        // Generate multiple variations using pollination approach
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
        
        // Clear previous results
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.innerHTML = '';
        
        // Generate cards for each variation
        for (let i = 0; i < variations.length; i++) {
            const variation = variations[i];
            
            // Add delay for animation effect
            await new Promise(resolve => setTimeout(resolve, i * 300));
            
            if (formData.generateImages) {
                await this.createPosterCardWithImage(variation, i, formData);
            } else {
                this.createPosterCard(variation, i);
            }
        }
        
        // Show completion message
        this.showCompletionMessage(variations.length, formData.generateImages);
    }
    
    showCompletionMessage(count, withImages) {
        const posterCardsContainer = document.getElementById('posterCards');
        const completionDiv = document.createElement('div');
        completionDiv.className = 'completion-message';
        completionDiv.innerHTML = `
            <div class="completion-content">
                <h3>🎉 Generare completă!</h3>
                <p>Am generat <strong>${count} variații</strong> ale posterului tău ${withImages ? 'cu imagini' : 'cu prompt-uri'}.</p>
                <small>Folosește prompt-urile cu servicii AI cum ar fi Midjourney, DALL-E, sau Stable Diffusion pentru rezultate de înaltă calitate.</small>
            </div>
        `;
        posterCardsContainer.appendChild(completionDiv);
    }
    
    async createPosterCardWithImage(data, index, formData) {
        const prompt = this.generatePrompt(data);
        const card = this.createCardElement(data, prompt, index, true);
        
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.appendChild(card);
        
        // Generate image using pollination approach
        try {
            const imageVariations = await this.generateImageVariations(prompt, data, formData);
            this.updateCardWithImages(card, imageVariations, index);
        } catch (error) {
            console.error('Error generating image:', error);
            this.updateCardWithError(card, 'Nu s-a putut genera imaginea. Folosește prompt-ul pentru generare manuală.');
        }
        
        // Add to generated cards array
        this.generatedCards.push({ data, prompt });
    }
    
    async generateImageVariations(basePrompt, data, formData) {
        const imageCount = parseInt(formData.imageCount) || 2;
        const variations = [];
        
        // Create multiple image variations using different approaches
        for (let i = 0; i < imageCount; i++) {
            let modifiedPrompt = basePrompt;
            let variationType = '';
            
            switch (i) {
                case 0:
                    // Original style
                    variationType = '🎯 Originală';
                    break;
                case 1:
                    // Add texture variation
                    modifiedPrompt = modifiedPrompt.replace('subtle texture overlay', 'rich vintage paper texture with aged patina and grain');
                    variationType = '📜 Textură Vintage';
                    break;
                case 2:
                    // Add lighting variation
                    modifiedPrompt = modifiedPrompt.replace('stylized clouds and sun rays', 'dramatic golden hour lighting with warm atmospheric glow');
                    variationType = '🌅 Golden Hour';
                    break;
                case 3:
                    // Add composition variation
                    modifiedPrompt = modifiedPrompt.replace('clean composition', 'dynamic asymmetrical composition with bold geometric elements');
                    variationType = '⚡ Dinamică';
                    break;
                default:
                    // Additional style variations
                    const styleModifiers = [
                        'with enhanced vintage color grading',
                        'with softer watercolor gradients',
                        'with bold art deco patterns',
                        'with minimalist scandinavian approach'
                    ];
                    modifiedPrompt += ` ${styleModifiers[i % styleModifiers.length]}`;
                    variationType = `✨ Variația ${i + 1}`;
                    break;
            }
            
            try {
                const imageData = await this.imageGenerator.generateImage(modifiedPrompt, data.posterText, i);
                variations.push({
                    type: variationType,
                    imageData: imageData,
                    prompt: modifiedPrompt
                });
            } catch (error) {
                console.error(`Error generating variation ${i + 1}:`, error);
                variations.push({
                    type: variationType,
                    error: 'Generarea automată nu este disponibilă. Folosește prompt-ul pentru generare manuală.',
                    prompt: modifiedPrompt
                });
            }
            
            // Add delay between generations
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        return variations;
    }
    
    updateCardWithImages(card, imageVariations, index) {
        const imageContainer = card.querySelector('.image-container');
        imageContainer.innerHTML = '';
        
        imageVariations.forEach((variation, vIndex) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-variation';
            
            if (variation.error) {
                imageDiv.innerHTML = `
                    <div class="image-placeholder error">
                        <div class="error-content">
                            <p>🎨 ${variation.error}</p>
                            <small>${variation.type}</small>
                            <button class="copy-prompt-btn" onclick="copyToClipboard('variation-prompt-${index}-${vIndex}')">
                                📋 Copiază Prompt-ul
                            </button>
                            <textarea id="variation-prompt-${index}-${vIndex}" style="display:none;">${variation.prompt}</textarea>
                        </div>
                    </div>
                `;
            } else {
                imageDiv.innerHTML = `
                    <div class="image-wrapper">
                        <img src="${variation.imageData.url}" alt="${variation.type} poster" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\"image-error\\">❌ Imagine nu poate fi încărcată</div>'">
                        <div class="image-overlay">
                            <button class="download-btn" onclick="downloadImage('${variation.imageData.url}', 'poster-${index}-${vIndex}.png')">
                                ⬇️ Download
                            </button>
                            <span class="image-type">${variation.type}</span>
                        </div>
                    </div>
                `;
            }
            
            imageContainer.appendChild(imageDiv);
        });
        
        // Add animation
        setTimeout(() => {
            imageContainer.classList.add('images-loaded');
        }, 100);
    }
    
    updateCardWithError(card, errorMessage) {
        const imageContainer = card.querySelector('.image-container');
        imageContainer.innerHTML = `
            <div class="image-placeholder error">
                <div class="error-content">
                    <p>🎨 ${errorMessage}</p>
                    <small>Folosește prompt-ul de mai jos pentru a genera manual imaginea</small>
                </div>
            </div>
        `;
    }
    
    createPosterCard(data, index) {
        const prompt = this.generatePrompt(data);
        const card = this.createCardElement(data, prompt, index, false);
        
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.appendChild(card);
        
        // Add to generated cards array
        this.generatedCards.push({ data, prompt });
    }
    
    generatePrompt(data) {
        return this.basePrompt
            .replace('[DESTINATION]', data.destination)
            .replace('[COLORS]', data.colors)
            .replace('[POSTER_TEXT]', data.posterText)
            .replace('[PERSPECTIVE]', data.perspective);
    }
    
    createCardElement(data, prompt, index, withImages) {
        const card = document.createElement('div');
        card.className = 'poster-card new';
        
        const imageSection = withImages ? `
            <div class="image-container loading">
                <div class="image-placeholder">
                    <div class="loading-spinner"></div>
                    <p>🎨 Se generează imaginea...</p>
                    <small>Folosind metoda pollination</small>
                </div>
            </div>
        ` : '';
        
        card.innerHTML = `
            <h3>${data.type}</h3>
            ${imageSection}
            <div class="poster-details">
                <p><strong>🎯 Destinația:</strong> ${data.destination}</p>
                <p><strong>🎨 Culorile:</strong> ${data.colors}</p>
                <p><strong>📝 Textul:</strong> ${data.posterText}</p>
                <p><strong>👁️ Stilul:</strong> ${data.perspective}</p>
                ${this.createColorPalette(data.colors)}
            </div>
            <div class="poster-prompt">
                <button class="copy-button" onclick="copyToClipboard('prompt-${index}')">📋 Copiază</button>
                <code id="prompt-${index}">${prompt}</code>
            </div>
            <div class="ai-services-info">
                <small>💡 <strong>Folosește acest prompt cu:</strong> Midjourney, DALL-E, Stable Diffusion, Leonardo AI</small>
            </div>
        `;
        
        return card;
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
        
        let paletteHTML = '<div class="color-palette">';
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
            'terracotta, sage green, cream, and charcoal',
            'lavender, peach, mint green, and ivory'
        ];
        
        const alternatives = colorSets.filter(set => set !== originalColors);
        return alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    
    renderTemplates() {
        const templatesGrid = document.getElementById('templatesGrid');
        
        this.templates.forEach((template, index) => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.onclick = () => this.useTemplate(template);
            
            templateCard.innerHTML = `
                <h3>🏛️ ${template.name}</h3>
                <div class="template-preview">
                    <p><strong>📍 Destinația:</strong> ${template.destination}</p>
                    <p><strong>📝 Text:</strong> ${template.posterText}</p>
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
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'template-success';
        successMsg.innerHTML = `✅ Template "${template.name}" încărcat cu succes!`;
        document.querySelector('.form-section').prepend(successMsg);
        
        setTimeout(() => successMsg.remove(), 3000);
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// Enhanced Image Generator API Class
class ImageGeneratorAPI {
    constructor() {
        this.demoMode = true; // Set to false when you have real API keys
        this.apiEndpoint = 'demo'; // Replace with actual API endpoint
    }
    
    async generateImage(prompt, posterText, variationIndex = 0) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        if (this.demoMode) {
            // Generate better placeholder images with more realistic poster-like appearance
            const posterColors = ['e74c3c', '3498db', '2ecc71', 'f39c12', '9b59b6', '1abc9c'];
            const baseColor = posterColors[variationIndex % posterColors.length];
            
            // Create a more poster-like URL using a service that supports text and styling
            const cleanText = encodeURIComponent(posterText.substring(0, 20));
            
            // Using a better placeholder service or creating SVG data URL
            const svgPoster = this.createSVGPoster(posterText, baseColor, variationIndex);
            
            return {
                url: svgPoster,
                width: 400,
                height: 600,
                prompt: prompt
            };
        }
        
        // Here you would implement real API calls to services like:
        // - OpenAI DALL-E
        // - Stability AI
        // - Replicate
        // - Midjourney API (when available)
        
        throw new Error('API real nu este configurat încă');
    }
    
    createSVGPoster(text, color, variation) {
        const variations = [
            { bg: color, accent: 'ffffff', pattern: 'none' },
            { bg: color, accent: 'f8f9fa', pattern: 'dots' },
            { bg: color, accent: 'fff3cd', pattern: 'lines' },
            { bg: color, accent: 'e7f3ff', pattern: 'geometric' }
        ];
        
        const style = variations[variation % variations.length];
        const cleanText = text.substring(0, 15).toUpperCase();
        
        const svg = `
        <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad${variation}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#${style.bg};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#${style.bg}CC;stop-opacity:1" />
                </linearGradient>
                <filter id="shadow${variation}">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
            </defs>
            
            <!-- Background -->
            <rect width="400" height="600" fill="url(#grad${variation})"/>
            
            <!-- Pattern overlay -->
            ${style.pattern === 'dots' ? 
                '<circle cx="50" cy="50" r="3" fill="#ffffff20"/><circle cx="150" cy="100" r="3" fill="#ffffff20"/><circle cx="250" cy="150" r="3" fill="#ffffff20"/><circle cx="350" cy="200" r="3" fill="#ffffff20"/>' 
                : ''}
            ${style.pattern === 'lines' ? 
                '<line x1="0" y1="100" x2="400" y2="100" stroke="#ffffff15" stroke-width="2"/><line x1="0" y1="200" x2="400" y2="200" stroke="#ffffff15" stroke-width="2"/>' 
                : ''}
            
            <!-- Decorative elements -->
            <rect x="20" y="20" width="360" height="560" fill="none" stroke="#${style.accent}" stroke-width="2" rx="10"/>
            
            <!-- Title area -->
            <rect x="40" y="450" width="320" height="100" fill="#${style.accent}AA" rx="5"/>
            
            <!-- Main text -->
            <text x="200" y="510" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#${color}">${cleanText}</text>
            
            <!-- Subtitle -->
            <text x="200" y="530" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#${color}CC">VINTAGE TRAVEL POSTER</text>
            
            <!-- Decorative sun rays -->
            <g transform="translate(200,200)">
                <circle cx="0" cy="0" r="40" fill="#${style.accent}77"/>
                <line x1="-60" y1="0" x2="60" y2="0" stroke="#${style.accent}" stroke-width="2"/>
                <line x1="0" y1="-60" x2="0" y2="60" stroke="#${style.accent}" stroke-width="2"/>
                <line x1="-42" y1="-42" x2="42" y2="42" stroke="#${style.accent}" stroke-width="1"/>
                <line x1="42" y1="-42" x2="-42" y2="42" stroke="#${style.accent}" stroke-width="1"/>
            </g>
        </svg>`;
        
        // Convert SVG to data URL
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }
}

// Utility functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent || element.value;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const button = element.parentNode.querySelector('.copy-button, .copy-prompt-btn');
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Copiat!';
            button.style.background = '#48bb78';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const button = element.parentNode.querySelector('.copy-button, .copy-prompt-btn');
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Copiat!';
            
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }
    });
}

function downloadImage(imageUrl, filename) {
    try {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        link.target = '_blank';
        
        // For SVG data URLs, we need to handle them specially
        if (imageUrl.startsWith('data:image/svg+xml')) {
            // Convert SVG to PNG via canvas
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 400;
                canvas.height = 600;
                
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = filename.replace('.png', '_poster.png');
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(url);
                });
            };
            img.src = imageUrl;
        } else {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (error) {
        alert('Nu s-a putut descărca imaginea. Te rog să faci click dreapta și "Salvează imaginea ca..."');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VintagePosterGenerator();
    
    // Add some helpful tips
    console.log('🎨 Vintage Poster Generator încărcat!');
    console.log('💡 Tip: Pentru rezultate de înaltă calitate, folosește prompt-urile generate cu servicii AI profesionale.');
});