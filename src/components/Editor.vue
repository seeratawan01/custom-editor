<template>
  <div>
    <div class="counter">
      Count: {{ character_count }} Limit: {{ this.max }}
    </div>
    <div class="editor-container">
      <textarea :value="value" class="editor" @input="type($event)"></textarea>

      <div class="editor" id="clonedEditor" data-placeholder="Clone...">
        <span class="desc"></span>
        <span class="exceed"></span>
      </div>
    </div>
  </div>
</template>

<script>
import * as linkify from "linkifyjs";
import mention from "linkifyjs/plugins/mention";
import hashtag from "linkifyjs/plugins/hashtag";
// var linkifyHtml = require('linkifyjs/html')
import linkifyStr from "linkifyjs/string";
mention(linkify);
hashtag(linkify);

import anchorme from "anchorme";

import { encode } from "html-entities";

export default {
  name: "Editor",
  props: {
    max: {
      default: 250,
    },
    value: {
      default: "",
    },
  },
  data() {
    return {
      character_count: 0,
    };
  },
  components: {},
  methods: {
    type(e) {
      let cloneBlock = document.getElementById("clonedEditor");
      let ch_length = e.target.value.length;
      this.character_count = ch_length;

      // Removing remaing exceed charater
      if (cloneBlock.childNodes[1].innerHTML.length && ch_length <= this.max) {
        cloneBlock.childNodes[1].innerHTML = "";
      }

      if (ch_length > this.max) {
        this.replaceInnerHTML(cloneBlock, e.target.value, 1);
      } else {
        this.replaceInnerHTML(cloneBlock, e.target.value, 0);
      }

      // Auto Resize Hack
      e.target.style.overflow = "hidden";
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";

      this.$emit("input", e.target.value);
    },
    replaceInnerHTML(oldDiv, text, node = 0) {
      let newDiv = oldDiv.cloneNode(true);

      // console.log(
      //   text.trim().substring(0, text.trim().lastIndexOf(" ") + 1) +
      //     this.processTextHtml(this.getLastWord(text))
      // );

      // console.log(this.processWord(this.getLastWord(text)));

      if (node === 0) {
        newDiv.childNodes[0].innerHTML = this.processTextHtmlWithAnchorme(text);
      } else {
        newDiv.childNodes[0].innerHTML = this.processTextHtmlWithAnchorme(
          text.substring(0, this.max)
        );
        newDiv.childNodes[1].innerHTML = this.processTextHtmlWithAnchorme3;
        3(text.substring(this.max, text.length));
      }

      oldDiv.parentNode.replaceChild(newDiv, oldDiv);
    },
    processWord(word) {
      const procesedWord = linkify.find(word);
      if (procesedWord.length === 0) {
        return null;
      } else {
        return procesedWord[0].type;
      }
    },
    processTextHtmlWithLinkify(text) {
      return linkifyStr(text, {
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
        // nl2br: true,
        target: "_blank",
        // format: function (value, type) {
        //   if (type === 'url' && value.length > 50) {
        //     value = value.slice(0, 50) + '…';
        //   }
        //   return value;
        // }
      });
    },

    processTextHtmlWithAnchorme(text) {
      return anchorme({
        input: encode(text),
        // use some options
        options: {
          attributes: {
            target: "_blank",
            class: "detected",
          },
        },
        // and extensions
        extensions: [
          // an extension for hashtag search
          {
            test: /#(\w|_)+/gi,
            transform: (string) =>
              `<a href='https://twitter.com/hashtag/${string.substring(
                1
              )}'>${string}</a>`,
          },
          // an extension for mentions
          {
            test: /@(\w|_)+/gi,
            transform: (string) =>
              `<a href='https://twitter.com/${string.substring(
                1
              )}'>${string}</a>`,
          },
        ],
      });
    },
    getLastWord(words) {
      let wordStr = words.trim();
      return wordStr.substring(wordStr.length, wordStr.lastIndexOf(" ") + 1);
    },

    /**
     * Return an object with the selection range or cursor position (if both have the same value)
     * @param {DOMElement} el A dom element of a textarea or input text.
     * @return {Object} reference Object with 2 properties (start, end, length) with the identifier of the location of the cursor and selected text.
     **/
    getInputSelection(el) {
      var start = 0,
        end = 0,
        normalizedValue,
        range,
        textInputRange,
        len,
        endRange,
        val,
        nearestWord;

      val = el.value.trim();
      if (
        typeof el.selectionStart == "number" &&
        typeof el.selectionEnd == "number"
      ) {
        start = el.selectionStart;
        end = el.selectionEnd;
      } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
          len = el.value.length;
          normalizedValue = el.value.replace(/\r\n/g, "\n");

          // Create a working TextRange that lives only in the input
          textInputRange = el.createTextRange();
          textInputRange.moveToBookmark(range.getBookmark());

          // Check if the start and end of the selection are at the very end
          // of the input, since moveStart/moveEnd doesn't return what we want
          // in those cases
          endRange = el.createTextRange();
          endRange.collapse(false);

          if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
            start = end = len;
          } else {
            start = -textInputRange.moveStart("character", -len);
            start += normalizedValue.slice(0, start).split("\n").length - 1;

            if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
              end = len;
            } else {
              end = -textInputRange.moveEnd("character", -len);
              end += normalizedValue.slice(0, end).split("\n").length - 1;
            }
          }
        }
      }

      console.log(
        val.charAt(end),
        val.substring(0, end).trim().lastIndexOf(" ") + 1,
        val.substring(end, el.value.length)
      );

      if (val.charAt(end) === "") {
        nearestWord = val
          .substring(end, val.substring(0, end).trim().lastIndexOf(" ") + 1)
          .trim();
      } else {
        nearestWord = val
          .substring(
            val.substring(0, end).trim().lastIndexOf(" ") + 1,
            val.substring(end, el.value.length).indexOf(" ") + 1
          )
          .trim();
      }

      return {
        start: start,
        end: end,
        length: el.value.length,
        nearestWord: nearestWord,
      };
    },
  },
};
</script>

<style >
.counter {
  margin-top: 1rem;
}
.editor-container {
  position: relative;
}

.exceed {
  background: #f9141469;
}

#title:empty:before,
#editor:empty:before {
  content: attr(data-placeholder);
  color: gray;
}

.editor {
  resize: none;
  width: 95%;
  max-width: 700px;
  min-height: 100px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  font-size: 18px;
  font-family: inherit;
  color: gray;
  text-align: left;
  word-break: break-word;
  word-wrap: break-word;
  border: 1px solid transparent;
  padding: 0.3rem;
  position: absolute;
  top: 0;
  left: 0;
}

.editor > * {
  white-space: pre-wrap;
}

.editor * {
  margin: 0 !important;
}

textarea {
  color: transparent !important;
  background: transparent !important;
  border: 1px solid gray !important;
  caret-color: red;
  z-index: 1;
}

.editor:focus {
  outline: none;
}
#title:empty:before,
.editor:empty:before {
  content: attr(data-placeholder);
  color: gray;
}

.codeBlock {
  background-color: rgb(21, 34, 75);
  margin-left: auto;
  margin-right: auto;
  margin-top: 0;
  margin-bottom: 0;
  height: auto;
  min-height: 39px;
  font-family: "Courier New", Courier, monospace;
  overflow: auto;
  color: white;
  padding: 8px;
}
</style>