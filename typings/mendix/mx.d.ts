
declare module mx {
	
	interface mx{
		appUrl: string;
		baseUrl :string;
		modulePath :string
		addOnLoad(callback:Function): void;
		login(username:string, password:string, onSuccess:Function, onError:Function): void;
		logout():void;    
		data: mx.data;
		meta: mx.meta;
		parser: mx.parser;
		server: mx.server;
		session: mx.session;
		ui: mx.ui;
		onError(error: Error):void;
	}
	
	interface data {
		action(action: {
			params: {
				actionname: string,
				applyto?: string,
				guids?: string[],
				xpath?: string,
				constraints?: string,
				sort?: any,
				gridid?: string,
			},
			context?: any,
			store?: any,
			async?: boolean,
			callback?: Function,
			error?: (e:Error) => void,
			onValidation?: Function,
		}, scope?: any): void;
		commit(args: {
			mxobj: mendix.lib.MxObject,
			callback: Function,
			error?: (e:Error) => void,
			onValidation?: Function
		}, scope?: Object): void;
		create(arg: {
			entity: string,
			callback: (obj: mendix.lib.MxObject) => void,
			error: (e: Error) => void,			
		}, scope?: Object): void;
		createXPathString(arg:{entity: string, context:any, collback:Function}):void;
		get(args:{
			guid?: string,
			guids?: string[],
			xpath?: string,
			microflow?: string,
			noCache?: boolean,
			count?: boolean,
			path?: string,
			callback: Function,
			error: (e:Error) => void,
			filter?:{
				id:string,
				attributes: any[],
				offset: number,
				sort: any[],
				amount:number,
				distinct: boolean,
				references: Object
			}
		}, scope?:Object):void;
		getBacktrackConstraints(metaobj: any, context: any, callback: Function):void;
		release(objs: mendix.lib.MxObject | mendix.lib.MxObject[]): void;
		remove(arg:{
			guid?: string,
			guids?: string[],
			callback: Function,
			error: (e:Error) => void			
		}, scope?:Object):void;
		rollback(args:{
			mxobj: mendix.lib.MxObject;
			callback: Function,
			error: (e:Error) => void,
			
		}, scope?:Object):void;
		save(args:{
			mxobj?: mendix.lib.MxObject;
			callback?: Function,
			error?: (e:Error) => void,
			
		}, scope?:Object):void;
		subscribe(args:{
			guid?: string,
			entity?:string,
			attr?: string,
			val?: boolean,
			callback: (guid: number, attr: string, attrValue: any) => void,			
		}):number;
		unsubscribe(handle: number): void;
		update(args:{
			guid?: string,
			entity?:string,
			attr?: string,
		}):void;
		
		
	}

	interface meta {

	}
    interface parser {

	}
    interface server {

	}
    interface session {

	}
    interface ui {
		action(name: string, params?: {progress: string, progressMsg:string}, scope?:any):void;
		back():void;
		confirmation(args: {content:string, proceed:string, cancel:string, handler:Function}):void;
		error(msg:string, modal?: boolean): void;
		exception(msg: string): void;
		getTemplate():HTMLElement;
		showProgress():number;
		hideProgress(pid:number): void;
		info(msg: string, modal: boolean): void;	
		onError(error: Error):void;
		showUnderlay(delay?:number):void;
		hideUnderlay(delay?:number):void;
		resize():void;
		isRtl():string;
	}
}
