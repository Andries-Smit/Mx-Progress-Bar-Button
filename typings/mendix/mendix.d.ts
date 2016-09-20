
declare module mendix {
	module lib {
		class MxError {
			constructor(message: string, original: any);
		}
		class MxObject extends MxMetaObject {
			addReference(attr: string, guid: string | number): boolean;
			addReferences(attr: string, guids: string[] | number[]): boolean;
			compare(mxobj: mendix.lib.MxObject): boolean;
			fetch(path: string, callback: Function): void;
			get(attr: string): string | number | boolean; //add external big	
			removeReferences(attr:string, guids: string[]): boolean;
			set(attr: string, val: any): boolean;
			FetchCallback(requested: any): void;
			// setTrackEntity(entity: string): void;
			// setTrackId(guid: string): void;
			// setTrackObject(obj: mendix.lib.MxObject): void;
		}

		class MxContext {
			constructor();
			getTrackEntity(): string;
			getTrackId(): string;
			getTrackObject(): mendix.lib.MxObject;
			hasTrackEntity(): boolean;
			hasTrackId(): boolean;
			hasTrackObject(): boolean;
		}

		class MxMetaObject {
			getAttributes(): string[];
			getEntity(): string;
			getEnumCaption(attr: string, value: string): string;
			getEnumMap(): { key: string, caption: string }[]
			getGuid(): string;
			getReference(reference: string): string;
			getReferences(attr: string): number[];
			getSelectorEntity(): string;
			getSubEntities(): string[];
			getSuperEntities(): string[];
			hasChanges(): boolean;
			hasSubEntities(): boolean;
			hasSuperEntities(): boolean;
			inheritsFrom(claz: string): boolean;
			isA(claz: string): boolean
			isBoolean(att: string): boolean;
			isDate(att: string): boolean;
			isEnum(att: string): boolean;
			isLocalizedDate(att: string): boolean;
			isNumber(att: string): boolean;
			isNumeric(att: string): boolean;
			isObjectReference(att: string): boolean;
			isObjectReferenceSet(att: string): boolean;
			isPassword(att: string): boolean;
			isReadonlyAttr(att: string): boolean;
			isReference(att: string): boolean;
		}

		class ObjectValidation {
			addAttribute(attr: string, message: string): boolean;
			clone(): ObjectValidation;
			getAttributes(): { name: string, reason: string }[];
			getErrorReason(attr: string): string;
			getGuid(): string;
			removeAttribute(attr: string): void;
		}
		
		class ValidationError {
			
		}
	}
	class lang {
		collect(chain: Function[], callback?: Function, scope?: Object): void;
		delay(func: Function, condition: Function, period?: number): number;
		getUniqueId(): string;
		map(objOrArray: Object | Object[], func: Function, scope?: Object): any[];
		sequence(chain: Function[], callback?: Function, scope?: Object): void;
		nullExec(callbcack: Function):void;
	}

	class validator {
		validation: number;
		validate(value: any, type: string): number;
	}
	
	class logger {
		error(...info:any[]):void;
		debug(...info:any[]):void;
		info(...info:any[]):void;
		warn(...info:any[]):void;
		exception(...info:any[]):void;
		scream(...info:any[]):void;		
	}
}

declare module "mendix/lib/MxObject"
{
	var obj: mendix.lib.MxObject;
	export = obj;
}

declare module "mendix/lang"
{
	var lang: mendix.lang;
	export = lang;
}

declare module "mendix/logger"
{
	var logger: mendix.logger;
	export = logger;
}
