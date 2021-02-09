<template>
  <div>
    <Toolbar/>
    <div class="editor-container">
      <textarea
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
        <span class="desc"></span><span class="exceed"></span>
      </div>
    </div>

  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import * as linkify from 'linkifyjs'
import mention from 'linkifyjs/plugins/mention'
import hashtag from 'linkifyjs/plugins/hashtag'
// var linkifyHtml = require('linkifyjs/html')
mention(linkify)
hashtag(linkify)

import linkifyStr from 'linkifyjs/string';



export default {
  name: "Editor",
  data () {
    return {

    }
  },
  components: {
    Toolbar
  },
  methods: {
    type(e) {
      let cloneBlock = document.getElementById('clonedEditor')

      this.replaceInnerHTML(cloneBlock, this.processTextHtml(e.target.value))
    },
    replaceInnerHTML(oldDiv, html) {
      let newDiv = oldDiv.cloneNode(true);
      newDiv.childNodes[0].innerHTML = html;
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
.editor-container {
  position: relative;
}



#title:empty:before, #editor:empty:before {
  content:  attr(data-placeholder);
  color: gray;
}
.editor {
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