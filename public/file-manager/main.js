// 客户端JavaScript独立文件
class FileUploader {
    constructor() {
        this.initEventListeners();
        this.loadFileList();
    }

    // 在FileUploader类中补充事件绑定
    initEventListeners() {
        // 新增普通文件上传按钮监听
        document.getElementById('fileInput').addEventListener('change', async e => {
            if (e.target.files[0]) {
                const success = await this.handleFileUpload(e.target.files[0]);
                if (success) {
                    alert('文件上传成功');
                    this.loadFileList();
                }
            }
        });

        // 大文件上传
        document.getElementById('bigFileBtn').addEventListener('click', () => {
            document.getElementById('bigFile').click();
        });

        // 文件夹上传
        document.getElementById('folderBtn').addEventListener('click', () => {
            document.getElementById('folderInput').click();
        });

        // 普通文件上传
        document.getElementById('fileInput').addEventListener('change', e => {
            this.handleFileUpload(e.target.files[0]);
        });

        // 大文件分块上传
        document.getElementById('bigFile').addEventListener('change', async e => {
            await this.handleBigFileUpload(e.target.files[0]);
        });

        // 文件夹上传处理
        document.getElementById('folderInput').addEventListener('change', async e => {
            await this.handleFolderUpload(e.target.files);
        });

        // 新增大文件按钮点击处理
        document.getElementById('bigFileBtn').addEventListener('click', () => {
            document.getElementById('bigFile').click();
        });

        // 新增文件夹按钮点击处理
        document.getElementById('folderBtn').addEventListener('click', () => {
            document.getElementById('folderInput').click();
        });

        // 大文件选择变更监听
        document.getElementById('bigFile').addEventListener('change', async e => {
            if (e.target.files[0]) {
                await this.handleBigFileUpload(e.target.files[0]);
            }
        });

        // 文件夹选择变更监听
        document.getElementById('folderInput').addEventListener('change', async e => {
            if (e.target.files.length > 0) {
                await this.handleFolderUpload(e.target.files);
            }
        });
    }

    async handleBigFileUpload(file) {
        const chunkSize = 10 * 1024 * 1024; // 10MB分块
        const totalChunks = Math.ceil(file.size / chunkSize);
        const hash = await this.generateFileHash(file);

        this.updateProgress(0);

        try {
            for (let i = 0; i < totalChunks; i++) {
                const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
                const formData = new FormData();
                formData.append('chunk', chunk);
                formData.append('index', i);
                formData.append('total', totalChunks);
                formData.append('hash', hash);

                await fetch('/app/file/chunk', { method: 'POST', body: formData });
                this.updateProgress((i + 1) / totalChunks * 100);
            }

            const res = await fetch('/app/file/merge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hash, filename: file.name })
            });

            if (res.ok) {
                alert('大文件上传成功！');
                this.loadFileList();
            }
        } catch (error) {
            console.error('上传失败:', error);
            alert('文件上传失败，请检查控制台');
        }
    }

    async handleFolderUpload(files) {
        try {
            const uploadPromises = Array.from(files).map(file =>
                this.handleFileUpload(file)
            );

            await Promise.all(uploadPromises);
            alert(`成功上传 ${files.length} 个文件`);
            this.loadFileList();
        } catch (error) {
            console.error('文件夹上传失败:', error);
            alert('文件夹上传失败');
        }
    }

    // 在handleFileUpload方法中添加错误处理
    async handleFileUpload(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/app/file', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('上传失败');
            return true;
        } catch (error) {
            console.error('文件上传失败:', error);
            alert(error.message);
            return false;
        }
    }

    async generateFileHash(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => {
                const buffer = new Uint8Array(reader.result);
                const hashArray = Array.from(buffer.subarray(0, 1024)); // 取文件头1KB计算
                resolve(btoa(String.fromCharCode(...hashArray)).slice(0, 32));
            };
            reader.readAsArrayBuffer(file.slice(0, 1024));
        });
    }

    updateProgress(percent) {
        const progressBar = document.querySelector('#bigFileProgress .progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
            progressBar.textContent = `${percent.toFixed(1)}%`;
        }
    }

    async loadFileList() {
        try {
            const res = await fetch('/app/file/list');
            const files = await res.json();

            const listContainer = document.getElementById('fileList');
            listContainer.innerHTML = files.map(file => `
                <div class="file-item">
                    <a href="${file.url}" download>${file.name}</a>
                    <span>${this.formatFileSize(file.size)}</span>
                </div>
            `).join('');
        } catch (error) {
            console.error('加载文件列表失败:', error);
        }
    }

    formatFileSize(bytes) {
        if (bytes >= 1024 * 1024) {
            return `(${(bytes / 1024 / 1024).toFixed(1)}MB)`;
        }
        return `(${(bytes / 1024).toFixed(1)}KB)`;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new FileUploader();
});