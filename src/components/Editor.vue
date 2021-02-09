<template>
  <div>
    <div class="counter">Count: {{character_count }} Limit: {{this.max}}</div>
    <div class="editor-container">
      <textarea
          contenteditable="true"
          class="editor"
          name="single-box"
          id="single-box"
          @input="type($event)"
      ></textarea>
      <div
          class='editor'
          id='clonedEditor'
          data-placeholder='Clone...'
      >
        <span class="desc"></span>
        <span class="exceed"></span>
      </div>
    </div>

  </div>
</template>

<script>
import * as linkify from 'linkifyjs'
import mention from 'linkifyjs/plugins/mention'
import hashtag from 'linkifyjs/plugins/hashtag'
// var linkifyHtml = require('linkifyjs/html')
mention(linkify)
hashtag(linkify)

import linkifyStr from 'linkifyjs/string';


export default {
  name: "Editor",
  props: {
    max: {
      default: 250
    }
  },
  data () {
    return {
      character_count: 0
    }
  },
  components: {

  },
  methods: {
    type(e) {

      let cloneBlock = document.getElementById('clonedEditor')
      let ch_length = e.target.value.length;
      this.character_count = ch_length;

      // Removing remaing exceed charater
      if(cloneBlock.childNodes[1].innerHTML.length && ch_length <= this.max) {
          cloneBlock.childNodes[1].innerHTML = ""
      }

      if(ch_length > this.max) {
        this.replaceInnerHTML(cloneBlock, e.target.value, 1)
      } else {
       this.replaceInnerHTML(cloneBlock, e.target.value, 0)
      }

      // Auto Resize Hack
      e.target.style.overflow = 'hidden';
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + 'px';
    },
    replaceInnerHTML(oldDiv, text, node = 0) {
      let newDiv = oldDiv.cloneNode(true);
      
      if(node === 0) {
        newDiv.childNodes[0].innerHTML = this.processTextHtml(text);
        
      } else {
        newDiv.childNodes[0].innerHTML = this.processTextHtml(text.substring(0, this.max));
        newDiv.childNodes[1].innerHTML = this.processTextHtml(text.substring(this.max, text.length));
      }
  
      oldDiv.parentNode.replaceChild(newDiv, oldDiv);
    },
    processTextHtml (text) {
      return linkifyStr(text, {
        className: 'custom-linkified',
        attributes: {
          rel: 'nofollow'
        },
        formatHref: function (href, type) {
          if (type === 'hashtag') {
            href = 'https://twitter.com/hashtag/' + href.substring(1)
          }

          if (type === 'mention') {
            href = 'https://twitter.com/' + href.substring(1)
          }
          return href
        },
         nl2br: true,
        target: '_blank',
        // format: function (value, type) {
        //   if (type === 'url' && value.length > 50) {
        //     value = value.slice(0, 50) + '…';
        //   }
        //   return value;
        // }
      })
    }
  }
}
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

#title:empty:before, #editor:empty:before {
  content:  attr(data-placeholder);
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
border: 1px solid gray;
padding: 0.3rem;
}
.editor > li {
   list-style: square;
   margin: initial
 }
#title {
    width: 95%;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 135px;
    font-size: 40px;
  }
.editor:focus, #title:focus {
     outline: none;
   }
#title:empty:before, .editor:empty:before {
      content:  attr(data-placeholder);
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
       font-family: 'Courier New', Courier, monospace;
       overflow: auto;
       color: white;
       padding: 8px;
     }
</style>