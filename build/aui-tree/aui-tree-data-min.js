AUI.add("aui-tree-data",function(m){var h=m.Lang,l=h.isArray,k=h.isObject,c=h.isUndefined,w="boundingBox",f="children",n="container",p=".",i="id",u="index",t="nextSibling",y="node",d="ownerTree",g="parentNode",r="prevSibling",o="previousSibling",s="tree",q="tree-node",b="tree-data",j=function(z){return(m.instanceOf(z,m.TreeNode));},e=function(z){return(m.instanceOf(z,m.TreeView));},v=m.getClassName,a=v(s,y);var x=function(){};x.ATTRS={container:{setter:m.one},children:{value:[],validator:l,setter:"_setChildren",lazyAdd:true},index:{value:{}}};m.mix(x.prototype,{initializer:function(){var z=this;z.publish("move");z.publish("append",{defaultFn:z._appendChild});z.publish("remove",{defaultFn:z._removeChild});},destructor:function(){var z=this;z.eachChildren(function(A){A.destroy();},true);},getNodeById:function(A){var z=this;return z.get(u)[A];},isRegistered:function(A){var z=this;return !!(z.get(u)[A.get(i)]);},updateReferences:function(C,D,G){var H=this;var F=C.get(g);var z=C.get(d);var E=F&&(F!==D);if(F){if(E){var A=F.get(f);m.Array.removeItem(A,C);F.set(f,A);}F.unregisterNode(C);}if(z){z.unregisterNode(C);}C.set(g,D);C.set(d,G);if(D){D.registerNode(C);}if(G){G.registerNode(C);}if(z!=G){C.eachChildren(function(I){H.updateReferences(I,I.get(g),G);});}if(E){var B=H.getEventOutputMap(C);if(!F.get("children").length){F.collapse();F.hideHitArea();}B.tree.oldParent=F;B.tree.oldOwnerTree=z;H.bubbleEvent("move",B);}},refreshIndex:function(){var z=this;z.updateIndex({});z.eachChildren(function(A){z.registerNode(A);},true);},registerNode:function(C){var z=this;var B=C.get(i);var A=z.get(u);if(B){A[B]=C;}if(e(z)){C.addTarget(z);C.set(d,z);}C._inheritOwnerTreeAttrs();z.updateIndex(A);},updateIndex:function(A){var z=this;if(A){z.set(u,A);}},unregisterNode:function(B){var z=this;var A=z.get(u);delete A[B.get(i)];if(e(z)){B.removeTarget(z);}z.updateIndex(A);},collapseAll:function(){var z=this;z.eachChildren(function(A){A.collapse();},true);},expandAll:function(){var z=this;z.eachChildren(function(A){A.expand();},true);},selectAll:function(){var z=this;z.eachChildren(function(A){A.select();},true);},unselectAll:function(){var z=this;z.eachChildren(function(A){A.unselect();},true);},eachChildren:function(C,A){var z=this;var B=z.getChildren(A);m.Array.each(B,function(D){if(D){C.apply(z,arguments);}});},eachParent:function(B){var A=this;var z=A.get(g);while(z){if(z){B.apply(A,[z]);}z=z.get(g);}},bubbleEvent:function(D,C,E,B){var A=this;A.fire(D,C);if(!E){var z=A.get(g);C=C||{};if(c(B)){B=true;}C.stopActionPropagation=B;while(z){z.fire(D,C);z=z.get(g);}}},createNode:function(A){var z=this;var B=m.TreeNode.nodeTypes[k(A)?A.type:A]||m.TreeNode;return new B(k(A)?A:{});},appendChild:function(C,B){var z=this;var A=z.getEventOutputMap(C);z.bubbleEvent("append",A,B);},_appendChild:function(G){if(G.stopActionPropagation){return false;}var z=this;var F=G.tree.node;var A=z.get(d);var D=z.get(f);z.updateReferences(F,z,A);var E=D.push(F);z.set(f,D);var C=E-2;var B=z.item(C);F._nextSibling=null;F._prevSibling=B;F.render(z.get(n));},item:function(A){var z=this;return z.get(f)[A];},indexOf:function(A){var z=this;return m.Array.indexOf(z.get(f),A);},hasChildNodes:function(){return(this.get(f).length>0);},getChildren:function(A){var z=this;var C=[];var B=z.get(f);C=C.concat(B);if(A){z.eachChildren(function(D){C=C.concat(D.getChildren(A));});}return C;},getEventOutputMap:function(A){var z=this;return{tree:{instance:z,node:A||z}};},removeChild:function(B){var z=this;var A=z.getEventOutputMap(B);z.bubbleEvent("remove",A);},_removeChild:function(D){if(D.stopActionPropagation){return false;}var z=this;var C=D.tree.node;var A=z.get(d);if(z.isRegistered(C)){C.set(g,null);z.unregisterNode(C);C.set(d,null);if(A){A.unregisterNode(C);}C.get(w).remove();var B=z.get(f);m.Array.removeItem(B,C);z.set(f,B);}},empty:function(){var z=this;z.eachChildren(function(B){var A=B.get(g);if(A){A.removeChild(B);}});},insert:function(G,D,E){var K=this;D=D||this;if(D===G){return false;}var z=D.get(g);if(G&&z){var F=G.get(w);var L=D.get(w);var J=D.get(d);if(E==="before"){L.placeBefore(F);}else{if(E==="after"){L.placeAfter(F);}}var A=[];var I=z.get(w).all("> ul > li");I.each(function(M){A.push(M.getData(q));});var H=F.get(t);G.set(t,H&&H.getData(q));var C=F.get(o);G.set(r,C&&C.getData(q));D.updateReferences(G,z,J);z.set(f,A);}G.render();var B=D.getEventOutputMap(G);B.tree.refTreeNode=D;D.bubbleEvent("insert",B);},insertAfter:function(B,A){var z=this;z.insert(B,A,"after");},insertBefore:function(B,A){var z=this;z.insert(B,A,"before");},getNodeByChild:function(B){var z=this;var A=B.ancestor(p+a);if(A){return A.getData(q);}return null;},_inheritOwnerTreeAttrs:h.emptyFn,_setChildren:function(B){var z=this;var D=[];var A=z.get(n);if(!A){A=z._createNodeContainer();}var C=z;if(j(z)){C=z.get(d);}z.updateIndex({});m.Array.each(B,function(G,E){if(G){if(!j(G)&&k(G)){G[d]=C;G[g]=z;var F=G[f];delete G[f];G=z.createNode(G);if(F&&F.length){m.setTimeout(function(){G.setAttrs({leaf:false,children:F});},50);}}if(e(C)){C.registerNode(G);}G.render(A);if(m.Array.indexOf(D,G)===-1){D.push(G);}}});return D;}});m.TreeData=x;},"@VERSION@",{requires:["aui-base","aui-task-manager"],skinnable:false});