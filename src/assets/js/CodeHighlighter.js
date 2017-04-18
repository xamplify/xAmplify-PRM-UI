/*
 * CodeHighlighter - a JavaScript library to highlight Code as in Notepad++
 * Copyright (C) 2015  Michael David Kuckuk
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
$.fn.highlightCode = function(codeType,htmlText) {
    var self = this;
    var functions = {
        html: function() {
            var code = htmlText;
            var HtmlRegex = /(\&lt;[a-zA-Z1-6]+(\s*[a-zA-Z1-6\-_\.]+(?:=\".*\")?)*\s*\/?\s*\&gt;)/g;
            var HtmlRegex2 = /\&lt;[a-zA-Z1-6]+(\s*[a-zA-Z1-6\-_\.]+(?:=\".*\")?)*\s*\/?\s*\&gt;/g;
            var HtmlEndRegex = /(\&lt;\/[a-zA-Z1-6]*\&gt;)/g;
            var attributeRegex = /([a-zA-Z0-9\-\_]*)=(\"[a-zA-Z0-9\-\_\s\{\}\(\)\[\]\.\/\,\=\+\#]*\")/g;
            var commentRegex1 = /(&lt;!--[\s\S]*?--&gt;)/g;
            var commentRegex2 = /(\/\/.*)/g;
            var result = code;
            if(result!=undefined){
                result = result.replace(/</g, '&lt;');
                result = result.replace(/>/g, '&gt;');
                
                result = result.replace(HtmlRegex, '<span class="htmlTag">$1</span>');
                
                var htmlAttrMatches = result.match(HtmlRegex2);
                for(var i = 0; i < htmlAttrMatches.length; i++) {
                    var attrs = htmlAttrMatches[i];
                    
                    attrs = attrs.replace(attributeRegex, '<span class="htmlAttr">$1</span>=<span class="htmlValue">$2</span>');
                    
                    result = result.replace(htmlAttrMatches[i], attrs);
                }
                
                result = result.replace(HtmlEndRegex, '<span class="htmlTag">$1</span>');
                result = result.replace(commentRegex1, '<span class="comment">$1</span>');
                result = result.replace(commentRegex2, '<span class="comment">$1</span>');
                
                result = result.replace(/\n/g, '<br />');
                result = result.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
                return result;
            }
      
        }
        
    };
    var result = functions.html();
    if(result!=undefined){
    	self.html(result);
    }
    
};

