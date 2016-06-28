
declare module mx {
	
	interface mx{
		appUrl: string;
		baseUrl :string;
		modulePath :string
		addOnLoad(callback:Function);
		login(username:string, password:string, onSuccess:Function, onError:Function);
		logout();    
		data: mx.data;
		meta: mx.meta;
		parser: mx.parser;
		server: mx.server;
		session: mx.session;
		ui: mx.ui;
		onError(error):void;
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
			error?: Function,
			onValidation?: Function,
		}, scope?: any): void;
		commit(args: {
			mxobj: mendix.lib.MxObject,
			callback: Function,
			error?: Function,
			onValidation?: Function
		}, scope?: Object);
		create(arg: {
			entity: string,
			callback: Function,
			error: Function,			
		}, scope?: Object);
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
			error: Function,
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
		getBacktrackConstraints(metaobj, context, callback):void;
		release(objs: mendix.lib.MxObject | mendix.lib.MxObject[]);
		remove(arg:{
			guid?: string,
			guids?: string[],
			callback: Function,
			error: Function			
		}, scope?:Object):void;
		rollback(args:{
			mxobj: mendix.lib.MxObject;
			callback: Function,
			error: Function,
			
		}, scope?:Object):void;
		save(args:{
			mxobj?: mendix.lib.MxObject;
			callback?: Function,
			error?: Function,
			
		}, scope?:Object):void;
		subscribe(args:{
			guid?: string,
			entity?:string,
			attr?: string,
			val?: boolean,
			callback: Function			
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
		action(name, params, scope):void;
		back():void;
		confirmation(args: {content:string, proceed:string, cancel:string, handler:Function}):void;
		error(msg:string, modal?);
		exception(msg);
		getTemplate():HTMLElement;
		showProgress():number;
		hideProgress(pid:number);
		info(msg, modal);	
		onError(error);
		showUnderlay(delay?:number);
		hideUnderlay(delay?:number);
		resize():void;
		isRtl():string;
	}
}
