# pulsar-mcp

MCP (Model Context Protocol) server. Provides editor tools to Claude and other AI assistants via the MCP protocol.

## Features

- **MCP protocol**: Version 2025-11-25 with tool annotations support.
- **HTTP bridge**: Server running inside Pulsar for direct API access.
- **Standalone server**: MCP server script for Claude CLI integration.
- **Editor tools**: Get/set content, open/save files, manage selections.
- **Extensible**: Other packages can register tools via `mcp-tools` service.

## Installation

To install `pulsar-mcp` search for [pulsar-mcp](https://web.pulsar-edit.dev/packages/pulsar-mcp) in the Install pane of the Pulsar settings or run `ppm install pulsar-mcp`. Alternatively, you can run `ppm install asiloisad/pulsar-pulsar-mcp` to install a package directly from the GitHub repository.

## Commands

Commands available in `atom-workspace`:

- `pulsar-mcp:start`: start the MCP bridge server,
- `pulsar-mcp:stop`: stop the MCP bridge server,
- `pulsar-mcp:status`: show current bridge status and port.

## Configuration

| Setting | Description | Default |
| --- | --- | --- |
| Auto Start | Automatically start bridge when Pulsar opens | `true` |
| Bridge Base Port | Base port for MCP bridge (auto-increments for multiple windows) | `3000` |
| Debug Mode | Enable debug logging to console | `false` |

## Built-in Tools

| Tool | Description |
| --- | --- |
| `GetActiveEditor` | Get editor metadata (path, grammar, modified, lineCount) |
| `ReadText` | Read active editor content with line pagination (use agent's file tools for other files) |
| `WriteText` | Write text at cursor or replace range in active editor (use agent's file tools for other files) |
| `OpenFile` | Open a file in editor with optional position |
| `SaveFile` | Save a file (active editor or specific path) |
| `GetSelections` | Get all selections/cursors with positions and text from active editor |
| `SetSelections` | Set multiple selections/cursors at specific positions in active editor |
| `CloseFile` | Close an editor tab |
| `GetProjectPaths` | Get project root folders |
| `AddProjectPath` | Add a folder to project roots |

## MCP Client Integration

The standalone MCP server (`lib/server.js`) can be used with any MCP-compatible client.

```json
{
  "mcpServers": {
    "pulsar": {
      "command": "node",
      "args": ["~/.pulsar/packages/pulsar-mcp/lib/server.js"]
    }
  }
}
```

On Windows, use `%USERPROFILE%\.pulsar\packages\pulsar-mcp\lib\server.js`.

## Extending with custom tools

Other Pulsar packages can provide additional MCP tools by implementing the `mcp-tools` service.

In your `package.json`:

```json
{
  "providedServices": {
    "mcp-tools": {
      "versions": {
        "1.0.0": "provideMcpTools"
      }
    }
  }
}
```

In your main module:

```javascript
module.exports = {
  provideMcpTools() {
    return [
      {
        name: "MyCustomTool",
        description: "Description for the AI",
        inputSchema: {
          type: "object",
          properties: {
            param: { type: "string", description: "Parameter description" }
          },
          required: ["param"]
        },
        annotations: { readOnlyHint: true },
        execute({ param }) {
          // Tool implementation
          return { result: "data" };
        }
      }
    ];
  }
}
```

### Tool annotations

MCP 2025-11-25 supports tool annotations to hint behavior:

| Annotation | Description |
| --- | --- |
| `readOnlyHint` | `true` if tool only reads data, `false` if it modifies state |
| `destructiveHint` | `true` if tool performs destructive actions (e.g., closing files) |

## Service

The package provides a `pulsar-mcp` service for other packages.

```javascript
// Get the service
consumePulsarMcp(service) {
  // Get current bridge port
  const port = service.getBridgePort();

  // Check if bridge is running
  const running = service.isRunning();

  // Get path to MCP server script
  const serverPath = service.getServerPath();
}
```

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts [on GitHub](https://github.com/asiloisad/pulsar-pulsar-mcp) — any feedback's welcome!
