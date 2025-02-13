import { CONTEXT_MENU_TYPE, COPY_TYPE, KEYBOARD_TYPE } from "@/utils/constant";
import { WebSite } from "../types/website";
import { EVENTS_ENUM, EventBus } from "../utils/bus";
import style from "copy-currency/src/utils";
import { copyKeyboardHandler, stopNativePropagation } from "../utils/events";
import instance from "copy/src/utils/instance";
import { ALLOW_PAINT, AUTO_USER_SELECT, COPY_BUTTON_STYLE, STYLE_ID } from "../utils/styles";
import { logger } from "@/utils/logger";
import { delayExecute } from "../utils/delay";
import { PAGE_LOADED } from "copy/src/constant/event";

const init = () => {
  const el = <HTMLDivElement>document.querySelector("#j_select");
  el && el.click();
};

const onMouseDown = () => {
  instance.hide(false);
};

const onMouseUp = (event: MouseEvent) => {
  const handler = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const text = window.docinReader?.st || "";
    logger.info("SELECT", text);
    if (text) {
      instance.onCopy(text, event);
    } else {
      instance.hide(false);
    }
  };
  setTimeout(handler, 100);
};

export const DocIn: WebSite = {
  regexp: /www\.docin\.com/,
  start(type) {
    if (type === COPY_TYPE) {
      delayExecute(PAGE_LOADED).then(init);
      style.insertCSS(
        STYLE_ID,
        AUTO_USER_SELECT + ALLOW_PAINT + COPY_BUTTON_STYLE + ".copy-tips{display:none !important;} "
      );
      EventBus.on(EVENTS_ENUM.MOUSE_UP_CAPTURE, onMouseUp);
      EventBus.on(EVENTS_ENUM.MOUSE_DOWN_CAPTURE, onMouseDown);
      EventBus.on(EVENTS_ENUM.COPY_CAPTURE, stopNativePropagation);
      EventBus.on(EVENTS_ENUM.KEY_BOARD_CAPTURE, copyKeyboardHandler);
      EventBus.on(EVENTS_ENUM.SELECT_START_CAPTURE, stopNativePropagation);
    } else if (type === KEYBOARD_TYPE) {
      EventBus.on(EVENTS_ENUM.KEY_BOARD_CAPTURE, stopNativePropagation);
    } else if (type === CONTEXT_MENU_TYPE) {
      EventBus.on(EVENTS_ENUM.CONTEXT_MENU_CAPTURE, stopNativePropagation);
    }
  },
  close(type) {
    if (type === COPY_TYPE) {
      instance.destroy();
      style.removeCSS(STYLE_ID);
      EventBus.off(EVENTS_ENUM.MOUSE_UP_CAPTURE, onMouseUp);
      EventBus.off(EVENTS_ENUM.MOUSE_DOWN_CAPTURE, onMouseDown);
      EventBus.off(EVENTS_ENUM.COPY_CAPTURE, stopNativePropagation);
      EventBus.off(EVENTS_ENUM.KEY_BOARD_CAPTURE, copyKeyboardHandler);
      EventBus.off(EVENTS_ENUM.SELECT_START_CAPTURE, stopNativePropagation);
    } else if (type === KEYBOARD_TYPE) {
      EventBus.off(EVENTS_ENUM.KEY_BOARD_CAPTURE, stopNativePropagation);
    } else if (type === CONTEXT_MENU_TYPE) {
      EventBus.off(EVENTS_ENUM.CONTEXT_MENU_CAPTURE, stopNativePropagation);
    }
  },
};
