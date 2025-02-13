import { State } from "./types/state";
import { storage } from "laser-utils";
import { CONTEXT_MENU_TYPE, COPY_TYPE, KEYBOARD_TYPE } from "@/utils/constant";
import { websites } from "./modules";
import { initBaseEvents } from "./utils/events";
import { CIBridge } from "@/bridge/content-inject";
import { onContentMessage } from "./utils/content-msg";
import { LOG_LEVEL, logger } from "@/utils/logger";
import { DOM_STAGE } from "copy/src/constant/event";

(async (): Promise<void> => {
  if (__DEV__) {
    logger.setLevel(LOG_LEVEL.INFO);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (window[process.env.EVENT_TYPE]) {
    logger.info("Inject Script Already Loaded");
    return void 0;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[process.env.EVENT_TYPE] = true;
  logger.info("Inject Script Loaded");
  initBaseEvents();
  const state: State = {
    COPY: !!storage.local.get<boolean>(COPY_TYPE) || !!storage.session.get<boolean>(COPY_TYPE),
    KEYBOARD:
      !!storage.local.get<boolean>(KEYBOARD_TYPE) || !!storage.session.get<boolean>(KEYBOARD_TYPE),
    CONTEXT_MENU:
      !!storage.local.get<boolean>(CONTEXT_MENU_TYPE) ||
      !!storage.session.get<boolean>(CONTEXT_MENU_TYPE),
  };
  const handler = websites.find(item => item.regexp.test(location.host)) || websites.slice(-1)[0];
  if (!handler) return void 0;
  handler.init && handler.init(state);
  state.COPY && handler.start(COPY_TYPE, DOM_STAGE.START);
  state.KEYBOARD && handler.start(KEYBOARD_TYPE, DOM_STAGE.START);
  state.CONTEXT_MENU && handler.start(CONTEXT_MENU_TYPE, DOM_STAGE.START);
  CIBridge.onContentMessage(onContentMessage(handler));
})();
