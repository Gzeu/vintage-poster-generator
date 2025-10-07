// Vintage Travel Poster Generator JavaScript with Image Generation

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
            this.showErrorMessage('A apărut o eroare la generarea posterelor. Încercați din nou.');
        } finally {
            this.hideLoadingState();
        }
    }
    
    showLoadingState() {
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Se generează posterele și imaginile... Te rog să aștepți.</p>
            </div>
        `;
    }
    
    hideLoadingState() {
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.remove();
        }
    }
    
    showErrorMessage(message) {
        const posterCardsContainer = document.getElementById('posterCards');
        posterCardsContainer.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Eroare</h3>
                <p>${message}</p>
            </div>
        `;
    }
    
    async generatePosterVariations(formData) {
        const colors = formData.colorScheme === 'custom' ? formData.customColors : formData.colorScheme;
        
        // Generate multiple variations using pollination approach
        const variations = [
            {
                type: "Original Style",
                destination: formData.destination,
                colors: colors,
                posterText: formData.posterText,
                perspective: formData.perspective
            },
            {
                type: "Alternative Perspective",
                destination: formData.destination,
                colors: colors,
                posterText: formData.posterText,
                perspective: this.getAlternativePerspective(formData.perspective)
            },
            {
                type: "Color Variation",
                destination: formData.destination,
                colors: this.getComplementaryColors(colors),
                posterText: formData.posterText,
                perspective: formData.perspective
            },
            {
                type: "Enhanced Details",
                destination: `${formData.destination} with intricate architectural details`,
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
            await new Promise(resolve => setTimeout(resolve, i * 500));
            
            if (formData.generateImages) {
                await this.createPosterCardWithImage(variation, i, formData);
            } else {
                this.createPosterCard(variation, i);
            }
        }
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
            this.updateCardWithError(card, 'Nu s-a putut genera imaginea');
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
                    variationType = 'Original';
                    break;
                case 1:
                    // Add texture variation
                    modifiedPrompt = modifiedPrompt.replace('subtle texture overlay', 'rich paper texture with vintage grain');
                    variationType = 'Textured';
                    break;
                case 2:
                    // Add lighting variation
                    modifiedPrompt = modifiedPrompt.replace('stylized clouds and sun rays', 'dramatic lighting with golden hour atmosphere');
                    variationType = 'Golden Hour';
                    break;
                case 3:
                    // Add composition variation
                    modifiedPrompt = modifiedPrompt.replace('clean composition', 'dynamic composition with diagonal elements');
                    variationType = 'Dynamic';
                    break;
                default:
                    // Additional style variations
                    const styleModifiers = [
                        'with enhanced contrast',
                        'with softer color gradients',
                        'with bold geometric patterns',
                        'with minimalist approach'
                    ];
                    modifiedPrompt += ` ${styleModifiers[i % styleModifiers.length]}`;
                    variationType = `Variation ${i + 1}`;
                    break;
            }
            
            try {
                const imageData = await this.imageGenerator.generateImage(modifiedPrompt, data.posterText);
                variations.push({
                    type: variationType,
                    imageData: imageData,
                    prompt: modifiedPrompt
                });
            } catch (error) {
                console.error(`Error generating variation ${i + 1}:`, error);
                variations.push({
                    type: variationType,
                    error: 'Nu s-a putut genera imaginea',
                    prompt: modifiedPrompt
                });
            }
            
            // Add delay between API calls to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
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
                        <p>❌ ${variation.error}</p>
                        <small>${variation.type}</small>
                    </div>
                `;
            } else {
                imageDiv.innerHTML = `
                    <div class="image-wrapper">
                        <img src="${variation.imageData.url}" alt="${variation.type} poster" loading="lazy">
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
        imageContainer.classList.add('images-loaded');
    }
    
    updateCardWithError(card, errorMessage) {
        const imageContainer = card.querySelector('.image-container');
        imageContainer.innerHTML = `
            <div class="image-placeholder error">
                <p>❌ ${errorMessage}</p>
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
                    <p>Se generează imaginea...</p>
                </div>
            </div>
        ` : '';
        
        card.innerHTML = `
            <h3>${data.type}</h3>
            ${imageSection}
            <div class="poster-details">
                <p><strong>Destination:</strong> ${data.destination}</p>
                <p><strong>Colors:</strong> ${data.colors}</p>
                <p><strong>Text:</strong> ${data.posterText}</p>
                <p><strong>Style:</strong> ${data.perspective}</p>
                ${this.createColorPalette(data.colors)}
            </div>
            <div class="poster-prompt">
                <button class="copy-button" onclick="copyToClipboard('prompt-${index}')">Copy</button>
                <code id="prompt-${index}">${prompt}</code>
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
            'ice blue, pine green, snow white, and charcoal'
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
                <h3>${template.name}</h3>
                <div class="template-preview">
                    <p><strong>Destination:</strong> ${template.destination}</p>
                    <p><strong>Text:</strong> ${template.posterText}</p>
                </div>
                ${this.createColorPalette(template.colors)}
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
        } else {
            colorSelect.value = 'custom';
            document.getElementById('customColors').value = template.colors;
            document.getElementById('customColorGroup').style.display = 'block';
        }
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// Image Generator API Class
class ImageGeneratorAPI {
    constructor() {
        // This would typically use an actual image generation API
        // For demo purposes, we'll simulate with placeholder images
        this.apiEndpoint = 'https://api.placeholder.com'; // Replace with actual API
    }
    
    async generateImage(prompt, posterText) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        
        // For demo purposes, return placeholder images
        // In production, this would call an actual AI image generation API
        const colors = ['4A90E2', 'F5A623', 'D0021B', '7ED321', 'BD10E0'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        return {
            url: `https://via.placeholder.com/400x600/${randomColor}/FFFFFF?text=${encodeURIComponent(posterText)}`,
            width: 400,
            height: 600,
            prompt: prompt
        };
    }
}

// Utility functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const button = element.parentNode.querySelector('.copy-button');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#48bb78';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#667eea';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const button = element.parentNode.querySelector('.copy-button');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}

function downloadImage(imageUrl, filename) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VintagePosterGenerator();
});