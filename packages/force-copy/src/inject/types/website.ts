import { ALL_ACTION_TYPE } from "@/utils/constant";
import { State } from "./state";
import { DOM_STAGE } from "copy/src/constant/event";

export type WebSite = {
  // 链接匹配正则
  regexp: RegExp;
  // 初始化必须执行
  init?: (state: State) => void;
  // 启动时执行 初始启动/被动启动
  start: (type: ALL_ACTION_TYPE, when: RecordValues<typeof DOM_STAGE>) => void;
  // 关闭时执行 被动关闭
  close: (type: ALL_ACTION_TYPE) => void;
};
