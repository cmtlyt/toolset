import { TExclude } from '../../types/base';
import { getArray, isNull, formatDate } from '../../utils';
import { warning } from '../../common/warning';
import { cacheByReturn } from '../../cirDep';

interface Constant {
  moduleIdReg: RegExp;
  methodReg: RegExp;
  dateReg: RegExp;
  controllerMethods: string[];
  defaultController: Console;
  defaultMessageTemplate: string;
}

const CONSTANT: Constant = {
  moduleIdReg: /#\[moduleId\]/g,
  methodReg: /#\[method\]/g,
  dateReg: /#\[date(:.*?)?\]/g,
  controllerMethods: ['log', 'info', 'warn', 'error', 'debug'],
  defaultController: console,
  defaultMessageTemplate: `#[date] #[moduleId]-#[method]:=>#[message]`,
};

function checkController(controller: Controller) {
  if (isNull(controller) || typeof controller !== 'object') return false;
  return CONSTANT.controllerMethods.every((method) => method in controller);
}

function getController(controller: Controller, backController: Controller = null) {
  if (checkController(controller)) {
    return controller;
  }
  if (checkController(backController)) {
    return backController;
  }
  const { defaultController, controllerMethods } = CONSTANT;
  warning(`控制器至少得实现[${controllerMethods}]等方法,已使用默认控制器\`${defaultController}\`替代`);
  return defaultController;
}

function getMessageTemplate(messageTemplate: string | MessageTemplateFunc) {
  if (typeof messageTemplate === 'function') return messageTemplate;
  let currTemplate = CONSTANT.defaultMessageTemplate;
  if (typeof messageTemplate === 'string' && messageTemplate.includes('#[message]')) {
    currTemplate = messageTemplate;
  } else {
    warning(`消息模板中没有消息的占位符,已使用默认模板\`${currTemplate}\`替代`);
  }
  const { moduleIdReg, methodReg, dateReg } = CONSTANT;
  return (_: any[], moduleId: any, method: string, date: Date) => {
    return currTemplate
      .replace(moduleIdReg, moduleId)
      .replace(methodReg, method)
      .replace(dateReg, (_, format) => {
        return formatDate(date, format?.slice(1));
      });
  };
}

function getIgnoreMessage(ignoreMessage: string[] | IgnoreMessageFunc) {
  if (typeof ignoreMessage === 'function') return ignoreMessage;
  ignoreMessage = getArray(ignoreMessage);
  return cacheByReturn(() => {
    if (ignoreMessage.length) return (message) => ignoreMessage.includes(message.toString());
    return false;
  });
}

/**
 * @param {string[]} showMethods
 * @param {Controller} controller
 * @returns {string[]}
 */
function getShowMethods(showMethods, controller) {
  showMethods = getArray(showMethods);
  return showMethods.filter((method) => {
    const has = method in controller;
    if (!has) warning(`传入的控制器中不存在${method}方法,已自动排除`);
    return has;
  });
}

/**
 * @param {LoggerOptions} options
 */
function normalizeOptions(options: LoggerOptions = {}) {
  if (typeof options !== 'object') options = {};
  const { defaultController, defaultMessageTemplate } = CONSTANT;
  const {
    showModuleIds = [],
    showMethods = [],
    controller: _controller = defaultController,
    ignoreMessage = [],
    messageTemplate = defaultMessageTemplate,
  } = options;

  const controller = getController(_controller);

  return {
    showMethods: getShowMethods(showMethods, controller),
    showModuleIds: getArray(showModuleIds),
    controller,
    ignoreMessage: getIgnoreMessage(ignoreMessage),
    messageTemplate: getMessageTemplate(messageTemplate),
  };
}

let instance: Logger = null;

type IgnoreMessageFunc = (message: string) => boolean;

type MessageTemplateFunc = (data: any[], moduleId: any, method: string, date: Date) => string | any[];

interface LogInfo {
  moduleId: any;
  method: string;
  date: Date;
  error: null | Error;
  message: string;
}

interface Controller {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  onOutput?: (logInfo: LogInfo) => void;
}

interface LoggerOptions {
  showMethods?: string[];
  showModuleIds?: string[];
  controller?: Controller;
  ignoreMessage?: string[] | IgnoreMessageFunc;
  messageTemplate?: string | MessageTemplateFunc;
}

export class Logger {
  static getInstance(options: LoggerOptions) {
    return (instance ??= new Logger(options));
  }

