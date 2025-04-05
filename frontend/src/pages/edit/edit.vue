<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { exampleSetup } from 'prosemirror-example-setup';
import { defaultMarkdownSerializer, schema } from 'prosemirror-markdown';
import { DOMParser, Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useRoute, useRouter } from 'vue-router';

import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';
import { renderMarkdown } from '../../shared/helpers/render-markdown';
import { titleRules } from '../../shared/helpers/validator-document-title-rules';
import { useTreeStore } from '../../shared/stores/use-tree-store';
import { useUserStore } from '../../shared/stores/use-user-store';

const route  = useRoute();
const router = useRouter();

const userStore = useUserStore();
const treeStore = useTreeStore();

const path           = ref<string>('');
const isValid        = ref<boolean>(false);
const targetDocument = ref<Document | null>(null);
const title          = ref<string>('');
const isOpenedDialog = ref<boolean>(false);
const errorMessage   = ref<string>('');

const editor = ref<HTMLDivElement | null>(null);
let editorView: EditorView | null = null;

const onSave = async () => {
  const getMarkdown = () => editorView == null ? '' : defaultMarkdownSerializer.serialize(editorView.state.doc);
  
  try {
    errorMessage.value = '';
    
    const documentToSave = targetDocument.value!;
    documentToSave.title         = title.value;
    documentToSave.content       = getMarkdown();
    documentToSave.updatedUserId = userStore.user.id;
    delete documentToSave.createdAt;
    delete documentToSave.createdUserId;
    delete documentToSave.updatedAt;
    
    const response = await fetch(`/api/documents/${documentToSave.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentToSave)
    });
    const json: Result<Document> = await response.json();
    if(json.error != null) {
      console.error('Failed To Save Document', json);
      errorMessage.value = `ドキュメントの保存に失敗しました : ${json.code} ${json.error}`;
      return;
    }
    
    console.log('Document Saved', json);
    router.push(`/wiki/${path.value}`);
  }
  catch(error: any) {
    console.error('Save Document : Unknown Error', error);
    errorMessage.value = `ドキュメントの保存に失敗しました : ${error.toString()}`;
  }
};

onMounted(async () => {
  const fetchDocument = async (): Promise<Result<Document>> => {
    path.value = (route.params.catchAll as string ?? '').replace(/(?<!^)(\/*)$/, '');
    
    try {
      const response = await fetch(`/api/documents/${path.value}`, { method: 'GET' });
      const json: Result<Document> = await response.json();
      if(json.error != null) {
        console.error('Failed To Fetch Document', json);
        return json;
      }
      
      console.log('Document Fetched', json);
      return json;
    }
    catch(error: any) {
      console.error('Fetch Document : Unknown Error', error);
      return { error: error.toString() };
    }
  };
  
  /** 表示対象ページまでのツリーを取得しマージする (本画面が初期表示の場合も考慮して) */
  const fetchTree = async (targetDocumentId: string): Promise<Result<boolean>> => {
    try {
      const response = await fetch(`/api/tree/to-root?targetDocumentId=${targetDocumentId}`, { method: 'GET' });
      const json: Result<Array<TreeItem>> = await response.json();
      if(json.error != null) {
        console.warn('Failed To Fetch tree');  // ツリー表示がうまくいかない場合は無視
        return json;
      }
      
      treeStore.mergeTree(json.result);
      return { result: true };
    }
    catch(error: any) {
      console.warn('Fetch Tree : Unknown Error', error);  // ツリー表示がうまくいかない場合は無視
      return { error: error.toString(), code: 500 };
    }
  };
  
  const markdownToProseMirrorDoc = (markdown: string): Node => {
    const html = renderMarkdown(markdown);
    const element = window.document.createElement('div');
    element.innerHTML = html;
    return DOMParser.fromSchema(schema).parse(element);
  };
  
  const fetchedDocumentResult = await fetchDocument();
  if(fetchedDocumentResult.error != null) return router.push('/');
  
  targetDocument.value = fetchedDocumentResult.result;
  title.value          = fetchedDocumentResult.result.title!;
  
  // ツリー表示とマージ処理を非同期に行う・うまくいかない場合も中断しない
  fetchTree(fetchedDocumentResult.result.id!);
  
  editorView = new EditorView(editor.value as HTMLDivElement, {
    state: EditorState.create({
      doc: markdownToProseMirrorDoc(fetchedDocumentResult.result.content!),
      plugins: exampleSetup({schema})
    }),
    dispatchTransaction: transaction => {
      if(editorView == null) return;
      const newState = editorView.state.apply(transaction);
      editorView.updateState(newState);
    }
  });
});

onBeforeUnmount(() => {
  if(editorView != null) editorView.destroy();
});
</script>

<template>
  <v-form v-model="isValid" class="header-form">
    <v-text-field v-model="title" :rules="titleRules" label="タイトル" required density="compact" />
    <v-btn :disabled="!isValid" @click="onSave">保存</v-btn>
  </v-form>
  <div ref="editor" class="editor" spellcheck="false" />
  
  <v-dialog v-model="isOpenedDialog">
    <v-sheet>
      <v-sheet class="my-3 mx-3">
        <v-alert type="error" density="compact" :text="errorMessage" />
        <p class="text-right"><v-btn @click="isOpenedDialog = false">Close</v-btn></p>
      </v-sheet>
    </v-sheet>
  </v-dialog>
</template>

<style scoped>
.header-form {
  display: flex;
  column-gap: 1rem;
}

.editor {
  height: calc(100% - 100px);
  padding: 0;
}
</style>

<style>
/* Customized */

.ProseMirror-menubar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  overflow-y: scroll;
}
.ProseMirror-menubar {
  flex-grow: 0;  /* 伸ばさない */
  flex-shrink: 0;  /* 内容物の折り返しに応じて高さを可変する */
  position: sticky !important;
  padding: 3px 6px 1px !important;
}
.ProseMirror {
  flex-grow: 1;
  cursor: text;
}


/*
 * Styles taken from https://prosemirror.net/css/editor.css
 * Required for ProseMirror to work (style) correctly.
 */
.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

.ProseMirror li {
  position: relative;
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}
.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}
.ProseMirror-hideselection {
  caret-color: transparent;
}

.ProseMirror-selectednode {
  outline: 2px solid #8cf;
}

/* Make sure li selections wrap around markers */

li.ProseMirror-selectednode {
  outline: none;
}

li.ProseMirror-selectednode:after {
  content: '';
  position: absolute;
  left: -32px;
  right: -2px;
  top: -2px;
  bottom: -2px;
  border: 2px solid #8cf;
  pointer-events: none;
}
.ProseMirror-textblock-dropdown {
  min-width: 3em;
}

.ProseMirror-menu {
  margin: 0 -4px;
  line-height: 1;
}

.ProseMirror-tooltip .ProseMirror-menu {
  width: -webkit-fit-content;
  width: fit-content;
  white-space: pre;
}

.ProseMirror-menuitem {
  margin-right: 3px;
  display: inline-block;
}

.ProseMirror-menuseparator {
  border-right: 1px solid #ddd;
  margin-right: 3px;
}

.ProseMirror-menu-dropdown,
.ProseMirror-menu-dropdown-menu {
  font-size: 90%;
  white-space: nowrap;
}

.ProseMirror-menu-dropdown {
  vertical-align: 1px;
  cursor: pointer;
  position: relative;
  padding-right: 15px;
}

.ProseMirror-menu-dropdown-wrap {
  padding: 1px 0 1px 4px;
  display: inline-block;
  position: relative;
}

.ProseMirror-menu-dropdown:after {
  content: '';
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
  opacity: 0.6;
  position: absolute;
  right: 4px;
  top: calc(50% - 2px);
}

.ProseMirror-menu-dropdown-menu,
.ProseMirror-menu-submenu {
  position: absolute;
  background: white;
  color: #666;
  border: 1px solid #aaa;
  padding: 2px;
}

.ProseMirror-menu-dropdown-menu {
  z-index: 15;
  min-width: 6em;
}

.ProseMirror-menu-dropdown-item {
  cursor: pointer;
  padding: 2px 8px 2px 4px;
}

.ProseMirror-menu-dropdown-item:hover {
  background: #f2f2f2;
}

.ProseMirror-menu-submenu-wrap {
  position: relative;
  margin-right: -4px;
}

.ProseMirror-menu-submenu-label:after {
  content: '';
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 4px solid currentColor;
  opacity: 0.6;
  position: absolute;
  right: 4px;
  top: calc(50% - 4px);
}

.ProseMirror-menu-submenu {
  display: none;
  min-width: 4em;
  left: 100%;
  top: -3px;
}

.ProseMirror-menu-active {
  background: #eee;
  border-radius: 4px;
}

.ProseMirror-menu-active {
  background: #eee;
  border-radius: 4px;
}

.ProseMirror-menu-disabled {
  opacity: 0.3;
}

.ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu,
.ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {
  display: block;
}

.ProseMirror-menubar {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  position: relative;
  min-height: 1em;
  color: #666;
  padding: 1px 6px;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid silver;
  background: white;
  z-index: 10;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  overflow: visible;
}

.ProseMirror-icon {
  display: inline-block;
  line-height: 0.8;
  vertical-align: -2px;  /* Compensate for padding */
  padding: 2px 8px;
  cursor: pointer;
}

.ProseMirror-menu-disabled.ProseMirror-icon {
  cursor: default;
}

.ProseMirror-icon svg {
  fill: currentColor;
  height: 1em;
}

.ProseMirror-icon span {
  vertical-align: text-top;
}
.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
}

.ProseMirror-gapcursor:after {
  content: '';
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

/* Add space around the hr to make clicking it easier */

.ProseMirror-example-setup-style hr {
  padding: 2px 10px;
  border: none;
  margin: 1em 0;
}

.ProseMirror-example-setup-style hr:after {
  content: '';
  display: block;
  height: 1px;
  background-color: silver;
  line-height: 2px;
}

.ProseMirror ul,
.ProseMirror ol {
  padding-left: 30px;
}

.ProseMirror blockquote {
  padding-left: 1em;
  border-left: 3px solid #eee;
  margin-left: 0;
  margin-right: 0;
}

.ProseMirror-example-setup-style img {
  cursor: default;
}

.ProseMirror-prompt {
  background: white;
  padding: 5px 10px 5px 15px;
  border: 1px solid silver;
  position: fixed;
  border-radius: 3px;
  z-index: 11;
  box-shadow: -0.5px 2px 5px rgba(0, 0, 0, 0.2);
}

.ProseMirror-prompt h5 {
  margin: 0;
  font-weight: normal;
  font-size: 100%;
  color: #444;
}

.ProseMirror-prompt input[type='text'],
.ProseMirror-prompt textarea {
  background: #eee;
  border: none;
  outline: none;
}

.ProseMirror-prompt input[type='text'] {
  padding: 0 4px;
}

.ProseMirror-prompt-close {
  position: absolute;
  left: 2px;
  top: 1px;
  color: #666;
  border: none;
  background: transparent;
  padding: 0;
}

.ProseMirror-prompt-close:after {
  content: 'âœ•';
  font-size: 12px;
}

.ProseMirror-invalid {
  background: #ffc;
  border: 1px solid #cc7;
  border-radius: 4px;
  padding: 5px 10px;
  position: absolute;
  min-width: 10em;
}

.ProseMirror-prompt-buttons {
  margin-top: 5px;
  display: none;
}
#editor,
.editor {
  background: white;
  color: black;
  background-clip: padding-box;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  padding: 5px 0;
  margin-bottom: 23px;
}

.ProseMirror p:first-child,
.ProseMirror h1:first-child,
.ProseMirror h2:first-child,
.ProseMirror h3:first-child,
.ProseMirror h4:first-child,
.ProseMirror h5:first-child,
.ProseMirror h6:first-child {
  margin-top: 10px;
}

.ProseMirror {
  padding: 4px 8px 4px 14px;
  line-height: 1.2;
  outline: none;
}

.ProseMirror p {
  margin-bottom: 1em;
}
</style>
