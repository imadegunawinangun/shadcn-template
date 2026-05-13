export interface Workflow {
  id: string;
  name: string;
  status: "active" | "paused";
  runs: number;
  createdAt: Date;
  triggerId?: string;
  flow?: any;
  actions?: any[];
}

export interface WorkflowAction {
  id: string;
  workflowId: string;
  pieceId: string;
  config: any;
  order: number;
}
