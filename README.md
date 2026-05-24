# MCP 示例服务器

这是一个最小可用的 Model Context Protocol（MCP）服务器示例，使用 TypeScript 编写，并通过 stdio 与 MCP 客户端通信。

## 提供的工具

- `add`：把两个数字相加。
- `current_time`：返回当前服务器时间，格式为 ISO timestamp。
- `proof_of_call`：返回一段带随机 nonce、进程号、时间戳的调用证明，并写入本地 `mcp-demo-calls.log`。

## 本地运行

安装依赖：

```powershell
npm install
```

构建：

```powershell
npm run build
```

运行 smoke test，验证 MCP 客户端可以发现并调用工具：

```powershell
npm run smoke
```

启动服务器：

```powershell
npm start
```

这个服务器使用 stdio 传输，通常由 MCP 客户端启动，而不是直接在终端里长期运行。

## 如何确认真的调用了 MCP

让 MCP 客户端调用：

```text
请调用 demo MCP 的 proof_of_call 工具，note 写 hello
```

如果调用成功，返回结果里会包含：

- `source: "mcp-demo-server"`
- `pid`
- `timestamp`
- `nonce`
- `note`

同时当前目录会新增或追加 `mcp-demo-calls.log`。这个日志是 MCP server 写入的，可以用来区分“真实工具调用”和“模型自己推理出的回答”。

## MCP 客户端配置示例

在支持 MCP 的客户端中，可以使用类似下面的配置。如果你移动了项目目录，需要同步调整路径。

```json
{
  "mcpServers": {
    "demo": {
      "command": "node",
      "args": ["C:\\Users\\admin\\Desktop\\mcp\\dist\\index.js"]
    }
  }
}
```

连接客户端前请先构建：

```powershell
npm run build
```
