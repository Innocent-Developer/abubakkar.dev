/**
 * Terminal component utilities
 */
(function (global) {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function createElement(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  /**
   * Create a terminal window DOM structure
   * @param {Object} options
   * @param {string} options.title - Title bar text
   * @param {string} [options.className] - Extra classes on .terminal
   * @returns {{ root: HTMLElement, body: HTMLElement }}
   */
  function createTerminal(options) {
    options = options || {};
    var root = createElement('div', 'terminal' + (options.className ? ' ' + options.className : ''));

    var titlebar = createElement('div', 'terminal-titlebar');
    var dots = createElement('div', 'terminal-dots');
    dots.innerHTML =
      '<span class="dot-red"></span>' +
      '<span class="dot-amber"></span>' +
      '<span class="dot-green"></span>';
    var title = createElement('span', 'terminal-title', options.title || 'zsh  80×24');
    titlebar.appendChild(dots);
    titlebar.appendChild(title);

    var body = createElement('div', 'terminal-body' + (options.bodyClass ? ' ' + options.bodyClass : ''));

    root.appendChild(titlebar);
    root.appendChild(body);

    return { root: root, body: body };
  }

  /**
   * Type a single line character by character
   */
  function typeLine(text, container, speed) {
    speed = speed || 35;
    return new Promise(function (resolve) {
      var line = createElement('div', 'terminal-line prompt-line');
      container.appendChild(line);

      if (prefersReducedMotion()) {
        line.textContent = text;
        resolve(line);
        return;
      }

      var i = 0;
      function tick() {
        if (i < text.length) {
          line.textContent += text.charAt(i);
          i++;
          setTimeout(tick, speed);
        } else {
          resolve(line);
        }
      }
      tick();
    });
  }

  /**
   * Add an output line instantly
   */
  function addOutput(text, container, className) {
    var line = createElement('div', 'terminal-line output' + (className ? ' ' + className : ''));
    line.textContent = text;
    container.appendChild(line);
    return line;
  }

  /**
   * Add HTML output (for links/buttons in hero)
   */
  function addHtmlOutput(html, container, className) {
    var line = createElement('div', 'terminal-line output' + (className ? ' ' + className : ''));
    line.innerHTML = html;
    container.appendChild(line);
    return line;
  }

  /**
   * Add blinking cursor to a line or container
   */
  function addCursor(parent) {
    var cursor = createElement('span', 'cursor-block', '▊');
    parent.appendChild(cursor);
    return cursor;
  }

  /**
   * Type a sequence of command/output pairs
   * lines: [{ type: 'command'|'output'|'html'|'blank', text: string }]
   */
  function typeSequence(lines, container, speed) {
    speed = speed || 35;

    if (prefersReducedMotion()) {
      lines.forEach(function (item) {
        if (item.type === 'command') {
          var line = createElement('div', 'terminal-line prompt-line');
          line.textContent = item.text;
          container.appendChild(line);
        } else if (item.type === 'output') {
          addOutput(item.text, container, item.className || '');
        } else if (item.type === 'html') {
          addHtmlOutput(item.text, container, item.className || '');
        } else if (item.type === 'blank') {
          addOutput('', container);
        }
      });
      return Promise.resolve();
    }

    var chain = Promise.resolve();
    lines.forEach(function (item) {
      chain = chain.then(function () {
        if (item.type === 'command') {
          return typeLine(item.text, container, speed).then(function () {
            return sleep(200);
          });
        }
        if (item.type === 'output') {
          addOutput(item.text, container, item.className || '');
          return sleep(item.delay || 300);
        }
        if (item.type === 'html') {
          addHtmlOutput(item.text, container, item.className || '');
          return sleep(item.delay || 300);
        }
        if (item.type === 'blank') {
          addOutput('', container);
          return sleep(150);
        }
        return sleep(0);
      });
    });

    return chain;
  }

  global.Terminal = {
    createTerminal: createTerminal,
    typeLine: typeLine,
    addOutput: addOutput,
    addHtmlOutput: addHtmlOutput,
    addCursor: addCursor,
    typeSequence: typeSequence,
    prefersReducedMotion: prefersReducedMotion,
    sleep: sleep
  };
})(window);
