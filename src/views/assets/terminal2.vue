<template>
    <div ref="terminal" class="terminal-container"></div>
  </template>
  
  <script>
  import { Terminal } from 'xterm'
  import { AttachAddon } from 'xterm-addon-attach'
  import { FitAddon } from 'xterm-addon-fit'
  
  export default {
    data() {
      return {
        term: null,
        socket: null,
        fitAddon: new FitAddon()
      }
    },
  
    mounted() {
      this.initTerminal()
      this.connectSocket()
    },
  
    beforeDestroy() {
      this.socket?.close()
      this.term?.dispose()
    },
  
    methods: {
      initTerminal() {
        this.term = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
          theme: {
            background: '#1e1e1e',
            foreground: '#ffffff'
          }
        })
  
        this.term.loadAddon(this.fitAddon)
        this.term.open(this.$refs.terminal)
        this.fitAddon.fit()
        
        // 处理窗口大小变化
        window.addEventListener('resize', this.handleResize)
      },
  
      connectSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.host}/ws/ssh`
        
        this.socket = new WebSocket(wsUrl)
        this.socket.onopen = () => {
          const attachAddon = new AttachAddon(this.socket)
          this.term.loadAddon(attachAddon)
          
          // 初始化终端尺寸
          this.sendSize()
        }
  
        this.socket.onclose = () => {
          this.term.write('\r\nConnection closed')
        }
      },
  
      sendSize() {
        const { rows, cols } = this.fitAddon.proposeDimensions()
        this.socket.send(JSON.stringify({
          type: 'resize',
          rows: rows || 24,
          cols: cols || 80
        }))
      },
  
      handleResize() {
        this.fitAddon.fit()
        this.sendSize()
      }
    }
  }
  </script>
  
  <style>
  @import 'xterm/css/xterm.css';
  
  .terminal-container {
    width: 100%;
    height: 100%;
    padding: 10px;
  }
  </style>