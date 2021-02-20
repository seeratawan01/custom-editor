<template>
  <div>
    <div class="editor-container">
      <div
        @keydown="handleKeydown($event)"
        @input="handleInput($event)"
        @paste="handlePaste($event)"
        @focus="handleFocus"
        @blur="handleBlur"
        @compositionstart="handleCompositionStart($event)"
        @compositionend="handleCompositionEnd($event)"
        class="editor"
        contenteditable="true"
        data-placeholder="Enter Your Text ..."
      >
        <!-- {{ processText(plainText) }} -->
      </div>

      <textarea
        @input="handleTextArea"
        class="editor"
        v-model="plainText"
        readonly
      >
      </textarea>
    </div>
  </div>
</template>

<script>
import * as linkify from "linkifyjs";
import mention from "linkifyjs/plugins/mention";
import hashtag from "linkifyjs/plugins/hashtag";
var linkifyHtml = require("linkifyjs/html");
// import linkifyStr from "linkifyjs/string";
mention(linkify);
hashtag(linkify);

import { encode } from "html-entities";

import Cursor from "./Utils/Cursor";

let keyCode;

export default {
  name: "CEditor",
  props: {},
  data() {
    return {
      focusIn: false,
      plainText: "",
    };
  },
  methods: {
    handlePaste(e) {
      console.log("Method: handlePaste");
      e.preventDefault();

      let text = e.clipboardData.getData("text/plain");

      document.execCommand("insertText", false, this.processText(text));
    },

    handleKeydown(e) {
      console.log("Method: handleKeydown");

      keyCode = e.keyCode;
      // 13 == Enter Key
      if (e.keyCode === 13) {
        document.execCommand("insertLineBreak");
        e.preventDefault();
      }
    },

    handleInput(e) {
      console.log("Method: handleInput");
      // Setting the plain Value
      this.plainText = e.target.innerText;

      // Get caret position
      //   let c = window.getSelection().getRangeAt(0).startOffset;
      let offset = Cursor.getCurrentCursorPosition(e.target);
      console.log(offset);
      if (keyCode !== 13 && keyCode !== 32) {
        e.target.innerHTML = this.processText(encode(e.target.innerText));
        Cursor.setCurrentCursorPosition(e.target, offset);
        e.target.focus(); // blinks the cursor
      }
    },

    handleCompositionEnd(e) {
      // prevent triggering an input event for no reason
      if (!e.target.composing) {
        return;
      }
      e.target.composing = false;
    },
    handleCompositionStart(e) {
      e.target.composing = true;
    },

    handleFocus() {
      this.focusIn = true;
    },
    handleBlur() {
      this.focusIn = false;
    },

    processText(text) {
      return linkifyHtml(text, {
        className: "custom-linkified",
        attributes: {
          rel: "nofollow",
        },
        formatHref: function (href, type) {
          if (type === "hashtag") {
            href = "https://twitter.com/hashtag/" + href.substring(1);
          }

          if (type === "mention") {
            href = "https://twitter.com/" + href.substring(1);
          }
          return href;
        },
        nl2br: true,
        target: "_blank",
        // format: function (value, type) {
        //   if (type === 'url' && value.length > 50) {
        //     value = value.slice(0, 50) + '…';
        //   }
        //   return value;
        // }
      });
    },

    handleTextArea(e) {
      // Auto Resize Hack
      e.target.style.overflow = "hidden";
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    },
  },
};
</script>

<style scoped>
.editor-container {
  display: flex;
}
.editor {
  max-width: 700px;
  min-height: 100px;
  margin: 20px;
  font-size: 18px;
  font-family: inherit;
  color: gray;
  text-align: left;
  word-break: break-word;
  word-wrap: break-word;
  border: 1px solid gray;
  padding: 0.3rem;
  width: 50%;
}

textarea.editor {
  overflow: hidden;
  border-color: rgb(0, 195, 255);
}

.editor[contentEditable="true"]:empty:not(:focus):before {
  content: attr(data-placeholder);
  color: #aaa;
}
</style>>
