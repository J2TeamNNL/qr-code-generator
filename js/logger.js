// Activity Logger & Error Reporting System

const ActivityLogger = {
    logs: [],
    errors: [],
    maxLogs: 100,
    
    init() {
        console.log('🔍 Activity Logger initialized');
        this.interceptConsole();
        this.trackErrors();
    },
    
    // Log user action with timestamp
    log(action, details = {}) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            action,
            details,
        };
        
        this.logs.push(entry);
        
        // Keep only last N logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        console.log(`[ACTION] ${action}`, details);
    },
    
    // Intercept console errors
    interceptConsole() {
        const originalError = console.error;
        console.error = (...args) => {
            this.errors.push({
                timestamp: new Date().toISOString(),
                message: args.join(' '),
            });
            originalError.apply(console, args);
        };
    },
    
    // Track global errors
    trackErrors() {
        window.addEventListener('error', (event) => {
            this.errors.push({
                timestamp: new Date().toISOString(),
                message: event.message,
                source: event.filename,
                line: event.lineno,
                col: event.colno,
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.errors.push({
                timestamp: new Date().toISOString(),
                message: `Unhandled Promise Rejection: ${event.reason}`,
            });
        });
    },
    
    // Get system info
    getSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: new Date().toISOString(),
        };
    },
    
    // Generate error report
    generateReport() {
        const systemInfo = this.getSystemInfo();
        
        let report = '=== BÁO LỖI QR CODE GENERATOR ===\n\n';
        report += '📋 THÔNG TIN HỆ THỐNG:\n';
        report += `- Trình duyệt: ${systemInfo.userAgent}\n`;
        report += `- Ngôn ngữ: ${systemInfo.language}\n`;
        report += `- Màn hình: ${systemInfo.screenSize}\n`;
        report += `- Viewport: ${systemInfo.viewportSize}\n`;
        report += `- Thời gian: ${systemInfo.timestamp}\n\n`;
        
        if (this.errors.length > 0) {
            report += '❌ LỖI ĐÃ GHI NHẬN:\n';
            this.errors.slice(-10).forEach((err, idx) => {
                report += `${idx + 1}. [${err.timestamp}] ${err.message}\n`;
                if (err.source) {
                    report += `   Nguồn: ${err.source}:${err.line}:${err.col}\n`;
                }
            });
            report += '\n';
        } else {
            report += '✅ Không có lỗi được ghi nhận\n\n';
        }
        
        report += '📝 HOẠT ĐỘNG GẦN ĐÂY (10 actions cuối):\n';
        this.logs.slice(-10).forEach((log, idx) => {
            report += `${idx + 1}. [${log.timestamp}] ${log.action}\n`;
            if (Object.keys(log.details).length > 0) {
                report += `   Chi tiết: ${JSON.stringify(log.details)}\n`;
            }
        });
        
        report += '\n=== KẾT THÚC BÁO CÁO ===\n';
        report += '\n📬 Gửi báo cáo này qua:\n';
        report += '- GitHub: https://github.com/j2teamnnl/qr-code-generator/issues\n';
        report += '- Messenger: https://www.messenger.com/t/j2teamnnl/\n';
        
        return report;
    },
    
    // Show error report dialog
    showReportDialog() {
        const report = this.generateReport();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <span class="text-3xl">🐛</span>
                        <span>Báo Lỗi</span>
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Dưới đây là thông tin chi tiết về hoạt động của bạn. Hãy copy và gửi cho chúng tôi!
                    </p>
                </div>
                
                <div class="flex-1 overflow-auto p-6">
                    <textarea 
                        id="errorReport" 
                        readonly 
                        class="w-full h-96 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-mono text-xs bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
                    >${report}</textarea>
                </div>
                
                <div class="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div class="flex gap-3">
                        <button 
                            id="copyReportBtn"
                            class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copy Báo Cáo
                        </button>
                        <button 
                            id="closeReportBtn"
                            class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        >
                            Đóng
                        </button>
                    </div>
                    
                    <div class="flex gap-3">
                        <a 
                            href="https://github.com/j2teamnnl/qr-code-generator/issues/new" 
                            target="_blank"
                            class="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub Issues
                        </a>
                        <a 
                            href="https://www.messenger.com/t/j2teamnnl/" 
                            target="_blank"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
                            </svg>
                            Messenger
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('copyReportBtn').addEventListener('click', () => {
            const textarea = document.getElementById('errorReport');
            textarea.select();
            document.execCommand('copy');
            
            // Visual feedback
            const btn = document.getElementById('copyReportBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Đã Copy!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
        
        document.getElementById('closeReportBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    },
};

// Create floating error report button
function createErrorReportButton() {
    const button = document.createElement('button');
    button.id = 'errorReportBtn';
    button.className = 'fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-40 flex items-center gap-2';
    button.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <span class="hidden md:inline">Báo Lỗi</span>
    `;
    button.title = 'Báo lỗi hoặc gửi feedback';
    
    button.addEventListener('click', () => {
        ActivityLogger.log('Opened error report dialog');
        ActivityLogger.showReportDialog();
    });
    
    document.body.appendChild(button);
}

export { ActivityLogger, createErrorReportButton };