  #_originOptions: LoggerOptions;
  #_showMethods: string[];
  #_showModuleIds: string[];
  #_controller: Controller;
  #_ignoreMessage: IgnoreMessageFunc;
  #_messageTemplate: MessageTemplateFunc;

  constructor(options: LoggerOptions = {}) {
    const { showMethods, showModuleIds, controller, ignoreMessage, messageTemplate } = normalizeOptions(options);
    this.#_originOptions = options;
    this.#_showMethods = showMethods;
    this.#_showModuleIds = showModuleIds;
    this.#_controller = controller;
    this.#_ignoreMessage = ignoreMessage;
    this.#_messageTemplate = messageTemplate;
  }

  get messageTemplate() {
    return this.#_originOptions.messageTemplate || CONSTANT.defaultMessageTemplate;
  }
  set messageTemplate(value) {
    this.#_originOptions.messageTemplate = value;
    this.#_messageTemplate = getMessageTemplate(value);
  }
  get showMethods() {
    return this.#_originOptions.showMethods || [...this.#_showMethods];
  }
  set showMethods(value) {
    this.#_originOptions.showMethods = value;
    this.#_showMethods = getShowMethods(value, this.#_controller);
  }
  get ignoreMessage() {
    return this.#_originOptions.ignoreMessage || [];
  }
  set ignoreMessage(value) {
    this.#_originOptions.ignoreMessage = value;
    this.#_ignoreMessage = getIgnoreMessage(value);
  }
  get showModuleIds() {
    return this.#_originOptions.showModuleIds || [];
  }
  set showModuleIds(value) {
    this.#_originOptions.showModuleIds = value;
    this.#_showModuleIds = getArray(value);
  }
  get controller() {
    return this.#_controller;
  }
  set controller(value) {
    this.#_controller = getController(value, this.#_controller);
  }

  #_removeIgnoreMessage(args: any[]) {
    const ignoreMessage = this.#_ignoreMessage;
    return args.filter((item) => !ignoreMessage(item));
  }
  #_checkOutputConditions(method: string, moduleId: any) {
    // 可输出的方法
    const checkMethod = !this.#_showMethods.length || this.#_showMethods.includes(method);
    // 可输出的模块
    const checkModule = !this.#_showModuleIds.length || this.#_showModuleIds.includes(moduleId);
    return checkMethod && checkModule;
  }
  #_formatOutputMessage(method: string, moduleId: any, date: Date, args: any[]) {
    args = this.#_removeIgnoreMessage(args);
    const messageTemplate = this.#_messageTemplate(args, moduleId, method, date);
    if (Array.isArray(messageTemplate)) return messageTemplate;
    const [preMessage, nextMessage] = messageTemplate.split('#[message]');
    if (isNull(nextMessage)) return [preMessage];
    return [preMessage, ...args, nextMessage].filter((item) => item);
  }
  #_output(method: string, moduleId: any, args: any[]) {
    if (!this.#_checkOutputConditions(method, moduleId)) return;
    const controller = this.#_controller;
    const date = new Date();
    const messages = this.#_formatOutputMessage(method, moduleId, date, args);
    const logInfo = {
      moduleId,
      method,
      date,
      error: null,
      message: messages.join(' '),
    };
    try {
      controller[method].apply(controller, messages);
    } catch (e) {
      logInfo.error = e;
    }
    this.#_onOutput(logInfo);
  }
  #_onOutput(logInfo: LogInfo) {
    const outputListener = this.#_controller.onOutput;
    typeof outputListener === 'function' && outputListener(logInfo);
  }
  log(moduleId: any, ...args: any[]) {
    this.#_output('log', moduleId, args);
    return this;
  }
  info(moduleId: any, ...args: any[]) {
    this.#_output('info', moduleId, args);
    return this;
  }
  warn(moduleId: any, ...args: any[]) {
    this.#_output('warn', moduleId, args);
    return this;
  }
  error(moduleId: any, ...args: any[]) {
    this.#_output('error', moduleId, args);
    return this;
  }
  debug(moduleId: any, ...args: any[]) {
    this.#_output('debug', moduleId, args);
    return this;
  }
  getDeconstructableObject(): TExclude<Controller, 'onOutput'> {
    return {
      log: this.log.bind(this),
      info: this.info.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      debug: this.debug.bind(this),
    };
  }
}
