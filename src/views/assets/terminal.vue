<template>
    <div ref="terminalContainer" class="terminal-container"></div>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';

export default {
    name: 'XtermWebSocket',
    props: {
        wsUrl: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            terminal: null,
            fitAddon: new FitAddon(),
            socket: null,
            resizeObserver: null,
            isConnected: false,
            hasConnected: false,
            decoder: new TextDecoder('utf-8', { fatal: false }),
        };
    },
    mounted() {
        this.initConnection();
    },
    beforeDestroy() {
        this.disconnect();
    },
    methods: {
        initConnection() {
            if (!this.hasConnected) {
                this.hasConnected = true;
                this.initTerminal();
            }
        },
        initTerminal() {
            this.$nextTick(() => {
                this.setupTerminal();
                this.connectWebSocket();
                this.setupResizeObserver();
            });
        },
        connectWebSocket() {
            if (this.socket) return; // 避免重复创建 WebSocket

            this.socket = new WebSocket(this.wsUrl);
            this.socket.binaryType = 'arraybuffer'; // 允许接收二进制数据

            this.socket.onopen = () => {
                this.isConnected = true;
                // this.terminal.writeln('\x1b[32mWebSocket 连接成功\x1b[0m');
                setTimeout(() => this.sendSize(), 100); // 连接成功后，延迟发送窗口大小
            };

            this.socket.onmessage = (event) => {
                let data = event.data instanceof ArrayBuffer ? new Uint8Array(event.data) : event.data;
                // 直接将二进制数据写入终端
                this.terminal.write(data);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket 错误:', error);
                this.terminal.write('\x1b[31m连接发生错误，请检查控制台\x1b[0m');
            };

            this.socket.onclose = (event) => {
                this.isConnected = false;
                this.socket = null;
                this.terminal.write(`\x1b[33m连接关闭，状态码: ${event.code}\x1b[0m`);
            };
        },
        setupTerminal() {
            if (this.terminal) return;
            this.terminal = new Terminal({
                cursorBlink: true,
                fontSize: 14,
                fontFamily: 'Consolas, monospace',
                convertEol: true,  // 允许终端自动处理行尾符号
                scrollback: 10000,
                disableStdin: false,
                screenKeys: true,  // 启用屏幕键
                macOptionIsMeta: true,
                allowProposedApi: true,
                termType: 'xterm-256color', // 设置终端类型
            });

            this.terminal.loadAddon(this.fitAddon);
            this.terminal.open(this.$refs.terminalContainer);
            this.terminal.focus();
            this.fitAddon.fit();

            // 监听终端输入并发送给服务器
            this.terminal.onData(data => {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(data);
                }
            });
        },
        setupResizeObserver() {
            this.resizeObserver = new ResizeObserver(() => {
                this.handleResize();
            });
            this.resizeObserver.observe(this.$refs.terminalContainer);
        },
        sendSize() {
            if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
            const dims = this.fitAddon.proposeDimensions();
            if (!dims || dims.cols < 10 || dims.rows < 5) return;
            this.socket.send(JSON.stringify({
                type: 'resize',
                rows: dims.rows,
                cols: dims.cols,
            }));
        },
        handleResize() {
            if (!this.terminal || !this.socket || !this.isConnected) return;
            this.fitAddon.fit();
            this.sendSize();
        },
        clearTerminal() {
            this.terminal.reset();
            this.disconnect();
            setTimeout(() => {
                this.initConnection();
            }, 1000);
        },
        disconnect() {
            this.isConnected = false;
            this.hasConnected = false;
            if (this.socket) {
                this.socket.close();
                this.socket = null;
            }
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
            if (this.terminal) {
                this.terminal.dispose();
                this.terminal = null;
            }
        },
    },
};
</script>

<style scoped>
.terminal-container {
    width: 708px !important;
    height: 533px !important;
    padding: 0 !important;
    background: #000 !important;
    border-radius: 4px !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    font-family: "Consolas", monospace !important;
}
::v-deep .xterm-rows {
  font-family: inherit !important;
  font-size: 14px !important;
}
</style>
