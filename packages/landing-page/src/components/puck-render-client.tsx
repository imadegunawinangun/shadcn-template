"use client";

import React from "react";
import { Render } from "@puckeditor/core";
import { config } from "../puck.config";

export function PuckRenderClient({ data }: { data: any }) {
  return <Render config={config as any} data={data} />;
}
