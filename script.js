// Vintage Travel Poster Generator JavaScript

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
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            destination: document.getElementById('destination').value,
            colorScheme: document.getElementById('colorScheme').value,
            customColors: document.getElementById('customColors').value,
            posterText: document.getElementById('destinationName').value,
            perspective: document.getElementById('style').value
        };
        
        this.generatePosterVariations(formData);
    }
    
    generatePosterVariations(formData) {
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
        variations.forEach((variation, index) => {
            setTimeout(() => {
                this.createPosterCard(variation, index);
            }, index * 200); // Stagger the animations
        });
    }
    
    createPosterCard(data, index) {
        const prompt = this.generatePrompt(data);
        const card = this.createCardElement(data, prompt, index);
        
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
    
    createCardElement(data, prompt, index) {
        const card = document.createElement('div');
        card.className = 'poster-card new';
        
        card.innerHTML = `
            <h3>${data.type}</h3>
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VintagePosterGenerator();
});