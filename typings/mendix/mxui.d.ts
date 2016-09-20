/// <reference path="../dojo/dijit.d.ts"/>

declare module mxui {
	
	module widget {
		
		class _WidgetBase extends dijit._WidgetBase {
			readOnly: boolean;
			uninitialize(): void;
			subscribe(args: {
				guid: string,
				entity?: string,
				attr?: string,
				val?: boolean,
				callback: Function
			}): number;
			// refresh(callback?: Function);
			unsubscribeAll(): void;
			mxcontext: mendix.lib.MxContext;		
			mxform: mxui.lib.form._FormBase;
			classes: string;
			update(obj: mendix.lib.MxObject, callback?: Function): void;
			connect(node: HTMLElement, event: string, callback: Function): any;
		}

		class _Button extends _WidgetBase {
			caption: string;
			iconUrl: string;
			iconVisible: boolean;
			updateOptions(attrs: string[], obj: mendix.lib.MxObject, callback?: Function): void;
		}
		
		class Progress extends _WidgetBase {
			_msgNode:HTMLElement;
			_messages:any[];
			add(message:string, modal:boolean): number;
			remove(msgId: number):void;			
		}
	}
	
	module lib {
		
		module form {
			
			class _FormBase {
				constructor();
				domNode: HTMLElement;
				id: string;
				path: string;
				title: string;
				callRecursive(method: string, ...param: any[]): void;
				commit(callback: Function, error?: Function): void;
				getChildren(nested: boolean): dijit._WidgetBase[];
				listen(): number;
				publish(message: string, callback: Function, error: Function): void;
				rollback(callback: Function, error?: Function): void;
				save(callback: Function, error?: (error: Error)=> void): void;
				unlisten(handle: number): void;
				validate(callback: Function, error?: Function): void;
			}
			
			class InlineForm {				
				constructor();
				destroy():void;				
			}
		}
	}

	interface dom {	
		/**
		* Add a link to the given stylesheet to a document.
		* @param path	path of the stylesheet location
		* @param doc	document to add the stylesheet link to. Defaults to document.
		* @media media	string describing the media types supported by the stylesheet
		* 
		*/
		addCss(path: string, doc?: Document, media?: string): void;
		create(element: string, props?: Object, ...children: HTMLElement[]): HTMLElement;
		disableNode(node: HTMLElement): HTMLElement;
		enableNode(node: HTMLElement): HTMLElement;
		escapeString(string: string): string;
		getCss(path: string, doc?: Document): HTMLElement;
		getCursorPosition(input: HTMLInputElement): number;
		getSelectedText(node: HTMLSelectElement): string;
		getSelectedValue(node: HTMLSelectElement): string;
		getSelection(input: HTMLInputElement): { start: number, end: number };
		removeCss(filepath: string, doc?: Document): boolean;
		selectTextRange(input: HTMLInputElement, selectionStart: number, selectionEnd: number): void;
		setSelectOptions(node: HTMLSelectElement, options: Object, selected: string): void;

	}
	
	module html {
		interface parser {
			instantiate(list:HTMLElement[], defaults: Object): mxui.widget._WidgetBase[];
			parse(root:HTMLElement, defaults: Object) : mxui.widget._WidgetBase[];
		}
	}
}

declare module "mxui/widget/_WidgetBase"
{
	var _WidgetBase: typeof mxui.widget._WidgetBase;
	export = _WidgetBase;
}


declare module "mxui/dom"
{
	var array: mxui.dom;
	export = array;
}

