// QR Code Generator & Styling
import { LanguageManager } from './utils.js';

const QRGenerator = {
    canvas: null,
    qrCodeInstance: null,
    currentLogo: null,
    lastState: null,

    // Normalize hex (#rgb, #rrggbb, optional #), rgb()/rgba() → '#rrggbb'
    parseColor(input) {
        if (typeof input !== 'string') return null;
        const value = input.trim();
        if (!value) return null;

        const rgbMatch = value.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+\s*)?\)$/i);
        if (rgbMatch) {
            const channels = [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
            if (channels.some((c) => c > 255)) return null;
            return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
        }

        let hex = value.startsWith('#') ? value.slice(1) : value;
        if (!/^[0-9a-fA-F]+$/.test(hex)) return null;

        if (hex.length === 3) {
            hex = hex.split('').map((ch) => ch + ch).join('');
        } else if (hex.length === 8) {
            hex = hex.slice(0, 6);
        } else if (hex.length !== 6) {
            return null;
        }

        return `#${hex.toLowerCase()}`;
    },

    isIncompleteColor(input) {
        if (typeof input !== 'string') return true;
        const value = input.trim();
        if (!value) return true;
        if (/^rgba?\(/i.test(value) && !value.includes(')')) return true;
        const hex = value.startsWith('#') ? value.slice(1) : value;
        return /^[0-9a-fA-F]*$/.test(hex) && [0, 1, 2, 4, 5].includes(hex.length);
    },

    // Calculate color contrast ratio (WCAG standard)
    getContrast(color1, color2) {
        const getLuminance = (hex) => {
            const normalized = this.parseColor(hex) || '#000000';
            const rgb = parseInt(normalized.slice(1), 16);
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

    toErrorLevel(correctLevel) {
        if (correctLevel === 'H' || correctLevel === 2) return 'H';
        if (correctLevel === 'Q' || correctLevel === 3) return 'Q';
        if (correctLevel === 'L' || correctLevel === 1) return 'L';
        return 'M';
    },

    // qrcodejs 1.0.0 reuses its UTF-8 byte buffer, so CJK + ASCII
    // (e.g. "我 xx") overflows and shows a false "data too long" alert.
    buildModel(data, correctLevel) {
        if (typeof qrcode !== 'function') {
            throw new Error('QR encoder unavailable');
        }
        if (qrcode.stringToBytesFuncs?.['UTF-8']) {
            qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
        }

        const qr = qrcode(0, this.toErrorLevel(correctLevel));
        qr.addData(String(data), 'Byte');
        qr.make();

        const moduleCount = qr.getModuleCount();
        const modules = [];
        for (let row = 0; row < moduleCount; row++) {
            modules[row] = [];
            for (let col = 0; col < moduleCount; col++) {
                modules[row][col] = !!qr.isDark(row, col);
            }
        }
        return { moduleCount, modules, qr };
    },

    finderRole(row, col, moduleCount) {
        const origins = [
            [0, 0],
            [0, moduleCount - 7],
            [moduleCount - 7, 0],
        ];
        for (const [originRow, originCol] of origins) {
            const dr = row - originRow;
            const dc = col - originCol;
            if (dr < 0 || dr > 6 || dc < 0 || dc > 6) continue;
            if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return 'frame';
            if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return 'ball';
            return 'quiet';
        }
        return 'body';
    },

    createBodyGradient(ctx, size, options) {
        if (options.gradientType === 'radial') {
            const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            gradient.addColorStop(0, options.colorDark);
            gradient.addColorStop(1, options.colorGradient);
            return gradient;
        }
        const rad = ((Number(options.gradientAngle) || 0) * Math.PI) / 180;
        const x1 = size / 2 - Math.cos(rad) * size / 2;
        const y1 = size / 2 - Math.sin(rad) * size / 2;
        const x2 = size / 2 + Math.cos(rad) * size / 2;
        const y2 = size / 2 + Math.sin(rad) * size / 2;
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, options.colorDark);
        gradient.addColorStop(1, options.colorGradient);
        return gradient;
    },

    drawStyledQR(canvas, model, options) {
        const ctx = canvas.getContext('2d');
        const { moduleCount, modules } = model;
        const cell = canvas.width / moduleCount;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = options.colorLight;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.beginPath();
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (!modules[row][col]) continue;
                if (this.finderRole(row, col, moduleCount) !== 'body') continue;
                ctx.rect(col * cell, row * cell, cell + 0.5, cell + 0.5);
            }
        }
        ctx.clip();
        ctx.fillStyle = options.gradientEnabled
            ? this.createBodyGradient(ctx, canvas.width, options)
            : options.colorDark;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const frameColor = options.customEyes ? options.eyeFrame : options.colorDark;
        const ballColor = options.customEyes ? options.eyeBall : options.colorDark;
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                const role = this.finderRole(row, col, moduleCount);
                if (role === 'frame') {
                    ctx.fillStyle = frameColor;
                    ctx.fillRect(col * cell, row * cell, cell + 0.5, cell + 0.5);
                } else if (role === 'ball') {
                    ctx.fillStyle = ballColor;
                    ctx.fillRect(col * cell, row * cell, cell + 0.5, cell + 0.5);
                }
            }
        }
    },

    async generate(data, options = {}) {
        const qrContainer = document.getElementById('qrcode');
        if (!qrContainer) return;

        qrContainer.innerHTML = '';

        if (!data) {
            alert(LanguageManager.translate('alert_please_fill'));
            return;
        }

        console.log('QR Data:', data);
        console.log('Data type:', typeof data);
        console.log('Data length:', data.length);

        const {
            colorDark = '#000000',
            colorLight = '#ffffff',
            colorGradient = '#4f46e5',
            gradientEnabled = false,
            gradientType = 'linear',
            gradientAngle = 0,
            customEyes = false,
            eyeFrame = '#000000',
            eyeBall = '#000000',
            hasLogo = false,
            hasText = false,
            logoSizeRatio = 0.2,
            logoRemoveBg = false,
            correctLevel = 'M',
            size = 300,
        } = options;

        const safeColorDark = this.parseColor(colorDark) || '#000000';
        const safeColorLight = this.parseColor(colorLight) || '#ffffff';
        const safeGradient = this.parseColor(colorGradient) || '#4f46e5';
        const safeEyeFrame = this.parseColor(eyeFrame) || safeColorDark;
        const safeEyeBall = this.parseColor(eyeBall) || safeColorDark;
        const renderOptions = {
            colorDark: safeColorDark,
            colorLight: safeColorLight,
            colorGradient: safeGradient,
            gradientEnabled,
            gradientType,
            gradientAngle,
            customEyes,
            eyeFrame: safeEyeFrame,
            eyeBall: safeEyeBall,
        };

        const contrast = this.getContrast(safeColorDark, safeColorLight);
        console.log('Color contrast ratio:', contrast.toFixed(2));

        if (contrast < 4.5) {
            console.warn('⚠️ Low contrast! May affect scanability. Recommended: 4.5+');
        }

        try {
            const model = this.buildModel(data, (hasLogo || hasText) ? 'H' : correctLevel);
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            canvas.setAttribute('aria-hidden', 'true');
            qrContainer.appendChild(canvas);

            this.qrCodeInstance = model.qr;
            this.drawStyledQR(canvas, model, renderOptions);
            this.lastState = {
                ...renderOptions,
                moduleCount: model.moduleCount,
                modules: model.modules,
                size: canvas.width,
                logo: null,
                text: null,
            };

            if (hasLogo || hasText) {
                await this.addCustomizations(canvas, {
                    hasLogo,
                    hasText,
                    logoSizeRatio,
                    logoRemoveBg,
                });
            }

            this.syncPreviewImage(qrContainer, canvas);
            document.getElementById('downloadSection').classList.remove('hidden');
        } catch (error) {
            const message = String(error?.message || '');
            const tooLong = /overflow|too long|code length/i.test(message);
            alert(LanguageManager.translate(tooLong ? 'alert_data_too_long' : 'alert_qr_failed'));
            console.error(error);
        }
    },

    syncPreviewImage(qrContainer, canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        let img = qrContainer.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            img.alt = 'QR code';
            qrContainer.appendChild(img);
        }
        canvas.style.display = 'none';
        img.style.display = 'block';
        img.src = dataUrl;
    },

    loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => resolve({ img, url });
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };
            img.src = url;
        });
    },

    loadImageFromUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
        });
    },

    fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    },

    removeNearWhiteBackground(img, threshold = 242) {
        const canvas = document.createElement('canvas');
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const isBackground = (index) => {
            if (data[index + 3] < 8) return true;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const maxc = Math.max(r, g, b);
            const minc = Math.min(r, g, b);
            const avg = (r + g + b) / 3;
            return avg >= threshold && (maxc - minc) <= 28;
        };

        const seen = new Uint8Array(width * height);
        const stack = [];
        const push = (x, y) => {
            if (x < 0 || y < 0 || x >= width || y >= height) return;
            stack.push(y * width + x);
        };
        for (let x = 0; x < width; x++) {
            push(x, 0);
            push(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
            push(0, y);
            push(width - 1, y);
        }

        while (stack.length) {
            const idx = stack.pop();
            if (seen[idx]) continue;
            seen[idx] = 1;
            const pixel = idx * 4;
            if (!isBackground(pixel)) continue;
            data[pixel + 3] = 0;
            const x = idx % width;
            const y = (idx / width) | 0;
            push(x - 1, y);
            push(x + 1, y);
            push(x, y - 1);
            push(x, y + 1);
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                if (data[i + 3] === 0) continue;
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                if (avg < 200) continue;
                let nearTransparent = false;
                const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (const [dx, dy] of neighbors) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
                    if (data[((ny * width + nx) * 4) + 3] === 0) {
                        nearTransparent = true;
                        break;
                    }
                }
                if (nearTransparent) {
                    const fade = Math.min(1, (252 - avg) / 52);
                    data[i + 3] = Math.round(data[i + 3] * Math.max(0, fade));
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    },

    async prepareLogo(source) {
        const img = await this.loadImageFromUrl(source.url);
        let processedUrl = source.url;
        try {
            processedUrl = this.removeNearWhiteBackground(img);
        } catch (error) {
            console.warn('Remove-background skipped:', error);
        }
        return {
            url: source.url,
            processedUrl,
            name: source.name || '',
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            source: source.source || 'file',
            galleryId: source.galleryId || null,
        };
    },

    getActiveLogoUrl(removeBg) {
        if (!this.currentLogo) return null;
        const useProcessed = typeof removeBg === 'boolean'
            ? removeBg
            : !!document.getElementById('logoRemoveBg')?.checked;
        return useProcessed ? this.currentLogo.processedUrl : this.currentLogo.url;
    },

    // Fit logo inside a square area, preserving aspect ratio (no crop/stretch)
    getFittedLogoRect(canvasSize, imgWidth, imgHeight, maxRatio = 0.20) {
        const clampedRatio = Math.min(0.25, Math.max(0.10, Number(maxRatio) || 0.20));
        const maxSide = canvasSize * clampedRatio;
        const srcW = imgWidth || 1;
        const srcH = imgHeight || 1;
        const aspect = srcW / srcH;
        let drawW;
        let drawH;

        if (aspect >= 1) {
            drawW = maxSide;
            drawH = maxSide / aspect;
        } else {
            drawH = maxSide;
            drawW = maxSide * aspect;
        }

        return {
            x: (canvasSize - drawW) / 2,
            y: (canvasSize - drawH) / 2,
            width: drawW,
            height: drawH,
            padding: Math.max(8, Math.round(maxSide * 0.12)),
        };
    },

    drawFittedLogo(ctx, canvas, logo, maxRatio = 0.20) {
        const srcW = logo.naturalWidth || logo.width;
        const srcH = logo.naturalHeight || logo.height;
        const rect = this.getFittedLogoRect(canvas.width, srcW, srcH, maxRatio);
        const padX = rect.x - rect.padding;
        const padY = rect.y - rect.padding;
        const padW = rect.width + rect.padding * 2;
        const padH = rect.height + rect.padding * 2;
        const radius = Math.min(8, rect.padding);

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;

        if (typeof ctx.roundRect === 'function') {
            ctx.beginPath();
            ctx.roundRect(padX, padY, padW, padH, radius);
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.fillRect(padX, padY, padW, padH);
            ctx.strokeRect(padX, padY, padW, padH);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(logo, rect.x, rect.y, rect.width, rect.height);

        return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            padX,
            padY,
            padW,
            padH,
            radius,
        };
    },

    async addCustomizations(canvas, options) {
        const ctx = canvas.getContext('2d');
        const centerOption = document.querySelector('input[name="centerOption"]:checked')?.value;
        const centerText = document.getElementById('centerText')?.value;
        const textColor = this.parseColor(document.getElementById('centerTextColor')?.value) || '#000000';
        const logoUrl = this.getActiveLogoUrl(options.logoRemoveBg);

        if (centerOption === 'logo' && options.hasLogo && logoUrl) {
            try {
                const logo = await this.loadImageFromUrl(logoUrl);
                const layout = this.drawFittedLogo(ctx, canvas, logo, options.logoSizeRatio);
                if (this.lastState) {
                    this.lastState.logo = { dataUrl: logoUrl, ...layout };
                }
                console.log('✓ Logo added (aspect ratio preserved)');
            } catch (error) {
                console.error('Failed to load logo:', error);
                alert(LanguageManager.translate('alert_logo_load_failed'));
            }
        } else if (centerOption === 'text' && centerText) {
            const box = canvas.width * 0.18;
            const x = (canvas.width - box) / 2;
            const y = (canvas.height - box) / 2;
            const padding = 10;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - padding, y - padding, box + padding * 2, box + padding * 2);
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - padding, y - padding, box + padding * 2, box + padding * 2);

            ctx.fillStyle = textColor || '#000000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const maxLength = 10;
            const displayText = centerText.length > maxLength ? `${centerText.substring(0, maxLength)}...` : centerText;
            ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);

            if (this.lastState) {
                this.lastState.text = {
                    value: displayText,
                    color: textColor,
                    x: x - padding,
                    y: y - padding,
                    width: box + padding * 2,
                    height: box + padding * 2,
                };
            }
            console.log('✓ Text added - size: 18%');
        }
    },

    download(format = 'png') {
        const img = document.querySelector('#qrcode img');

        if (!img) return;

        if (format === 'png') {
            const a = document.createElement('a');
            a.href = img.src;
            a.download = 'qrcode.png';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
            }, 100);
        } else if (format === 'svg') {
            const svgData = this.buildSVG();
            if (!svgData) return;
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qrcode.svg';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } else if (format === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgData = img.src;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = 80;
            const imgHeight = 80;
            const x = (pageWidth - imgWidth) / 2;
            const y = 20;

            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save('qrcode.pdf');
        }
    },

    svgEscape(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    buildSVG() {
        const state = this.lastState;
        if (!state) return null;

        const { size, moduleCount, modules } = state;
        const cell = size / moduleCount;
        const bodyFill = state.gradientEnabled ? 'url(#qrBody)' : state.colorDark;
        const frameColor = state.customEyes ? state.eyeFrame : state.colorDark;
        const ballColor = state.customEyes ? state.eyeBall : state.colorDark;
        const angle = ((Number(state.gradientAngle) || 0) * Math.PI) / 180;
        const gx1 = 50 - Math.cos(angle) * 50;
        const gy1 = 50 - Math.sin(angle) * 50;
        const gx2 = 50 + Math.cos(angle) * 50;
        const gy2 = 50 + Math.sin(angle) * 50;

        let defs = '';
        if (state.gradientEnabled) {
            if (state.gradientType === 'radial') {
                defs += `<radialGradient id="qrBody" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${state.colorDark}"/><stop offset="100%" stop-color="${state.colorGradient}"/></radialGradient>`;
            } else {
                defs += `<linearGradient id="qrBody" x1="${gx1}%" y1="${gy1}%" x2="${gx2}%" y2="${gy2}%"><stop offset="0%" stop-color="${state.colorDark}"/><stop offset="100%" stop-color="${state.colorGradient}"/></linearGradient>`;
            }
        }

        let body = '';
        let eyes = '';
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (!modules[row][col]) continue;
                const role = this.finderRole(row, col, moduleCount);
                const x = col * cell;
                const y = row * cell;
                if (role === 'body') {
                    body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}"/>`;
                } else if (role === 'frame') {
                    eyes += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${frameColor}"/>`;
                } else if (role === 'ball') {
                    eyes += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${ballColor}"/>`;
                }
            }
        }

        let overlay = '';
        if (state.logo) {
            const logo = state.logo;
            overlay += `<rect x="${logo.padX}" y="${logo.padY}" width="${logo.padW}" height="${logo.padH}" rx="${logo.radius}" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>`;
            overlay += `<image href="${logo.dataUrl}" x="${logo.x}" y="${logo.y}" width="${logo.width}" height="${logo.height}" preserveAspectRatio="xMidYMid meet"/>`;
        } else if (state.text) {
            const text = state.text;
            overlay += `<rect x="${text.x}" y="${text.y}" width="${text.width}" height="${text.height}" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>`;
            overlay += `<text x="${size / 2}" y="${size / 2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-weight="bold" font-size="16" fill="${text.color}">${this.svgEscape(text.value)}</text>`;
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
            + `<defs>${defs}</defs>`
            + `<rect width="100%" height="100%" fill="${state.colorLight}"/>`
            + `<g fill="${bodyFill}">${body}</g>`
            + eyes
            + overlay
            + '</svg>';
    },
};

export { QRGenerator };
