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
            isInputLock: false, // 防止在服务器响应期间输入
            inputBuffer: '',
        };
    },
    mounted() {
        this.initTerminal();
        this.connectWebSocket();
    },
    beforeDestroy() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        if (this.terminal) {
            this.terminal.dispose();
        }
    },
    methods: {
        initTerminal() {
            this.terminal = new Terminal({
                cursorBlink: true,
                fontSize: 14,
                convertEol: true,
                disableStdin: false,
            });

            this.terminal.loadAddon(this.fitAddon);
            this.terminal.open(this.$refs.terminalContainer);
            this.fitAddon.fit();

            this.terminal.onKey(e => {
                const { key, domEvent } = e;
                const command = this.handleKeyEvent(domEvent);
                if (command !== null && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(command);
                }
            });
        },
        handleKeyEvent(event) {
        if (this.isInputLock) return null;
            switch(event.key) {
                case 'Enter':
                    const command = this.inputBuffer;
                    this.inputBuffer = '';
                    this.socket.send('\r');
                    // this.logCommand(command); // 可选：前端记录命令
                    return '\r';
                case 'Backspace':
                    this.inputBuffer = this.inputBuffer.slice(0, -1);
                    return '\x08';
                case 'Tab':
                    event.preventDefault();
                    this.inputBuffer += '\t';
                    return '\t';
                default:
                    if (event.key.length === 1) {
                        this.inputBuffer += event.key;
                        return event.key;
                    }
                    return null;
            }
        },
        logCommand(cmd) {
            console.log('[CMD]', cmd.replace(/\t/g, 'TAB'));
        },
        // handleKeyEvent(event) {
        //     // 处理特殊按键
        //     if (event.key === 'Enter') {
        //         return '\r';
        //     }
        //     if (event.key === 'Backspace') {
        //         return '\x08';
        //     }
        //     if (event.key === 'Tab') {  // 新增Tab键处理
        //         event.preventDefault(); // 阻止默认跳转行为
        //         return '\t'; 
        //     }
        //     // 发送可打印字符
        //     if (event.key.length === 1) {
        //         return event.key;
        //     }
        //     return null;
        // },
        connectWebSocket() {
            this.socket = new WebSocket(this.wsUrl);

            this.socket.onopen = () => {
                this.terminal.write('WebSocket 连接成功\r\n');
            };

            this.socket.onmessage = (event) => {
                this.terminal.write(event.data);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket 错误:', error);
                this.terminal.write('连接发生错误，请检查控制台\r\n');
            };

            this.socket.onclose = (event) => {
                this.terminal.write(`连接关闭，状态码: ${event.code}\r\n`);
            };
        },
    },
};
</script>

<style scoped>
.terminal-container {
    width: 100%;
    height: 100%;
    padding: 0;
    background: #000;
    border-radius: 4px;
}
.xterm {
    height: 100%;
}

.xterm .xterm-viewport::-webkit-scrollbar {
    width: 10px!important; /* 设置滚动条宽度 */
}
.xterm .xterm-viewport::-webkit-scrollbar-track {
    background-color: #f3f3f4!important; /* 设置滚动条背景颜色 */
}
.xterm .xterm-viewport::-webkit-scrollbar-thumb {
    background-color: #cecece!important; /* 设置滚动条滑块颜色 */
    border-radius: 5px; /* 设置滑块的圆角 */
}
.xterm .xterm-viewport::-webkit-scrollbar-thumb:hover {
    background-color: #bdbdbd!important; /* 设置滚动条滑块悬停时的颜色 */
}
</style>