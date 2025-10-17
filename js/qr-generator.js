// QR Code Generator & Styling

const QRGenerator = {
    canvas: null,
    qrCodeInstance: null,
    
    // Calculate color contrast ratio (WCAG standard)
    getContrast(color1, color2) {
        const getLuminance = (hex) => {
            const rgb = parseInt(hex.slice(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;
            
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };
        
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        
        return (lighter + 0.05) / (darker + 0.05);
    },
    
    async generate(data, options = {}) {
        const qrContainer = document.getElementById('qrcode');
        if (!qrContainer) return;
        
        qrContainer.innerHTML = '';
        
        if (!data) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // DEBUG: Log data to console
        console.log('QR Data:', data);
        console.log('Data type:', typeof data);
        console.log('Data length:', data.length);

        const {
            colorDark = '#000000',
            colorLight = '#ffffff',
            hasLogo = false,
            hasText = false,
            correctLevel = QRCode.CorrectLevel.M,
        } = options;
        
        // Validate color contrast
        const contrast = this.getContrast(colorDark, colorLight);
        console.log('Color contrast ratio:', contrast.toFixed(2));
        
        if (contrast < 4.5) {
            console.warn('⚠️ Low contrast! May affect scanability. Recommended: 4.5+');
        }
        
        try {
            // Step 1: Generate base QR code with user colors
            this.qrCodeInstance = new QRCode(qrContainer, {
                text: String(data),
                width: 300,
                height: 300,
                colorDark: colorDark,
                colorLight: colorLight,
                // Use High error correction if adding logo/text
                correctLevel: (hasLogo || hasText) ? QRCode.CorrectLevel.H : correctLevel,
            });

            await this.waitForRender();
            
            // Step 2: Add logo/text if needed (with careful sizing)
            if (hasLogo || hasText) {
                console.log('Adding customizations...');
                await this.waitForRender();
                this.addCustomizations();
            }

            document.getElementById('downloadSection').classList.remove('hidden');
        } catch (error) {
            alert('Dữ liệu quá dài! Vui lòng rút ngắn nội dung.');
            console.error(error);
        }
    },
    
    waitForRender() {
        return new Promise(resolve => setTimeout(resolve, 300));
    },
    
    addCustomizations() {
        const qrCanvas = document.querySelector('#qrcode canvas');
        const qrImg = document.querySelector('#qrcode img');
        
        if (!qrCanvas || !qrImg) {
            setTimeout(() => this.addCustomizations(), 200);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = qrCanvas.width;
        canvas.height = qrCanvas.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(qrCanvas, 0, 0);
        
        const centerOption = document.querySelector('input[name="centerOption"]:checked')?.value;
        const logoFile = document.getElementById('logoFile')?.files[0];
        const centerText = document.getElementById('centerText')?.value;
        const textColor = document.getElementById('centerTextColor')?.value;
        
        if (centerOption === 'logo' && logoFile) {
            const logo = new Image();
            logo.onload = () => {
                // SAFE SIZE: 20% of QR (was 25%) - less coverage = better scanability
                const logoSize = canvas.width * 0.20;
                const x = (canvas.width - logoSize) / 2;
                const y = (canvas.height - logoSize) / 2;
                const padding = 10; // Increased padding for better readability
                
                // White background with slight border
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2);
                
                // Optional: Add border for better visibility
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 2;
                ctx.strokeRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2);
                
                ctx.drawImage(logo, x, y, logoSize, logoSize);
                
                qrImg.src = canvas.toDataURL();
                console.log('✓ Logo added - size: 20%');
            };
            logo.onerror = () => {
                console.error('Failed to load logo');
                alert('Không thể tải logo. Vui lòng thử file khác.');
            };
            logo.src = URL.createObjectURL(logoFile);
        } else if (centerOption === 'text' && centerText) {
            // SAFE SIZE: 18% of QR for text
            const size = canvas.width * 0.18;
            const x = (canvas.width - size) / 2;
            const y = (canvas.height - size) / 2;
            const padding = 10;
            
            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - padding, y - padding, size + padding * 2, size + padding * 2);
            
            // Border
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - padding, y - padding, size + padding * 2, size + padding * 2);
            
            // Text (smaller font)
            ctx.fillStyle = textColor || '#000000';
            ctx.font = 'bold 16px Arial'; // Reduced from 18px
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Truncate text if too long
            const maxLength = 10;
            const displayText = centerText.length > maxLength ? centerText.substring(0, maxLength) + '...' : centerText;
            ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
            
            qrImg.src = canvas.toDataURL();
            console.log('✓ Text added - size: 18%');
        }
    },
    
    download(format = 'png') {
        const canvas = document.querySelector('#qrcode canvas');
        const img = document.querySelector('#qrcode img');
        
        if (!canvas || !img) return;
        
        if (format === 'png') {
            const a = document.createElement('a');
            a.href = img.src;
            a.download = 'qrcode.png';
            a.click();
        } else if (format === 'svg') {
            const svgData = this.canvasToSVG(canvas);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qrcode.svg';
            a.click();
            URL.revokeObjectURL(url);
        } else if (format === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = 80;
            const imgHeight = 80;
            const x = (pageWidth - imgWidth) / 2;
            const y = 20;
            
            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save('qrcode.pdf');
        }
    },
    
    canvasToSVG(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const cellSize = canvas.width / 33;
        
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">`;
        svgContent += `<rect width="100%" height="100%" fill="${document.getElementById('qrColorLight')?.value || '#ffffff'}"/>`;
        
        const style = document.getElementById('qrStyle')?.value || 'square';
        const colorDark = document.getElementById('qrColorDark')?.value || '#000000';
        
        for (let y = 0; y < 33; y++) {
            for (let x = 0; x < 33; x++) {
                const px = Math.floor(x * cellSize + cellSize / 2);
                const py = Math.floor(y * cellSize + cellSize / 2);
                const idx = (py * canvas.width + px) * 4;
                
                if (data[idx] < 128) {
                    const posX = x * cellSize;
                    const posY = y * cellSize;
                    
                    if (style === 'dots') {
                        svgContent += `<circle cx="${posX + cellSize / 2}" cy="${posY + cellSize / 2}" r="${cellSize / 2.5}" fill="${colorDark}"/>`;
                    } else if (style === 'rounded') {
                        const radius = cellSize / 4;
                        const rectX = posX + cellSize / 6;
                        const rectY = posY + cellSize / 6;
                        const rectW = cellSize * 0.67;
                        const rectH = cellSize * 0.67;
                        svgContent += `<rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" rx="${radius}" ry="${radius}" fill="${colorDark}"/>`;
                    } else {
                        svgContent += `<rect x="${posX}" y="${posY}" width="${cellSize}" height="${cellSize}" fill="${colorDark}"/>`;
                    }
                }
            }
        }
        
        svgContent += '</svg>';
        return svgContent;
    },
};

export { QRGenerator };
