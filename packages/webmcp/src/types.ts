export interface WebMCPTool {
  name: string
  description: string
  inputSchema: any
  execute: (input: any) => Promise<any>
}

declare global {
  interface Window {
    __WEBMCP_TOOLS__?: Record<string, WebMCPTool>
  }
  interface Navigator {
    modelContext?: {
      registerTool: (tool: WebMCPTool) => void
      unregisterTool: (name: string) => void
      listTools?: () => Promise<WebMCPTool[]>
      executeTool?: (name: string, args: any) => Promise<any>
    }
  }
}
