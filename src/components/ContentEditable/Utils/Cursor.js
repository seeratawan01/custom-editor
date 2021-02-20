class Cursor {


    static getCurrentCursorPosition(parentElement) {
        // var selection = window.getSelection(),
        //     charCount = -1,
        //     node;

        // if (selection.focusNode) {
        //     if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        //         node = selection.focusNode;
        //         charCount = selection.focusOffset;

        //         while (node) {
        //             if (node === parentElement) {
        //                 break;
        //             }

        //             if (node.previousSibling) {
        //                 node = node.previousSibling;
        //                 charCount += node.textContent.length;
        //             } else {
        //                 node = node.parentNode;
        //                 if (node === null) {
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // }

        // return charCount;

        // var caretOffset = 0;
        // var doc = parentElement.ownerDocument || parentElement.document;
        // var win = doc.defaultView || doc.parentWindow;
        // var sel;
        // if (typeof win.getSelection != "undefined") {
        //     sel = win.getSelection();
        //     if (sel.rangeCount > 0) {
        //         var range = win.getSelection().getRangeAt(0);
        //         var preCaretRange = range.cloneRange();
        //         preCaretRange.selectNodeContents(parentElement);
        //         preCaretRange.setEnd(range.endContainer, range.endOffset);
        //         caretOffset = preCaretRange.toString().length;
        //     }
        // } else if ((sel = doc.selection) && sel.type != "Control") {
        //     var textRange = sel.createRange();
        //     var preCaretTextRange = doc.body.createTextRange();
        //     preCaretTextRange.moveToElementText(parentElement);
        //     preCaretTextRange.setEndPoint("EndToEnd", textRange);
        //     caretOffset = preCaretTextRange.text.length;
        // }
        // return caretOffset;

        // Fit 
        // const range = document.getSelection().getRangeAt(0);
        // return {
        //     start: {
        //         container: Cursor.pathFromNode(range.startContainer, parentElement),
        //         offset: range.startOffset
        //     },
        //     end: {
        //         container: Cursor.pathFromNode(range.endContainer, parentElement),
        //         offset: range.endOffset
        //     }
        // };

        var ie = (typeof document.selection != "undefined" && document.selection.type != "Control") && true;
        var w3 = (typeof window.getSelection != "undefined") && true;

        var caretOffset = 0;
        if (w3) {
            var range = window.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(parentElement);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        } else if (ie) {
            var textRange = document.selection.createRange();
            var preCaretTextRange = document.body.createTextRange();
            preCaretTextRange.moveToElementText(parentElement);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    static nodeFromPath(path, reference) {
        if (path.length === 0) {
            return reference;
        } else {
            const [index, ...rest] = path;
            const next = reference.childNodes[index];
            return Cursor.nodeFromPath(rest, next);
        }
    }

    static pathFromNode(node, reference) {
        function traverse(node, acc) {
            if (node === reference) {
                return acc;
            } else {
                const parent = node.parentNode;
                const index = [...parent.childNodes].indexOf(node);
                return traverse(parent, [index, ...acc]);
            }
        }
        return traverse(node, []);
    }

    static setCurrentCursorPosition(element, chars) {
        if (chars >= 0) {
            var selection = window.getSelection();

            let range = Cursor._createRange(element, { count: chars });

            if (range) {
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        // Fit Solutin
        //     const range = document.createRange();
        //     range.setStart(Cursor.nodeFromPath(start.container, el), start.offset);
        //     range.setEnd(Cursor.nodeFromPath(end.container, el), end.offset);
        //     let sel = document.getSelection();
        //     sel.removeAllRanges();
        //     sel.addRange(range);
    }

    static _createRange(node, chars, range) {
        if (!range) {
            range = document.createRange()
            range.selectNode(node);
            range.setStart(node, 0);
        }

        if (chars.count === 0) {
            range.setEnd(node, chars.count);
        } else if (node && chars.count > 0) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.length < chars.count) {
                    chars.count -= node.textContent.length;
                } else {
                    range.setEnd(node, chars.count);
                    chars.count = 0;
                }
            } else {
                for (var lp = 0; lp < node.childNodes.length; lp++) {
                    range = Cursor._createRange(node.childNodes[lp], chars, range);

                    if (chars.count === 0) {
                        break;
                    }
                }
            }
        }

        return range;
    }

    static _isChildOf(node, parentElement) {
        while (node !== null) {
            if (node === parentElement) {
                return true;
            }
            node = node.parentNode;
        }

        return false;
    }
}

export default Cursor