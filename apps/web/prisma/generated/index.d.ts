/**
 * Client
 **/

import * as runtime from "./runtime/client.js";
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Employee
 *
 */
export type Employee = $Result.DefaultSelection<Prisma.$EmployeePayload>;
/**
 * Model OAuthAccount
 *
 */
export type OAuthAccount = $Result.DefaultSelection<Prisma.$OAuthAccountPayload>;
/**
 * Model Session
 *
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>;
/**
 * Model Station
 *
 */
export type Station = $Result.DefaultSelection<Prisma.$StationPayload>;
/**
 * Model TimeLog
 *
 */
export type TimeLog = $Result.DefaultSelection<Prisma.$TimeLogPayload>;
/**
 * Model TaskType
 *
 */
export type TaskType = $Result.DefaultSelection<Prisma.$TaskTypePayload>;
/**
 * Model TaskAssignment
 *
 */
export type TaskAssignment = $Result.DefaultSelection<Prisma.$TaskAssignmentPayload>;
/**
 * Model PerformanceMetric
 *
 */
export type PerformanceMetric = $Result.DefaultSelection<Prisma.$PerformanceMetricPayload>;
/**
 * Model Todo
 *
 */
export type Todo = $Result.DefaultSelection<Prisma.$TodoPayload>;
/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model ApiKey
 *
 */
export type ApiKey = $Result.DefaultSelection<Prisma.$ApiKeyPayload>;

/**
 * Enums
 */
export namespace $Enums {
	export const EmployeeStatus: {
		ACTIVE: "ACTIVE";
		INACTIVE: "INACTIVE";
		ON_LEAVE: "ON_LEAVE";
		TERMINATED: "TERMINATED";
	};

	export type EmployeeStatus = (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

	export const ClockMethod: {
		PIN: "PIN";
		CARD: "CARD";
		BIOMETRIC: "BIOMETRIC";
		MANUAL: "MANUAL";
	};

	export type ClockMethod = (typeof ClockMethod)[keyof typeof ClockMethod];

	export const Station_name: {
		PICKING: "PICKING";
		PACKING: "PACKING";
		FILLING: "FILLING";
		RECEIVING: "RECEIVING";
		SHIPPING: "SHIPPING";
		QUALITY: "QUALITY";
		INVENTORY: "INVENTORY";
	};

	export type Station_name = (typeof Station_name)[keyof typeof Station_name];

	export const TimeLog_type: {
		WORK: "WORK";
		BREAK: "BREAK";
	};

	export type TimeLog_type = (typeof TimeLog_type)[keyof typeof TimeLog_type];

	export const User_role: {
		ADMIN: "ADMIN";
		MANAGER: "MANAGER";
		WORKER: "WORKER";
		EXECUTIVE: "EXECUTIVE";
	};

	export type User_role = (typeof User_role)[keyof typeof User_role];
}

export type EmployeeStatus = $Enums.EmployeeStatus;

export const EmployeeStatus: typeof $Enums.EmployeeStatus;

export type ClockMethod = $Enums.ClockMethod;

export const ClockMethod: typeof $Enums.ClockMethod;

export type Station_name = $Enums.Station_name;

export const Station_name: typeof $Enums.Station_name;

export type TimeLog_type = $Enums.TimeLog_type;

export const TimeLog_type: typeof $Enums.TimeLog_type;

export type User_role = $Enums.User_role;

export const User_role: typeof $Enums.User_role;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Employees
 * const employees = await prisma.employee.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
	ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
	const U = "log" extends keyof ClientOptions
		? ClientOptions["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
			? Prisma.GetEvents<ClientOptions["log"]>
			: never
		: never,
	ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
	[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["other"] };

	/**
	 * ##  Prisma Client ʲˢ
	 *
	 * Type-safe database client for TypeScript & Node.js
	 * @example
	 * ```
	 * const prisma = new PrismaClient()
	 * // Fetch zero or more Employees
	 * const employees = await prisma.employee.findMany()
	 * ```
	 *
	 *
	 * Read more in our [docs](https://pris.ly/d/client).
	 */

	constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
	$on<V extends U>(
		eventType: V,
		callback: (event: V extends "query" ? Prisma.QueryEvent : Prisma.LogEvent) => void
	): PrismaClient;

	/**
	 * Connect with the database
	 */
	$connect(): $Utils.JsPromise<void>;

	/**
	 * Disconnect from the database
	 */
	$disconnect(): $Utils.JsPromise<void>;

	/**
	 * Executes a prepared raw query and returns the number of affected rows.
	 * @example
	 * ```
	 * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
	 * ```
	 *
	 * Read more in our [docs](https://pris.ly/d/raw-queries).
	 */
	$executeRaw<T = unknown>(
		query: TemplateStringsArray | Prisma.Sql,
		...values: any[]
	): Prisma.PrismaPromise<number>;

	/**
	 * Executes a raw query and returns the number of affected rows.
	 * Susceptible to SQL injections, see documentation.
	 * @example
	 * ```
	 * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
	 * ```
	 *
	 * Read more in our [docs](https://pris.ly/d/raw-queries).
	 */
	$executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

	/**
	 * Performs a prepared raw query and returns the `SELECT` data.
	 * @example
	 * ```
	 * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
	 * ```
	 *
	 * Read more in our [docs](https://pris.ly/d/raw-queries).
	 */
	$queryRaw<T = unknown>(
		query: TemplateStringsArray | Prisma.Sql,
		...values: any[]
	): Prisma.PrismaPromise<T>;

	/**
	 * Performs a raw query and returns the `SELECT` data.
	 * Susceptible to SQL injections, see documentation.
	 * @example
	 * ```
	 * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
	 * ```
	 *
	 * Read more in our [docs](https://pris.ly/d/raw-queries).
	 */
	$queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

	/**
	 * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
	 * @example
	 * ```
	 * const [george, bob, alice] = await prisma.$transaction([
	 *   prisma.user.create({ data: { name: 'George' } }),
	 *   prisma.user.create({ data: { name: 'Bob' } }),
	 *   prisma.user.create({ data: { name: 'Alice' } }),
	 * ])
	 * ```
	 *
	 * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
	 */
	$transaction<P extends Prisma.PrismaPromise<any>[]>(
		arg: [...P],
		options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
	): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

	$transaction<R>(
		fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
		options?: {
			maxWait?: number;
			timeout?: number;
			isolationLevel?: Prisma.TransactionIsolationLevel;
		}
	): $Utils.JsPromise<R>;

	$extends: $Extensions.ExtendsHook<
		"extends",
		Prisma.TypeMapCb<ClientOptions>,
		ExtArgs,
		$Utils.Call<
			Prisma.TypeMapCb<ClientOptions>,
			{
				extArgs: ExtArgs;
			}
		>
	>;

	/**
	 * `prisma.employee`: Exposes CRUD operations for the **Employee** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Employees
	 * const employees = await prisma.employee.findMany()
	 * ```
	 */
	get employee(): Prisma.EmployeeDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.oAuthAccount`: Exposes CRUD operations for the **OAuthAccount** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more OAuthAccounts
	 * const oAuthAccounts = await prisma.oAuthAccount.findMany()
	 * ```
	 */
	get oAuthAccount(): Prisma.OAuthAccountDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.session`: Exposes CRUD operations for the **Session** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Sessions
	 * const sessions = await prisma.session.findMany()
	 * ```
	 */
	get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.station`: Exposes CRUD operations for the **Station** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Stations
	 * const stations = await prisma.station.findMany()
	 * ```
	 */
	get station(): Prisma.StationDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.timeLog`: Exposes CRUD operations for the **TimeLog** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more TimeLogs
	 * const timeLogs = await prisma.timeLog.findMany()
	 * ```
	 */
	get timeLog(): Prisma.TimeLogDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.taskType`: Exposes CRUD operations for the **TaskType** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more TaskTypes
	 * const taskTypes = await prisma.taskType.findMany()
	 * ```
	 */
	get taskType(): Prisma.TaskTypeDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.taskAssignment`: Exposes CRUD operations for the **TaskAssignment** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more TaskAssignments
	 * const taskAssignments = await prisma.taskAssignment.findMany()
	 * ```
	 */
	get taskAssignment(): Prisma.TaskAssignmentDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.performanceMetric`: Exposes CRUD operations for the **PerformanceMetric** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more PerformanceMetrics
	 * const performanceMetrics = await prisma.performanceMetric.findMany()
	 * ```
	 */
	get performanceMetric(): Prisma.PerformanceMetricDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.todo`: Exposes CRUD operations for the **Todo** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Todos
	 * const todos = await prisma.todo.findMany()
	 * ```
	 */
	get todo(): Prisma.TodoDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.user`: Exposes CRUD operations for the **User** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more Users
	 * const users = await prisma.user.findMany()
	 * ```
	 */
	get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

	/**
	 * `prisma.apiKey`: Exposes CRUD operations for the **ApiKey** model.
	 * Example usage:
	 * ```ts
	 * // Fetch zero or more ApiKeys
	 * const apiKeys = await prisma.apiKey.findMany()
	 * ```
	 */
	get apiKey(): Prisma.ApiKeyDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
	export import DMMF = runtime.DMMF;

	export type PrismaPromise<T> = $Public.PrismaPromise<T>;

	/**
	 * Validator
	 */
	export import validator = runtime.Public.validator;

	/**
	 * Prisma Errors
	 */
	export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
	export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
	export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
	export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
	export import PrismaClientValidationError = runtime.PrismaClientValidationError;

	/**
	 * Re-export of sql-template-tag
	 */
	export import sql = runtime.sqltag;
	export import empty = runtime.empty;
	export import join = runtime.join;
	export import raw = runtime.raw;
	export import Sql = runtime.Sql;

	/**
	 * Decimal.js
	 */
	export import Decimal = runtime.Decimal;

	export type DecimalJsLike = runtime.DecimalJsLike;

	/**
	 * Extensions
	 */
	export import Extension = $Extensions.UserArgs;
	export import getExtensionContext = runtime.Extensions.getExtensionContext;
	export import Args = $Public.Args;
	export import Payload = $Public.Payload;
	export import Result = $Public.Result;
	export import Exact = $Public.Exact;

	/**
	 * Prisma Client JS version: 7.1.0
	 * Query Engine version: ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
	 */
	export type PrismaVersion = {
		client: string;
		engine: string;
	};

	export const prismaVersion: PrismaVersion;

	/**
	 * Utility Types
	 */

	export import Bytes = runtime.Bytes;
	export import JsonObject = runtime.JsonObject;
	export import JsonArray = runtime.JsonArray;
	export import JsonValue = runtime.JsonValue;
	export import InputJsonObject = runtime.InputJsonObject;
	export import InputJsonArray = runtime.InputJsonArray;
	export import InputJsonValue = runtime.InputJsonValue;

	/**
	 * Types of the values used to represent different kinds of `null` values when working with JSON fields.
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	namespace NullTypes {
		/**
		 * Type of `Prisma.DbNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class DbNull {
			private DbNull: never;
			private constructor();
		}

		/**
		 * Type of `Prisma.JsonNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class JsonNull {
			private JsonNull: never;
			private constructor();
		}

		/**
		 * Type of `Prisma.AnyNull`.
		 *
		 * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
		 *
		 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
		 */
		class AnyNull {
			private AnyNull: never;
			private constructor();
		}
	}

	/**
	 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const DbNull: NullTypes.DbNull;

	/**
	 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const JsonNull: NullTypes.JsonNull;

	/**
	 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
	 *
	 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
	 */
	export const AnyNull: NullTypes.AnyNull;

	type SelectAndInclude = {
		select: any;
		include: any;
	};

	type SelectAndOmit = {
		select: any;
		omit: any;
	};

	/**
	 * Get the type of the value, that the Promise holds.
	 */
	export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

	/**
	 * Get the return type of a function which returns a Promise.
	 */
	export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
		ReturnType<T>
	>;

	/**
	 * From T, pick a set of properties whose keys are in the union K
	 */
	type Prisma__Pick<T, K extends keyof T> = {
		[P in K]: T[P];
	};

	export type Enumerable<T> = T | Array<T>;

	export type RequiredKeys<T> = {
		[K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
	}[keyof T];

	export type TruthyKeys<T> = keyof {
		[K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
	};

	export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

	/**
	 * Subset
	 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
	 */
	export type Subset<T, U> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	};

	/**
	 * SelectSubset
	 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
	 * Additionally, it validates, if both select and include are present. If the case, it errors.
	 */
	export type SelectSubset<T, U> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	} & (T extends SelectAndInclude
		? "Please either choose `select` or `include`."
		: T extends SelectAndOmit
			? "Please either choose `select` or `omit`."
			: {});

	/**
	 * Subset + Intersection
	 * @desc From `T` pick properties that exist in `U` and intersect `K`
	 */
	export type SubsetIntersection<T, U, K> = {
		[key in keyof T]: key extends keyof U ? T[key] : never;
	} & K;

	type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

	/**
	 * XOR is needed to have a real mutually exclusive union type
	 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
	 */
	type XOR<T, U> = T extends object
		? U extends object
			? (Without<T, U> & U) | (Without<U, T> & T)
			: U
		: T;

	/**
	 * Is T a Record?
	 */
	type IsObject<T extends any> =
		T extends Array<any>
			? False
			: T extends Date
				? False
				: T extends Uint8Array
					? False
					: T extends BigInt
						? False
						: T extends object
							? True
							: False;

	/**
	 * If it's T[], return T
	 */
	export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

	/**
	 * From ts-toolbelt
	 */

	type __Either<O extends object, K extends Key> = Omit<O, K> &
		{
			// Merge all but K
			[P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
		}[K];

	type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

	type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

	type _Either<O extends object, K extends Key, strict extends Boolean> = {
		1: EitherStrict<O, K>;
		0: EitherLoose<O, K>;
	}[strict];

	type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
		? _Either<O, K, strict>
		: never;

	export type Union = any;

	type PatchUndefined<O extends object, O1 extends object> = {
		[K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
	} & {};

	/** Helper Types for "Merge" **/
	export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
		k: infer I
	) => void
		? I
		: never;

	export type Overwrite<O extends object, O1 extends object> = {
		[K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
	} & {};

	type _Merge<U extends object> = IntersectOf<
		Overwrite<
			U,
			{
				[K in keyof U]-?: At<U, K>;
			}
		>
	>;

	type Key = string | number | symbol;
	type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
	type AtStrict<O extends object, K extends Key> = O[K & keyof O];
	type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
	export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
		1: AtStrict<O, K>;
		0: AtLoose<O, K>;
	}[strict];

	export type ComputeRaw<A extends any> = A extends Function
		? A
		: {
				[K in keyof A]: A[K];
			} & {};

	export type OptionalFlat<O> = {
		[K in keyof O]?: O[K];
	} & {};

	type _Record<K extends keyof any, T> = {
		[P in K]: T;
	};

	// cause typescript not to expand types and preserve names
	type NoExpand<T> = T extends unknown ? T : never;

	// this type assumes the passed object is entirely optional
	type AtLeast<O extends object, K extends string> = NoExpand<
		O extends unknown
			?
					| (K extends keyof O ? { [P in K]: O[P] } & O : O)
					| ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
			: never
	>;

	type _Strict<U, _U = U> = U extends unknown
		? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
		: never;

	export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
	/** End Helper Types for "Merge" **/

	export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

	/**
  A [[Boolean]]
  */
	export type Boolean = True | False;

	// /**
	// 1
	// */
	export type True = 1;

	/**
  0
  */
	export type False = 0;

	export type Not<B extends Boolean> = {
		0: 1;
		1: 0;
	}[B];

	export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
		? 0 // anything `never` is false
		: A1 extends A2
			? 1
			: 0;

	export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

	export type Or<B1 extends Boolean, B2 extends Boolean> = {
		0: {
			0: 0;
			1: 1;
		};
		1: {
			0: 1;
			1: 1;
		};
	}[B1][B2];

	export type Keys<U extends Union> = U extends unknown ? keyof U : never;

	type Cast<A, B> = A extends B ? A : B;

	export const type: unique symbol;

	/**
	 * Used by group by
	 */

	export type GetScalarType<T, O> = O extends object
		? {
				[P in keyof T]: P extends keyof O ? O[P] : never;
			}
		: never;

	type FieldPaths<T, U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">> =
		IsObject<T> extends True ? U : T;

	type GetHavingFields<T> = {
		[K in keyof T]: Or<Or<Extends<"OR", K>, Extends<"AND", K>>, Extends<"NOT", K>> extends True
			? // infer is only needed to not hit TS limit
				// based on the brilliant idea of Pierre-Antoine Mills
				// https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
				T[K] extends infer TK
				? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
				: never
			: {} extends FieldPaths<T[K]>
				? never
				: K;
	}[keyof T];

	/**
	 * Convert tuple to union
	 */
	type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
	type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
	type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

	/**
	 * Like `Pick`, but additionally can also accept an array of keys
	 */
	type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
		T,
		MaybeTupleToUnion<K>
	>;

	/**
	 * Exclude all keys with underscores
	 */
	type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

	export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

	type FieldRefInputType<Model, FieldType> = Model extends never
		? never
		: FieldRef<Model, FieldType>;

	export const ModelName: {
		Employee: "Employee";
		OAuthAccount: "OAuthAccount";
		Session: "Session";
		Station: "Station";
		TimeLog: "TimeLog";
		TaskType: "TaskType";
		TaskAssignment: "TaskAssignment";
		PerformanceMetric: "PerformanceMetric";
		Todo: "Todo";
		User: "User";
		ApiKey: "ApiKey";
	};

	export type ModelName = (typeof ModelName)[keyof typeof ModelName];

	interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
		{ extArgs: $Extensions.InternalArgs },
		$Utils.Record<string, any>
	> {
		returns: Prisma.TypeMap<
			this["params"]["extArgs"],
			ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
		>;
	}

	export type TypeMap<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> = {
		globalOmitOptions: {
			omit: GlobalOmitOptions;
		};
		meta: {
			modelProps:
				| "employee"
				| "oAuthAccount"
				| "session"
				| "station"
				| "timeLog"
				| "taskType"
				| "taskAssignment"
				| "performanceMetric"
				| "todo"
				| "user"
				| "apiKey";
			txIsolationLevel: Prisma.TransactionIsolationLevel;
		};
		model: {
			Employee: {
				payload: Prisma.$EmployeePayload<ExtArgs>;
				fields: Prisma.EmployeeFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.EmployeeFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.EmployeeFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>;
					};
					findFirst: {
						args: Prisma.EmployeeFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.EmployeeFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>;
					};
					findMany: {
						args: Prisma.EmployeeFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[];
					};
					create: {
						args: Prisma.EmployeeCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>;
					};
					createMany: {
						args: Prisma.EmployeeCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.EmployeeCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[];
					};
					delete: {
						args: Prisma.EmployeeDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>;
					};
					update: {
						args: Prisma.EmployeeUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>;
					};
					deleteMany: {
						args: Prisma.EmployeeDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.EmployeeUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.EmployeeUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[];
					};
					upsert: {
						args: Prisma.EmployeeUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$EmployeePayload>;
					};
					aggregate: {
						args: Prisma.EmployeeAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateEmployee>;
					};
					groupBy: {
						args: Prisma.EmployeeGroupByArgs<ExtArgs>;
						result: $Utils.Optional<EmployeeGroupByOutputType>[];
					};
					count: {
						args: Prisma.EmployeeCountArgs<ExtArgs>;
						result: $Utils.Optional<EmployeeCountAggregateOutputType> | number;
					};
				};
			};
			OAuthAccount: {
				payload: Prisma.$OAuthAccountPayload<ExtArgs>;
				fields: Prisma.OAuthAccountFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.OAuthAccountFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.OAuthAccountFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>;
					};
					findFirst: {
						args: Prisma.OAuthAccountFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.OAuthAccountFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>;
					};
					findMany: {
						args: Prisma.OAuthAccountFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[];
					};
					create: {
						args: Prisma.OAuthAccountCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>;
					};
					createMany: {
						args: Prisma.OAuthAccountCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.OAuthAccountCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[];
					};
					delete: {
						args: Prisma.OAuthAccountDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>;
					};
					update: {
						args: Prisma.OAuthAccountUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>;
					};
					deleteMany: {
						args: Prisma.OAuthAccountDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.OAuthAccountUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.OAuthAccountUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[];
					};
					upsert: {
						args: Prisma.OAuthAccountUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>;
					};
					aggregate: {
						args: Prisma.OAuthAccountAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateOAuthAccount>;
					};
					groupBy: {
						args: Prisma.OAuthAccountGroupByArgs<ExtArgs>;
						result: $Utils.Optional<OAuthAccountGroupByOutputType>[];
					};
					count: {
						args: Prisma.OAuthAccountCountArgs<ExtArgs>;
						result: $Utils.Optional<OAuthAccountCountAggregateOutputType> | number;
					};
				};
			};
			Session: {
				payload: Prisma.$SessionPayload<ExtArgs>;
				fields: Prisma.SessionFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.SessionFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
					};
					findFirst: {
						args: Prisma.SessionFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
					};
					findMany: {
						args: Prisma.SessionFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
					};
					create: {
						args: Prisma.SessionCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
					};
					createMany: {
						args: Prisma.SessionCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
					};
					delete: {
						args: Prisma.SessionDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
					};
					update: {
						args: Prisma.SessionUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
					};
					deleteMany: {
						args: Prisma.SessionDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.SessionUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
					};
					upsert: {
						args: Prisma.SessionUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
					};
					aggregate: {
						args: Prisma.SessionAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateSession>;
					};
					groupBy: {
						args: Prisma.SessionGroupByArgs<ExtArgs>;
						result: $Utils.Optional<SessionGroupByOutputType>[];
					};
					count: {
						args: Prisma.SessionCountArgs<ExtArgs>;
						result: $Utils.Optional<SessionCountAggregateOutputType> | number;
					};
				};
			};
			Station: {
				payload: Prisma.$StationPayload<ExtArgs>;
				fields: Prisma.StationFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.StationFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.StationFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>;
					};
					findFirst: {
						args: Prisma.StationFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.StationFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>;
					};
					findMany: {
						args: Prisma.StationFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>[];
					};
					create: {
						args: Prisma.StationCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>;
					};
					createMany: {
						args: Prisma.StationCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.StationCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>[];
					};
					delete: {
						args: Prisma.StationDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>;
					};
					update: {
						args: Prisma.StationUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>;
					};
					deleteMany: {
						args: Prisma.StationDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.StationUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.StationUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>[];
					};
					upsert: {
						args: Prisma.StationUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$StationPayload>;
					};
					aggregate: {
						args: Prisma.StationAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateStation>;
					};
					groupBy: {
						args: Prisma.StationGroupByArgs<ExtArgs>;
						result: $Utils.Optional<StationGroupByOutputType>[];
					};
					count: {
						args: Prisma.StationCountArgs<ExtArgs>;
						result: $Utils.Optional<StationCountAggregateOutputType> | number;
					};
				};
			};
			TimeLog: {
				payload: Prisma.$TimeLogPayload<ExtArgs>;
				fields: Prisma.TimeLogFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.TimeLogFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.TimeLogFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>;
					};
					findFirst: {
						args: Prisma.TimeLogFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.TimeLogFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>;
					};
					findMany: {
						args: Prisma.TimeLogFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>[];
					};
					create: {
						args: Prisma.TimeLogCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>;
					};
					createMany: {
						args: Prisma.TimeLogCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.TimeLogCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>[];
					};
					delete: {
						args: Prisma.TimeLogDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>;
					};
					update: {
						args: Prisma.TimeLogUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>;
					};
					deleteMany: {
						args: Prisma.TimeLogDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.TimeLogUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.TimeLogUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>[];
					};
					upsert: {
						args: Prisma.TimeLogUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TimeLogPayload>;
					};
					aggregate: {
						args: Prisma.TimeLogAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateTimeLog>;
					};
					groupBy: {
						args: Prisma.TimeLogGroupByArgs<ExtArgs>;
						result: $Utils.Optional<TimeLogGroupByOutputType>[];
					};
					count: {
						args: Prisma.TimeLogCountArgs<ExtArgs>;
						result: $Utils.Optional<TimeLogCountAggregateOutputType> | number;
					};
				};
			};
			TaskType: {
				payload: Prisma.$TaskTypePayload<ExtArgs>;
				fields: Prisma.TaskTypeFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.TaskTypeFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.TaskTypeFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>;
					};
					findFirst: {
						args: Prisma.TaskTypeFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.TaskTypeFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>;
					};
					findMany: {
						args: Prisma.TaskTypeFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>[];
					};
					create: {
						args: Prisma.TaskTypeCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>;
					};
					createMany: {
						args: Prisma.TaskTypeCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.TaskTypeCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>[];
					};
					delete: {
						args: Prisma.TaskTypeDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>;
					};
					update: {
						args: Prisma.TaskTypeUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>;
					};
					deleteMany: {
						args: Prisma.TaskTypeDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.TaskTypeUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.TaskTypeUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>[];
					};
					upsert: {
						args: Prisma.TaskTypeUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskTypePayload>;
					};
					aggregate: {
						args: Prisma.TaskTypeAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateTaskType>;
					};
					groupBy: {
						args: Prisma.TaskTypeGroupByArgs<ExtArgs>;
						result: $Utils.Optional<TaskTypeGroupByOutputType>[];
					};
					count: {
						args: Prisma.TaskTypeCountArgs<ExtArgs>;
						result: $Utils.Optional<TaskTypeCountAggregateOutputType> | number;
					};
				};
			};
			TaskAssignment: {
				payload: Prisma.$TaskAssignmentPayload<ExtArgs>;
				fields: Prisma.TaskAssignmentFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.TaskAssignmentFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.TaskAssignmentFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>;
					};
					findFirst: {
						args: Prisma.TaskAssignmentFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.TaskAssignmentFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>;
					};
					findMany: {
						args: Prisma.TaskAssignmentFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>[];
					};
					create: {
						args: Prisma.TaskAssignmentCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>;
					};
					createMany: {
						args: Prisma.TaskAssignmentCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.TaskAssignmentCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>[];
					};
					delete: {
						args: Prisma.TaskAssignmentDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>;
					};
					update: {
						args: Prisma.TaskAssignmentUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>;
					};
					deleteMany: {
						args: Prisma.TaskAssignmentDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.TaskAssignmentUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.TaskAssignmentUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>[];
					};
					upsert: {
						args: Prisma.TaskAssignmentUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TaskAssignmentPayload>;
					};
					aggregate: {
						args: Prisma.TaskAssignmentAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateTaskAssignment>;
					};
					groupBy: {
						args: Prisma.TaskAssignmentGroupByArgs<ExtArgs>;
						result: $Utils.Optional<TaskAssignmentGroupByOutputType>[];
					};
					count: {
						args: Prisma.TaskAssignmentCountArgs<ExtArgs>;
						result: $Utils.Optional<TaskAssignmentCountAggregateOutputType> | number;
					};
				};
			};
			PerformanceMetric: {
				payload: Prisma.$PerformanceMetricPayload<ExtArgs>;
				fields: Prisma.PerformanceMetricFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.PerformanceMetricFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.PerformanceMetricFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>;
					};
					findFirst: {
						args: Prisma.PerformanceMetricFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.PerformanceMetricFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>;
					};
					findMany: {
						args: Prisma.PerformanceMetricFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>[];
					};
					create: {
						args: Prisma.PerformanceMetricCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>;
					};
					createMany: {
						args: Prisma.PerformanceMetricCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.PerformanceMetricCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>[];
					};
					delete: {
						args: Prisma.PerformanceMetricDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>;
					};
					update: {
						args: Prisma.PerformanceMetricUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>;
					};
					deleteMany: {
						args: Prisma.PerformanceMetricDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.PerformanceMetricUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.PerformanceMetricUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>[];
					};
					upsert: {
						args: Prisma.PerformanceMetricUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$PerformanceMetricPayload>;
					};
					aggregate: {
						args: Prisma.PerformanceMetricAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregatePerformanceMetric>;
					};
					groupBy: {
						args: Prisma.PerformanceMetricGroupByArgs<ExtArgs>;
						result: $Utils.Optional<PerformanceMetricGroupByOutputType>[];
					};
					count: {
						args: Prisma.PerformanceMetricCountArgs<ExtArgs>;
						result: $Utils.Optional<PerformanceMetricCountAggregateOutputType> | number;
					};
				};
			};
			Todo: {
				payload: Prisma.$TodoPayload<ExtArgs>;
				fields: Prisma.TodoFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.TodoFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.TodoFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>;
					};
					findFirst: {
						args: Prisma.TodoFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.TodoFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>;
					};
					findMany: {
						args: Prisma.TodoFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>[];
					};
					create: {
						args: Prisma.TodoCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>;
					};
					createMany: {
						args: Prisma.TodoCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.TodoCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>[];
					};
					delete: {
						args: Prisma.TodoDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>;
					};
					update: {
						args: Prisma.TodoUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>;
					};
					deleteMany: {
						args: Prisma.TodoDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.TodoUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.TodoUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>[];
					};
					upsert: {
						args: Prisma.TodoUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$TodoPayload>;
					};
					aggregate: {
						args: Prisma.TodoAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateTodo>;
					};
					groupBy: {
						args: Prisma.TodoGroupByArgs<ExtArgs>;
						result: $Utils.Optional<TodoGroupByOutputType>[];
					};
					count: {
						args: Prisma.TodoCountArgs<ExtArgs>;
						result: $Utils.Optional<TodoCountAggregateOutputType> | number;
					};
				};
			};
			User: {
				payload: Prisma.$UserPayload<ExtArgs>;
				fields: Prisma.UserFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.UserFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					findFirst: {
						args: Prisma.UserFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					findMany: {
						args: Prisma.UserFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
					};
					create: {
						args: Prisma.UserCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					createMany: {
						args: Prisma.UserCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
					};
					delete: {
						args: Prisma.UserDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					update: {
						args: Prisma.UserUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					deleteMany: {
						args: Prisma.UserDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.UserUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
					};
					upsert: {
						args: Prisma.UserUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$UserPayload>;
					};
					aggregate: {
						args: Prisma.UserAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateUser>;
					};
					groupBy: {
						args: Prisma.UserGroupByArgs<ExtArgs>;
						result: $Utils.Optional<UserGroupByOutputType>[];
					};
					count: {
						args: Prisma.UserCountArgs<ExtArgs>;
						result: $Utils.Optional<UserCountAggregateOutputType> | number;
					};
				};
			};
			ApiKey: {
				payload: Prisma.$ApiKeyPayload<ExtArgs>;
				fields: Prisma.ApiKeyFieldRefs;
				operations: {
					findUnique: {
						args: Prisma.ApiKeyFindUniqueArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null;
					};
					findUniqueOrThrow: {
						args: Prisma.ApiKeyFindUniqueOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>;
					};
					findFirst: {
						args: Prisma.ApiKeyFindFirstArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null;
					};
					findFirstOrThrow: {
						args: Prisma.ApiKeyFindFirstOrThrowArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>;
					};
					findMany: {
						args: Prisma.ApiKeyFindManyArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[];
					};
					create: {
						args: Prisma.ApiKeyCreateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>;
					};
					createMany: {
						args: Prisma.ApiKeyCreateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					createManyAndReturn: {
						args: Prisma.ApiKeyCreateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[];
					};
					delete: {
						args: Prisma.ApiKeyDeleteArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>;
					};
					update: {
						args: Prisma.ApiKeyUpdateArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>;
					};
					deleteMany: {
						args: Prisma.ApiKeyDeleteManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateMany: {
						args: Prisma.ApiKeyUpdateManyArgs<ExtArgs>;
						result: BatchPayload;
					};
					updateManyAndReturn: {
						args: Prisma.ApiKeyUpdateManyAndReturnArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[];
					};
					upsert: {
						args: Prisma.ApiKeyUpsertArgs<ExtArgs>;
						result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>;
					};
					aggregate: {
						args: Prisma.ApiKeyAggregateArgs<ExtArgs>;
						result: $Utils.Optional<AggregateApiKey>;
					};
					groupBy: {
						args: Prisma.ApiKeyGroupByArgs<ExtArgs>;
						result: $Utils.Optional<ApiKeyGroupByOutputType>[];
					};
					count: {
						args: Prisma.ApiKeyCountArgs<ExtArgs>;
						result: $Utils.Optional<ApiKeyCountAggregateOutputType> | number;
					};
				};
			};
		};
	} & {
		other: {
			payload: any;
			operations: {
				$executeRaw: {
					args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
					result: any;
				};
				$executeRawUnsafe: {
					args: [query: string, ...values: any[]];
					result: any;
				};
				$queryRaw: {
					args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
					result: any;
				};
				$queryRawUnsafe: {
					args: [query: string, ...values: any[]];
					result: any;
				};
			};
		};
	};
	export const defineExtension: $Extensions.ExtendsHook<
		"define",
		Prisma.TypeMapCb,
		$Extensions.DefaultArgs
	>;
	export type DefaultPrismaClient = PrismaClient;
	export type ErrorFormat = "pretty" | "colorless" | "minimal";
	export interface PrismaClientOptions {
		/**
		 * @default "colorless"
		 */
		errorFormat?: ErrorFormat;
		/**
		 * @example
		 * ```
		 * // Shorthand for `emit: 'stdout'`
		 * log: ['query', 'info', 'warn', 'error']
		 *
		 * // Emit as events only
		 * log: [
		 *   { emit: 'event', level: 'query' },
		 *   { emit: 'event', level: 'info' },
		 *   { emit: 'event', level: 'warn' }
		 *   { emit: 'event', level: 'error' }
		 * ]
		 *
		 * / Emit as events and log to stdout
		 * og: [
		 *  { emit: 'stdout', level: 'query' },
		 *  { emit: 'stdout', level: 'info' },
		 *  { emit: 'stdout', level: 'warn' }
		 *  { emit: 'stdout', level: 'error' }
		 *
		 * ```
		 * Read more in our [docs](https://pris.ly/d/logging).
		 */
		log?: (LogLevel | LogDefinition)[];
		/**
		 * The default values for transactionOptions
		 * maxWait ?= 2000
		 * timeout ?= 5000
		 */
		transactionOptions?: {
			maxWait?: number;
			timeout?: number;
			isolationLevel?: Prisma.TransactionIsolationLevel;
		};
		/**
		 * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
		 */
		adapter?: runtime.SqlDriverAdapterFactory;
		/**
		 * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
		 */
		accelerateUrl?: string;
		/**
		 * Global configuration for omitting model fields by default.
		 *
		 * @example
		 * ```
		 * const prisma = new PrismaClient({
		 *   omit: {
		 *     user: {
		 *       password: true
		 *     }
		 *   }
		 * })
		 * ```
		 */
		omit?: Prisma.GlobalOmitConfig;
		/**
		 * SQL commenter plugins that add metadata to SQL queries as comments.
		 * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
		 *
		 * @example
		 * ```
		 * const prisma = new PrismaClient({
		 *   adapter,
		 *   comments: [
		 *     traceContext(),
		 *     queryInsights(),
		 *   ],
		 * })
		 * ```
		 */
		comments?: runtime.SqlCommenterPlugin[];
	}
	export type GlobalOmitConfig = {
		employee?: EmployeeOmit;
		oAuthAccount?: OAuthAccountOmit;
		session?: SessionOmit;
		station?: StationOmit;
		timeLog?: TimeLogOmit;
		taskType?: TaskTypeOmit;
		taskAssignment?: TaskAssignmentOmit;
		performanceMetric?: PerformanceMetricOmit;
		todo?: TodoOmit;
		user?: UserOmit;
		apiKey?: ApiKeyOmit;
	};

	/* Types for Logging */
	export type LogLevel = "info" | "query" | "warn" | "error";
	export type LogDefinition = {
		level: LogLevel;
		emit: "stdout" | "event";
	};

	export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

	export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T["level"] : T>;

	export type GetEvents<T extends any[]> =
		T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

	export type QueryEvent = {
		timestamp: Date;
		query: string;
		params: string;
		duration: number;
		target: string;
	};

	export type LogEvent = {
		timestamp: Date;
		message: string;
		target: string;
	};
	/* End Types for Logging */

	export type PrismaAction =
		| "findUnique"
		| "findUniqueOrThrow"
		| "findMany"
		| "findFirst"
		| "findFirstOrThrow"
		| "create"
		| "createMany"
		| "createManyAndReturn"
		| "update"
		| "updateMany"
		| "updateManyAndReturn"
		| "upsert"
		| "delete"
		| "deleteMany"
		| "executeRaw"
		| "queryRaw"
		| "aggregate"
		| "count"
		| "runCommandRaw"
		| "findRaw"
		| "groupBy";

	// tested in getLogLevel.test.ts
	export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

	/**
	 * `PrismaClient` proxy available in interactive transactions.
	 */
	export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

	export type Datasource = {
		url?: string;
	};

	/**
	 * Count Types
	 */

	/**
	 * Count Type EmployeeCountOutputType
	 */

	export type EmployeeCountOutputType = {
		TimeLog: number;
		TaskAssignment: number;
		PerformanceMetric: number;
	};

	export type EmployeeCountOutputTypeSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		TimeLog?: boolean | EmployeeCountOutputTypeCountTimeLogArgs;
		TaskAssignment?: boolean | EmployeeCountOutputTypeCountTaskAssignmentArgs;
		PerformanceMetric?: boolean | EmployeeCountOutputTypeCountPerformanceMetricArgs;
	};

	// Custom InputTypes
	/**
	 * EmployeeCountOutputType without action
	 */
	export type EmployeeCountOutputTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the EmployeeCountOutputType
		 */
		select?: EmployeeCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * EmployeeCountOutputType without action
	 */
	export type EmployeeCountOutputTypeCountTimeLogArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TimeLogWhereInput;
	};

	/**
	 * EmployeeCountOutputType without action
	 */
	export type EmployeeCountOutputTypeCountTaskAssignmentArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TaskAssignmentWhereInput;
	};

	/**
	 * EmployeeCountOutputType without action
	 */
	export type EmployeeCountOutputTypeCountPerformanceMetricArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: PerformanceMetricWhereInput;
	};

	/**
	 * Count Type StationCountOutputType
	 */

	export type StationCountOutputType = {
		TimeLog: number;
		TaskType: number;
		employeesAtLastStation: number;
		employeesWithDefault: number;
	};

	export type StationCountOutputTypeSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		TimeLog?: boolean | StationCountOutputTypeCountTimeLogArgs;
		TaskType?: boolean | StationCountOutputTypeCountTaskTypeArgs;
		employeesAtLastStation?: boolean | StationCountOutputTypeCountEmployeesAtLastStationArgs;
		employeesWithDefault?: boolean | StationCountOutputTypeCountEmployeesWithDefaultArgs;
	};

	// Custom InputTypes
	/**
	 * StationCountOutputType without action
	 */
	export type StationCountOutputTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the StationCountOutputType
		 */
		select?: StationCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * StationCountOutputType without action
	 */
	export type StationCountOutputTypeCountTimeLogArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TimeLogWhereInput;
	};

	/**
	 * StationCountOutputType without action
	 */
	export type StationCountOutputTypeCountTaskTypeArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TaskTypeWhereInput;
	};

	/**
	 * StationCountOutputType without action
	 */
	export type StationCountOutputTypeCountEmployeesAtLastStationArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: EmployeeWhereInput;
	};

	/**
	 * StationCountOutputType without action
	 */
	export type StationCountOutputTypeCountEmployeesWithDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: EmployeeWhereInput;
	};

	/**
	 * Count Type TaskTypeCountOutputType
	 */

	export type TaskTypeCountOutputType = {
		TaskAssignment: number;
	};

	export type TaskTypeCountOutputTypeSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		TaskAssignment?: boolean | TaskTypeCountOutputTypeCountTaskAssignmentArgs;
	};

	// Custom InputTypes
	/**
	 * TaskTypeCountOutputType without action
	 */
	export type TaskTypeCountOutputTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskTypeCountOutputType
		 */
		select?: TaskTypeCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * TaskTypeCountOutputType without action
	 */
	export type TaskTypeCountOutputTypeCountTaskAssignmentArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TaskAssignmentWhereInput;
	};

	/**
	 * Count Type TaskAssignmentCountOutputType
	 */

	export type TaskAssignmentCountOutputType = {
		TimeLogs: number;
	};

	export type TaskAssignmentCountOutputTypeSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		TimeLogs?: boolean | TaskAssignmentCountOutputTypeCountTimeLogsArgs;
	};

	// Custom InputTypes
	/**
	 * TaskAssignmentCountOutputType without action
	 */
	export type TaskAssignmentCountOutputTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignmentCountOutputType
		 */
		select?: TaskAssignmentCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * TaskAssignmentCountOutputType without action
	 */
	export type TaskAssignmentCountOutputTypeCountTimeLogsArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TimeLogWhereInput;
	};

	/**
	 * Count Type UserCountOutputType
	 */

	export type UserCountOutputType = {
		OAuthAccount: number;
		Session: number;
		ApiKey: number;
	};

	export type UserCountOutputTypeSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		OAuthAccount?: boolean | UserCountOutputTypeCountOAuthAccountArgs;
		Session?: boolean | UserCountOutputTypeCountSessionArgs;
		ApiKey?: boolean | UserCountOutputTypeCountApiKeyArgs;
	};

	// Custom InputTypes
	/**
	 * UserCountOutputType without action
	 */
	export type UserCountOutputTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the UserCountOutputType
		 */
		select?: UserCountOutputTypeSelect<ExtArgs> | null;
	};

	/**
	 * UserCountOutputType without action
	 */
	export type UserCountOutputTypeCountOAuthAccountArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: OAuthAccountWhereInput;
	};

	/**
	 * UserCountOutputType without action
	 */
	export type UserCountOutputTypeCountSessionArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: SessionWhereInput;
	};

	/**
	 * UserCountOutputType without action
	 */
	export type UserCountOutputTypeCountApiKeyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ApiKeyWhereInput;
	};

	/**
	 * Models
	 */

	/**
	 * Model Employee
	 */

	export type AggregateEmployee = {
		_count: EmployeeCountAggregateOutputType | null;
		_avg: EmployeeAvgAggregateOutputType | null;
		_sum: EmployeeSumAggregateOutputType | null;
		_min: EmployeeMinAggregateOutputType | null;
		_max: EmployeeMaxAggregateOutputType | null;
	};

	export type EmployeeAvgAggregateOutputType = {
		dailyHoursLimit: number | null;
		weeklyHoursLimit: number | null;
	};

	export type EmployeeSumAggregateOutputType = {
		dailyHoursLimit: number | null;
		weeklyHoursLimit: number | null;
	};

	export type EmployeeMinAggregateOutputType = {
		id: string | null;
		name: string | null;
		email: string | null;
		pinHash: string | null;
		lastStationId: string | null;
		dailyHoursLimit: number | null;
		weeklyHoursLimit: number | null;
		employeeCode: string | null;
		phoneNumber: string | null;
		hireDate: Date | null;
		status: $Enums.EmployeeStatus | null;
		defaultStationId: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type EmployeeMaxAggregateOutputType = {
		id: string | null;
		name: string | null;
		email: string | null;
		pinHash: string | null;
		lastStationId: string | null;
		dailyHoursLimit: number | null;
		weeklyHoursLimit: number | null;
		employeeCode: string | null;
		phoneNumber: string | null;
		hireDate: Date | null;
		status: $Enums.EmployeeStatus | null;
		defaultStationId: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type EmployeeCountAggregateOutputType = {
		id: number;
		name: number;
		email: number;
		pinHash: number;
		lastStationId: number;
		dailyHoursLimit: number;
		weeklyHoursLimit: number;
		employeeCode: number;
		phoneNumber: number;
		hireDate: number;
		status: number;
		defaultStationId: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type EmployeeAvgAggregateInputType = {
		dailyHoursLimit?: true;
		weeklyHoursLimit?: true;
	};

	export type EmployeeSumAggregateInputType = {
		dailyHoursLimit?: true;
		weeklyHoursLimit?: true;
	};

	export type EmployeeMinAggregateInputType = {
		id?: true;
		name?: true;
		email?: true;
		pinHash?: true;
		lastStationId?: true;
		dailyHoursLimit?: true;
		weeklyHoursLimit?: true;
		employeeCode?: true;
		phoneNumber?: true;
		hireDate?: true;
		status?: true;
		defaultStationId?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type EmployeeMaxAggregateInputType = {
		id?: true;
		name?: true;
		email?: true;
		pinHash?: true;
		lastStationId?: true;
		dailyHoursLimit?: true;
		weeklyHoursLimit?: true;
		employeeCode?: true;
		phoneNumber?: true;
		hireDate?: true;
		status?: true;
		defaultStationId?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type EmployeeCountAggregateInputType = {
		id?: true;
		name?: true;
		email?: true;
		pinHash?: true;
		lastStationId?: true;
		dailyHoursLimit?: true;
		weeklyHoursLimit?: true;
		employeeCode?: true;
		phoneNumber?: true;
		hireDate?: true;
		status?: true;
		defaultStationId?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type EmployeeAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Employee to aggregate.
		 */
		where?: EmployeeWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Employees to fetch.
		 */
		orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: EmployeeWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Employees from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Employees.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Employees
		 **/
		_count?: true | EmployeeCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to average
		 **/
		_avg?: EmployeeAvgAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to sum
		 **/
		_sum?: EmployeeSumAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: EmployeeMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: EmployeeMaxAggregateInputType;
	};

	export type GetEmployeeAggregateType<T extends EmployeeAggregateArgs> = {
		[P in keyof T & keyof AggregateEmployee]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateEmployee[P]>
			: GetScalarType<T[P], AggregateEmployee[P]>;
	};

	export type EmployeeGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: EmployeeWhereInput;
		orderBy?: EmployeeOrderByWithAggregationInput | EmployeeOrderByWithAggregationInput[];
		by: EmployeeScalarFieldEnum[] | EmployeeScalarFieldEnum;
		having?: EmployeeScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: EmployeeCountAggregateInputType | true;
		_avg?: EmployeeAvgAggregateInputType;
		_sum?: EmployeeSumAggregateInputType;
		_min?: EmployeeMinAggregateInputType;
		_max?: EmployeeMaxAggregateInputType;
	};

	export type EmployeeGroupByOutputType = {
		id: string;
		name: string;
		email: string;
		pinHash: string | null;
		lastStationId: string | null;
		dailyHoursLimit: number | null;
		weeklyHoursLimit: number | null;
		employeeCode: string | null;
		phoneNumber: string | null;
		hireDate: Date | null;
		status: $Enums.EmployeeStatus;
		defaultStationId: string | null;
		createdAt: Date;
		updatedAt: Date;
		_count: EmployeeCountAggregateOutputType | null;
		_avg: EmployeeAvgAggregateOutputType | null;
		_sum: EmployeeSumAggregateOutputType | null;
		_min: EmployeeMinAggregateOutputType | null;
		_max: EmployeeMaxAggregateOutputType | null;
	};

	type GetEmployeeGroupByPayload<T extends EmployeeGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<EmployeeGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof EmployeeGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], EmployeeGroupByOutputType[P]>
					: GetScalarType<T[P], EmployeeGroupByOutputType[P]>;
			}
		>
	>;

	export type EmployeeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetSelect<
			{
				id?: boolean;
				name?: boolean;
				email?: boolean;
				pinHash?: boolean;
				lastStationId?: boolean;
				dailyHoursLimit?: boolean;
				weeklyHoursLimit?: boolean;
				employeeCode?: boolean;
				phoneNumber?: boolean;
				hireDate?: boolean;
				status?: boolean;
				defaultStationId?: boolean;
				createdAt?: boolean;
				updatedAt?: boolean;
				TimeLog?: boolean | Employee$TimeLogArgs<ExtArgs>;
				User?: boolean | Employee$UserArgs<ExtArgs>;
				TaskAssignment?: boolean | Employee$TaskAssignmentArgs<ExtArgs>;
				PerformanceMetric?: boolean | Employee$PerformanceMetricArgs<ExtArgs>;
				defaultStation?: boolean | Employee$defaultStationArgs<ExtArgs>;
				lastStation?: boolean | Employee$lastStationArgs<ExtArgs>;
				_count?: boolean | EmployeeCountOutputTypeDefaultArgs<ExtArgs>;
			},
			ExtArgs["result"]["employee"]
		>;

	export type EmployeeSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			name?: boolean;
			email?: boolean;
			pinHash?: boolean;
			lastStationId?: boolean;
			dailyHoursLimit?: boolean;
			weeklyHoursLimit?: boolean;
			employeeCode?: boolean;
			phoneNumber?: boolean;
			hireDate?: boolean;
			status?: boolean;
			defaultStationId?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			defaultStation?: boolean | Employee$defaultStationArgs<ExtArgs>;
			lastStation?: boolean | Employee$lastStationArgs<ExtArgs>;
		},
		ExtArgs["result"]["employee"]
	>;

	export type EmployeeSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			name?: boolean;
			email?: boolean;
			pinHash?: boolean;
			lastStationId?: boolean;
			dailyHoursLimit?: boolean;
			weeklyHoursLimit?: boolean;
			employeeCode?: boolean;
			phoneNumber?: boolean;
			hireDate?: boolean;
			status?: boolean;
			defaultStationId?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			defaultStation?: boolean | Employee$defaultStationArgs<ExtArgs>;
			lastStation?: boolean | Employee$lastStationArgs<ExtArgs>;
		},
		ExtArgs["result"]["employee"]
	>;

	export type EmployeeSelectScalar = {
		id?: boolean;
		name?: boolean;
		email?: boolean;
		pinHash?: boolean;
		lastStationId?: boolean;
		dailyHoursLimit?: boolean;
		weeklyHoursLimit?: boolean;
		employeeCode?: boolean;
		phoneNumber?: boolean;
		hireDate?: boolean;
		status?: boolean;
		defaultStationId?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type EmployeeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<
			| "id"
			| "name"
			| "email"
			| "pinHash"
			| "lastStationId"
			| "dailyHoursLimit"
			| "weeklyHoursLimit"
			| "employeeCode"
			| "phoneNumber"
			| "hireDate"
			| "status"
			| "defaultStationId"
			| "createdAt"
			| "updatedAt",
			ExtArgs["result"]["employee"]
		>;
	export type EmployeeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			TimeLog?: boolean | Employee$TimeLogArgs<ExtArgs>;
			User?: boolean | Employee$UserArgs<ExtArgs>;
			TaskAssignment?: boolean | Employee$TaskAssignmentArgs<ExtArgs>;
			PerformanceMetric?: boolean | Employee$PerformanceMetricArgs<ExtArgs>;
			defaultStation?: boolean | Employee$defaultStationArgs<ExtArgs>;
			lastStation?: boolean | Employee$lastStationArgs<ExtArgs>;
			_count?: boolean | EmployeeCountOutputTypeDefaultArgs<ExtArgs>;
		};
	export type EmployeeIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		defaultStation?: boolean | Employee$defaultStationArgs<ExtArgs>;
		lastStation?: boolean | Employee$lastStationArgs<ExtArgs>;
	};
	export type EmployeeIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		defaultStation?: boolean | Employee$defaultStationArgs<ExtArgs>;
		lastStation?: boolean | Employee$lastStationArgs<ExtArgs>;
	};

	export type $EmployeePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			name: "Employee";
			objects: {
				TimeLog: Prisma.$TimeLogPayload<ExtArgs>[];
				User: Prisma.$UserPayload<ExtArgs> | null;
				TaskAssignment: Prisma.$TaskAssignmentPayload<ExtArgs>[];
				PerformanceMetric: Prisma.$PerformanceMetricPayload<ExtArgs>[];
				defaultStation: Prisma.$StationPayload<ExtArgs> | null;
				lastStation: Prisma.$StationPayload<ExtArgs> | null;
			};
			scalars: $Extensions.GetPayloadResult<
				{
					id: string;
					name: string;
					email: string;
					pinHash: string | null;
					lastStationId: string | null;
					dailyHoursLimit: number | null;
					weeklyHoursLimit: number | null;
					employeeCode: string | null;
					phoneNumber: string | null;
					hireDate: Date | null;
					status: $Enums.EmployeeStatus;
					defaultStationId: string | null;
					createdAt: Date;
					updatedAt: Date;
				},
				ExtArgs["result"]["employee"]
			>;
			composites: {};
		};

	type EmployeeGetPayload<S extends boolean | null | undefined | EmployeeDefaultArgs> =
		$Result.GetResult<Prisma.$EmployeePayload, S>;

	type EmployeeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		EmployeeFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: EmployeeCountAggregateInputType | true;
	};

	export interface EmployeeDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["Employee"];
			meta: { name: "Employee" };
		};
		/**
		 * Find zero or one Employee that matches the filter.
		 * @param {EmployeeFindUniqueArgs} args - Arguments to find a Employee
		 * @example
		 * // Get one Employee
		 * const employee = await prisma.employee.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends EmployeeFindUniqueArgs>(
			args: SelectSubset<T, EmployeeFindUniqueArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<
				Prisma.$EmployeePayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one Employee that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {EmployeeFindUniqueOrThrowArgs} args - Arguments to find a Employee
		 * @example
		 * // Get one Employee
		 * const employee = await prisma.employee.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends EmployeeFindUniqueOrThrowArgs>(
			args: SelectSubset<T, EmployeeFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<
				Prisma.$EmployeePayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Employee that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {EmployeeFindFirstArgs} args - Arguments to find a Employee
		 * @example
		 * // Get one Employee
		 * const employee = await prisma.employee.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends EmployeeFindFirstArgs>(
			args?: SelectSubset<T, EmployeeFindFirstArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Employee that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {EmployeeFindFirstOrThrowArgs} args - Arguments to find a Employee
		 * @example
		 * // Get one Employee
		 * const employee = await prisma.employee.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends EmployeeFindFirstOrThrowArgs>(
			args?: SelectSubset<T, EmployeeFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Employees that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {EmployeeFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Employees
		 * const employees = await prisma.employee.findMany()
		 *
		 * // Get first 10 Employees
		 * const employees = await prisma.employee.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const employeeWithIdOnly = await prisma.employee.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends EmployeeFindManyArgs>(
			args?: SelectSubset<T, EmployeeFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a Employee.
		 * @param {EmployeeCreateArgs} args - Arguments to create a Employee.
		 * @example
		 * // Create one Employee
		 * const Employee = await prisma.employee.create({
		 *   data: {
		 *     // ... data to create a Employee
		 *   }
		 * })
		 *
		 */
		create<T extends EmployeeCreateArgs>(
			args: SelectSubset<T, EmployeeCreateArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many Employees.
		 * @param {EmployeeCreateManyArgs} args - Arguments to create many Employees.
		 * @example
		 * // Create many Employees
		 * const employee = await prisma.employee.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends EmployeeCreateManyArgs>(
			args?: SelectSubset<T, EmployeeCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Employees and returns the data saved in the database.
		 * @param {EmployeeCreateManyAndReturnArgs} args - Arguments to create many Employees.
		 * @example
		 * // Create many Employees
		 * const employee = await prisma.employee.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Employees and only return the `id`
		 * const employeeWithIdOnly = await prisma.employee.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends EmployeeCreateManyAndReturnArgs>(
			args?: SelectSubset<T, EmployeeCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$EmployeePayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a Employee.
		 * @param {EmployeeDeleteArgs} args - Arguments to delete one Employee.
		 * @example
		 * // Delete one Employee
		 * const Employee = await prisma.employee.delete({
		 *   where: {
		 *     // ... filter to delete one Employee
		 *   }
		 * })
		 *
		 */
		delete<T extends EmployeeDeleteArgs>(
			args: SelectSubset<T, EmployeeDeleteArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one Employee.
		 * @param {EmployeeUpdateArgs} args - Arguments to update one Employee.
		 * @example
		 * // Update one Employee
		 * const employee = await prisma.employee.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends EmployeeUpdateArgs>(
			args: SelectSubset<T, EmployeeUpdateArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more Employees.
		 * @param {EmployeeDeleteManyArgs} args - Arguments to filter Employees to delete.
		 * @example
		 * // Delete a few Employees
		 * const { count } = await prisma.employee.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends EmployeeDeleteManyArgs>(
			args?: SelectSubset<T, EmployeeDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Employees.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {EmployeeUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Employees
		 * const employee = await prisma.employee.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends EmployeeUpdateManyArgs>(
			args: SelectSubset<T, EmployeeUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Employees and returns the data updated in the database.
		 * @param {EmployeeUpdateManyAndReturnArgs} args - Arguments to update many Employees.
		 * @example
		 * // Update many Employees
		 * const employee = await prisma.employee.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Employees and only return the `id`
		 * const employeeWithIdOnly = await prisma.employee.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends EmployeeUpdateManyAndReturnArgs>(
			args: SelectSubset<T, EmployeeUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$EmployeePayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one Employee.
		 * @param {EmployeeUpsertArgs} args - Arguments to update or create a Employee.
		 * @example
		 * // Update or create a Employee
		 * const employee = await prisma.employee.upsert({
		 *   create: {
		 *     // ... data to create a Employee
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the Employee we want to update
		 *   }
		 * })
		 */
		upsert<T extends EmployeeUpsertArgs>(
			args: SelectSubset<T, EmployeeUpsertArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of Employees.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {EmployeeCountArgs} args - Arguments to filter Employees to count.
		 * @example
		 * // Count the number of Employees
		 * const count = await prisma.employee.count({
		 *   where: {
		 *     // ... the filter for the Employees we want to count
		 *   }
		 * })
		 **/
		count<T extends EmployeeCountArgs>(
			args?: Subset<T, EmployeeCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], EmployeeCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a Employee.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {EmployeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends EmployeeAggregateArgs>(
			args: Subset<T, EmployeeAggregateArgs>
		): Prisma.PrismaPromise<GetEmployeeAggregateType<T>>;

		/**
		 * Group by Employee.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {EmployeeGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends EmployeeGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: EmployeeGroupByArgs["orderBy"] }
				: { orderBy?: EmployeeGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, EmployeeGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors ? GetEmployeeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the Employee model
		 */
		readonly fields: EmployeeFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for Employee.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__EmployeeClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		TimeLog<T extends Employee$TimeLogArgs<ExtArgs> = {}>(
			args?: Subset<T, Employee$TimeLogArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
		>;
		User<T extends Employee$UserArgs<ExtArgs> = {}>(
			args?: Subset<T, Employee$UserArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<
				Prisma.$UserPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;
		TaskAssignment<T extends Employee$TaskAssignmentArgs<ExtArgs> = {}>(
			args?: Subset<T, Employee$TaskAssignmentArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			| $Result.GetResult<Prisma.$TaskAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
			| Null
		>;
		PerformanceMetric<T extends Employee$PerformanceMetricArgs<ExtArgs> = {}>(
			args?: Subset<T, Employee$PerformanceMetricArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			| $Result.GetResult<
					Prisma.$PerformanceMetricPayload<ExtArgs>,
					T,
					"findMany",
					GlobalOmitOptions
			  >
			| Null
		>;
		defaultStation<T extends Employee$defaultStationArgs<ExtArgs> = {}>(
			args?: Subset<T, Employee$defaultStationArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<
				Prisma.$StationPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;
		lastStation<T extends Employee$lastStationArgs<ExtArgs> = {}>(
			args?: Subset<T, Employee$lastStationArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<
				Prisma.$StationPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the Employee model
	 */
	interface EmployeeFieldRefs {
		readonly id: FieldRef<"Employee", "String">;
		readonly name: FieldRef<"Employee", "String">;
		readonly email: FieldRef<"Employee", "String">;
		readonly pinHash: FieldRef<"Employee", "String">;
		readonly lastStationId: FieldRef<"Employee", "String">;
		readonly dailyHoursLimit: FieldRef<"Employee", "Float">;
		readonly weeklyHoursLimit: FieldRef<"Employee", "Float">;
		readonly employeeCode: FieldRef<"Employee", "String">;
		readonly phoneNumber: FieldRef<"Employee", "String">;
		readonly hireDate: FieldRef<"Employee", "DateTime">;
		readonly status: FieldRef<"Employee", "EmployeeStatus">;
		readonly defaultStationId: FieldRef<"Employee", "String">;
		readonly createdAt: FieldRef<"Employee", "DateTime">;
		readonly updatedAt: FieldRef<"Employee", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * Employee findUnique
	 */
	export type EmployeeFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * Filter, which Employee to fetch.
		 */
		where: EmployeeWhereUniqueInput;
	};

	/**
	 * Employee findUniqueOrThrow
	 */
	export type EmployeeFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * Filter, which Employee to fetch.
		 */
		where: EmployeeWhereUniqueInput;
	};

	/**
	 * Employee findFirst
	 */
	export type EmployeeFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * Filter, which Employee to fetch.
		 */
		where?: EmployeeWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Employees to fetch.
		 */
		orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Employees.
		 */
		cursor?: EmployeeWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Employees from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Employees.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Employees.
		 */
		distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[];
	};

	/**
	 * Employee findFirstOrThrow
	 */
	export type EmployeeFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * Filter, which Employee to fetch.
		 */
		where?: EmployeeWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Employees to fetch.
		 */
		orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Employees.
		 */
		cursor?: EmployeeWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Employees from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Employees.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Employees.
		 */
		distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[];
	};

	/**
	 * Employee findMany
	 */
	export type EmployeeFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * Filter, which Employees to fetch.
		 */
		where?: EmployeeWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Employees to fetch.
		 */
		orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing Employees.
		 */
		cursor?: EmployeeWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Employees from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Employees.
		 */
		skip?: number;
		distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[];
	};

	/**
	 * Employee create
	 */
	export type EmployeeCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * The data needed to create a Employee.
		 */
		data: XOR<EmployeeCreateInput, EmployeeUncheckedCreateInput>;
	};

	/**
	 * Employee createMany
	 */
	export type EmployeeCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many Employees.
		 */
		data: EmployeeCreateManyInput | EmployeeCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Employee createManyAndReturn
	 */
	export type EmployeeCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * The data used to create many Employees.
		 */
		data: EmployeeCreateManyInput | EmployeeCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * Employee update
	 */
	export type EmployeeUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * The data needed to update a Employee.
		 */
		data: XOR<EmployeeUpdateInput, EmployeeUncheckedUpdateInput>;
		/**
		 * Choose, which Employee to update.
		 */
		where: EmployeeWhereUniqueInput;
	};

	/**
	 * Employee updateMany
	 */
	export type EmployeeUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update Employees.
		 */
		data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyInput>;
		/**
		 * Filter which Employees to update
		 */
		where?: EmployeeWhereInput;
		/**
		 * Limit how many Employees to update.
		 */
		limit?: number;
	};

	/**
	 * Employee updateManyAndReturn
	 */
	export type EmployeeUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * The data used to update Employees.
		 */
		data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyInput>;
		/**
		 * Filter which Employees to update
		 */
		where?: EmployeeWhereInput;
		/**
		 * Limit how many Employees to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * Employee upsert
	 */
	export type EmployeeUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * The filter to search for the Employee to update in case it exists.
		 */
		where: EmployeeWhereUniqueInput;
		/**
		 * In case the Employee found by the `where` argument doesn't exist, create a new Employee with this data.
		 */
		create: XOR<EmployeeCreateInput, EmployeeUncheckedCreateInput>;
		/**
		 * In case the Employee was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<EmployeeUpdateInput, EmployeeUncheckedUpdateInput>;
	};

	/**
	 * Employee delete
	 */
	export type EmployeeDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		/**
		 * Filter which Employee to delete.
		 */
		where: EmployeeWhereUniqueInput;
	};

	/**
	 * Employee deleteMany
	 */
	export type EmployeeDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Employees to delete
		 */
		where?: EmployeeWhereInput;
		/**
		 * Limit how many Employees to delete.
		 */
		limit?: number;
	};

	/**
	 * Employee.TimeLog
	 */
	export type Employee$TimeLogArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		where?: TimeLogWhereInput;
		orderBy?: TimeLogOrderByWithRelationInput | TimeLogOrderByWithRelationInput[];
		cursor?: TimeLogWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: TimeLogScalarFieldEnum | TimeLogScalarFieldEnum[];
	};

	/**
	 * Employee.User
	 */
	export type Employee$UserArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		where?: UserWhereInput;
	};

	/**
	 * Employee.TaskAssignment
	 */
	export type Employee$TaskAssignmentArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		where?: TaskAssignmentWhereInput;
		orderBy?: TaskAssignmentOrderByWithRelationInput | TaskAssignmentOrderByWithRelationInput[];
		cursor?: TaskAssignmentWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: TaskAssignmentScalarFieldEnum | TaskAssignmentScalarFieldEnum[];
	};

	/**
	 * Employee.PerformanceMetric
	 */
	export type Employee$PerformanceMetricArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		where?: PerformanceMetricWhereInput;
		orderBy?:
			| PerformanceMetricOrderByWithRelationInput
			| PerformanceMetricOrderByWithRelationInput[];
		cursor?: PerformanceMetricWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: PerformanceMetricScalarFieldEnum | PerformanceMetricScalarFieldEnum[];
	};

	/**
	 * Employee.defaultStation
	 */
	export type Employee$defaultStationArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		where?: StationWhereInput;
	};

	/**
	 * Employee.lastStation
	 */
	export type Employee$lastStationArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		where?: StationWhereInput;
	};

	/**
	 * Employee without action
	 */
	export type EmployeeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
	};

	/**
	 * Model OAuthAccount
	 */

	export type AggregateOAuthAccount = {
		_count: OAuthAccountCountAggregateOutputType | null;
		_min: OAuthAccountMinAggregateOutputType | null;
		_max: OAuthAccountMaxAggregateOutputType | null;
	};

	export type OAuthAccountMinAggregateOutputType = {
		provider: string | null;
		providerUserId: string | null;
		userId: string | null;
		accessToken: string | null;
		refreshToken: string | null;
		expiresAt: Date | null;
		scope: string | null;
		tokenType: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type OAuthAccountMaxAggregateOutputType = {
		provider: string | null;
		providerUserId: string | null;
		userId: string | null;
		accessToken: string | null;
		refreshToken: string | null;
		expiresAt: Date | null;
		scope: string | null;
		tokenType: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type OAuthAccountCountAggregateOutputType = {
		provider: number;
		providerUserId: number;
		userId: number;
		accessToken: number;
		refreshToken: number;
		expiresAt: number;
		scope: number;
		tokenType: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type OAuthAccountMinAggregateInputType = {
		provider?: true;
		providerUserId?: true;
		userId?: true;
		accessToken?: true;
		refreshToken?: true;
		expiresAt?: true;
		scope?: true;
		tokenType?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type OAuthAccountMaxAggregateInputType = {
		provider?: true;
		providerUserId?: true;
		userId?: true;
		accessToken?: true;
		refreshToken?: true;
		expiresAt?: true;
		scope?: true;
		tokenType?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type OAuthAccountCountAggregateInputType = {
		provider?: true;
		providerUserId?: true;
		userId?: true;
		accessToken?: true;
		refreshToken?: true;
		expiresAt?: true;
		scope?: true;
		tokenType?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type OAuthAccountAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which OAuthAccount to aggregate.
		 */
		where?: OAuthAccountWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of OAuthAccounts to fetch.
		 */
		orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: OAuthAccountWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` OAuthAccounts from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` OAuthAccounts.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned OAuthAccounts
		 **/
		_count?: true | OAuthAccountCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: OAuthAccountMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: OAuthAccountMaxAggregateInputType;
	};

	export type GetOAuthAccountAggregateType<T extends OAuthAccountAggregateArgs> = {
		[P in keyof T & keyof AggregateOAuthAccount]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateOAuthAccount[P]>
			: GetScalarType<T[P], AggregateOAuthAccount[P]>;
	};

	export type OAuthAccountGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: OAuthAccountWhereInput;
		orderBy?: OAuthAccountOrderByWithAggregationInput | OAuthAccountOrderByWithAggregationInput[];
		by: OAuthAccountScalarFieldEnum[] | OAuthAccountScalarFieldEnum;
		having?: OAuthAccountScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: OAuthAccountCountAggregateInputType | true;
		_min?: OAuthAccountMinAggregateInputType;
		_max?: OAuthAccountMaxAggregateInputType;
	};

	export type OAuthAccountGroupByOutputType = {
		provider: string;
		providerUserId: string;
		userId: string;
		accessToken: string | null;
		refreshToken: string | null;
		expiresAt: Date | null;
		scope: string | null;
		tokenType: string | null;
		createdAt: Date;
		updatedAt: Date;
		_count: OAuthAccountCountAggregateOutputType | null;
		_min: OAuthAccountMinAggregateOutputType | null;
		_max: OAuthAccountMaxAggregateOutputType | null;
	};

	type GetOAuthAccountGroupByPayload<T extends OAuthAccountGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<OAuthAccountGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof OAuthAccountGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], OAuthAccountGroupByOutputType[P]>
					: GetScalarType<T[P], OAuthAccountGroupByOutputType[P]>;
			}
		>
	>;

	export type OAuthAccountSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			provider?: boolean;
			providerUserId?: boolean;
			userId?: boolean;
			accessToken?: boolean;
			refreshToken?: boolean;
			expiresAt?: boolean;
			scope?: boolean;
			tokenType?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			User?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["oAuthAccount"]
	>;

	export type OAuthAccountSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			provider?: boolean;
			providerUserId?: boolean;
			userId?: boolean;
			accessToken?: boolean;
			refreshToken?: boolean;
			expiresAt?: boolean;
			scope?: boolean;
			tokenType?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			User?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["oAuthAccount"]
	>;

	export type OAuthAccountSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			provider?: boolean;
			providerUserId?: boolean;
			userId?: boolean;
			accessToken?: boolean;
			refreshToken?: boolean;
			expiresAt?: boolean;
			scope?: boolean;
			tokenType?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			User?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["oAuthAccount"]
	>;

	export type OAuthAccountSelectScalar = {
		provider?: boolean;
		providerUserId?: boolean;
		userId?: boolean;
		accessToken?: boolean;
		refreshToken?: boolean;
		expiresAt?: boolean;
		scope?: boolean;
		tokenType?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type OAuthAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<
			| "provider"
			| "providerUserId"
			| "userId"
			| "accessToken"
			| "refreshToken"
			| "expiresAt"
			| "scope"
			| "tokenType"
			| "createdAt"
			| "updatedAt",
			ExtArgs["result"]["oAuthAccount"]
		>;
	export type OAuthAccountInclude<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};
	export type OAuthAccountIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};
	export type OAuthAccountIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};

	export type $OAuthAccountPayload<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		name: "OAuthAccount";
		objects: {
			User: Prisma.$UserPayload<ExtArgs>;
		};
		scalars: $Extensions.GetPayloadResult<
			{
				provider: string;
				providerUserId: string;
				userId: string;
				accessToken: string | null;
				refreshToken: string | null;
				expiresAt: Date | null;
				scope: string | null;
				tokenType: string | null;
				createdAt: Date;
				updatedAt: Date;
			},
			ExtArgs["result"]["oAuthAccount"]
		>;
		composites: {};
	};

	type OAuthAccountGetPayload<S extends boolean | null | undefined | OAuthAccountDefaultArgs> =
		$Result.GetResult<Prisma.$OAuthAccountPayload, S>;

	type OAuthAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		Omit<OAuthAccountFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
			select?: OAuthAccountCountAggregateInputType | true;
		};

	export interface OAuthAccountDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["OAuthAccount"];
			meta: { name: "OAuthAccount" };
		};
		/**
		 * Find zero or one OAuthAccount that matches the filter.
		 * @param {OAuthAccountFindUniqueArgs} args - Arguments to find a OAuthAccount
		 * @example
		 * // Get one OAuthAccount
		 * const oAuthAccount = await prisma.oAuthAccount.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends OAuthAccountFindUniqueArgs>(
			args: SelectSubset<T, OAuthAccountFindUniqueArgs<ExtArgs>>
		): Prisma__OAuthAccountClient<
			$Result.GetResult<
				Prisma.$OAuthAccountPayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one OAuthAccount that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {OAuthAccountFindUniqueOrThrowArgs} args - Arguments to find a OAuthAccount
		 * @example
		 * // Get one OAuthAccount
		 * const oAuthAccount = await prisma.oAuthAccount.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends OAuthAccountFindUniqueOrThrowArgs>(
			args: SelectSubset<T, OAuthAccountFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__OAuthAccountClient<
			$Result.GetResult<
				Prisma.$OAuthAccountPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first OAuthAccount that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {OAuthAccountFindFirstArgs} args - Arguments to find a OAuthAccount
		 * @example
		 * // Get one OAuthAccount
		 * const oAuthAccount = await prisma.oAuthAccount.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends OAuthAccountFindFirstArgs>(
			args?: SelectSubset<T, OAuthAccountFindFirstArgs<ExtArgs>>
		): Prisma__OAuthAccountClient<
			$Result.GetResult<
				Prisma.$OAuthAccountPayload<ExtArgs>,
				T,
				"findFirst",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first OAuthAccount that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {OAuthAccountFindFirstOrThrowArgs} args - Arguments to find a OAuthAccount
		 * @example
		 * // Get one OAuthAccount
		 * const oAuthAccount = await prisma.oAuthAccount.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends OAuthAccountFindFirstOrThrowArgs>(
			args?: SelectSubset<T, OAuthAccountFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__OAuthAccountClient<
			$Result.GetResult<
				Prisma.$OAuthAccountPayload<ExtArgs>,
				T,
				"findFirstOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more OAuthAccounts that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {OAuthAccountFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all OAuthAccounts
		 * const oAuthAccounts = await prisma.oAuthAccount.findMany()
		 *
		 * // Get first 10 OAuthAccounts
		 * const oAuthAccounts = await prisma.oAuthAccount.findMany({ take: 10 })
		 *
		 * // Only select the `provider`
		 * const oAuthAccountWithProviderOnly = await prisma.oAuthAccount.findMany({ select: { provider: true } })
		 *
		 */
		findMany<T extends OAuthAccountFindManyArgs>(
			args?: SelectSubset<T, OAuthAccountFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a OAuthAccount.
		 * @param {OAuthAccountCreateArgs} args - Arguments to create a OAuthAccount.
		 * @example
		 * // Create one OAuthAccount
		 * const OAuthAccount = await prisma.oAuthAccount.create({
		 *   data: {
		 *     // ... data to create a OAuthAccount
		 *   }
		 * })
		 *
		 */
		create<T extends OAuthAccountCreateArgs>(
			args: SelectSubset<T, OAuthAccountCreateArgs<ExtArgs>>
		): Prisma__OAuthAccountClient<
			$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many OAuthAccounts.
		 * @param {OAuthAccountCreateManyArgs} args - Arguments to create many OAuthAccounts.
		 * @example
		 * // Create many OAuthAccounts
		 * const oAuthAccount = await prisma.oAuthAccount.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends OAuthAccountCreateManyArgs>(
			args?: SelectSubset<T, OAuthAccountCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many OAuthAccounts and returns the data saved in the database.
		 * @param {OAuthAccountCreateManyAndReturnArgs} args - Arguments to create many OAuthAccounts.
		 * @example
		 * // Create many OAuthAccounts
		 * const oAuthAccount = await prisma.oAuthAccount.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many OAuthAccounts and only return the `provider`
		 * const oAuthAccountWithProviderOnly = await prisma.oAuthAccount.createManyAndReturn({
		 *   select: { provider: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends OAuthAccountCreateManyAndReturnArgs>(
			args?: SelectSubset<T, OAuthAccountCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$OAuthAccountPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a OAuthAccount.
		 * @param {OAuthAccountDeleteArgs} args - Arguments to delete one OAuthAccount.
		 * @example
		 * // Delete one OAuthAccount
		 * const OAuthAccount = await prisma.oAuthAccount.delete({
		 *   where: {
		 *     // ... filter to delete one OAuthAccount
		 *   }
		 * })
		 *
		 */
		delete<T extends OAuthAccountDeleteArgs>(
			args: SelectSubset<T, OAuthAccountDeleteArgs<ExtArgs>>
		): Prisma__OAuthAccountClient<
			$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one OAuthAccount.
		 * @param {OAuthAccountUpdateArgs} args - Arguments to update one OAuthAccount.
		 * @example
		 * // Update one OAuthAccount
		 * const oAuthAccount = await prisma.oAuthAccount.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends OAuthAccountUpdateArgs>(
			args: SelectSubset<T, OAuthAccountUpdateArgs<ExtArgs>>
		): Prisma__OAuthAccountClient<
			$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more OAuthAccounts.
		 * @param {OAuthAccountDeleteManyArgs} args - Arguments to filter OAuthAccounts to delete.
		 * @example
		 * // Delete a few OAuthAccounts
		 * const { count } = await prisma.oAuthAccount.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends OAuthAccountDeleteManyArgs>(
			args?: SelectSubset<T, OAuthAccountDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more OAuthAccounts.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {OAuthAccountUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many OAuthAccounts
		 * const oAuthAccount = await prisma.oAuthAccount.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends OAuthAccountUpdateManyArgs>(
			args: SelectSubset<T, OAuthAccountUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more OAuthAccounts and returns the data updated in the database.
		 * @param {OAuthAccountUpdateManyAndReturnArgs} args - Arguments to update many OAuthAccounts.
		 * @example
		 * // Update many OAuthAccounts
		 * const oAuthAccount = await prisma.oAuthAccount.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more OAuthAccounts and only return the `provider`
		 * const oAuthAccountWithProviderOnly = await prisma.oAuthAccount.updateManyAndReturn({
		 *   select: { provider: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends OAuthAccountUpdateManyAndReturnArgs>(
			args: SelectSubset<T, OAuthAccountUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$OAuthAccountPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one OAuthAccount.
		 * @param {OAuthAccountUpsertArgs} args - Arguments to update or create a OAuthAccount.
		 * @example
		 * // Update or create a OAuthAccount
		 * const oAuthAccount = await prisma.oAuthAccount.upsert({
		 *   create: {
		 *     // ... data to create a OAuthAccount
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the OAuthAccount we want to update
		 *   }
		 * })
		 */
		upsert<T extends OAuthAccountUpsertArgs>(
			args: SelectSubset<T, OAuthAccountUpsertArgs<ExtArgs>>
		): Prisma__OAuthAccountClient<
			$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of OAuthAccounts.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {OAuthAccountCountArgs} args - Arguments to filter OAuthAccounts to count.
		 * @example
		 * // Count the number of OAuthAccounts
		 * const count = await prisma.oAuthAccount.count({
		 *   where: {
		 *     // ... the filter for the OAuthAccounts we want to count
		 *   }
		 * })
		 **/
		count<T extends OAuthAccountCountArgs>(
			args?: Subset<T, OAuthAccountCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], OAuthAccountCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a OAuthAccount.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {OAuthAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends OAuthAccountAggregateArgs>(
			args: Subset<T, OAuthAccountAggregateArgs>
		): Prisma.PrismaPromise<GetOAuthAccountAggregateType<T>>;

		/**
		 * Group by OAuthAccount.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {OAuthAccountGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends OAuthAccountGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: OAuthAccountGroupByArgs["orderBy"] }
				: { orderBy?: OAuthAccountGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, OAuthAccountGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors
			? GetOAuthAccountGroupByPayload<T>
			: Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the OAuthAccount model
		 */
		readonly fields: OAuthAccountFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for OAuthAccount.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__OAuthAccountClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		User<T extends UserDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, UserDefaultArgs<ExtArgs>>
		): Prisma__UserClient<
			| $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the OAuthAccount model
	 */
	interface OAuthAccountFieldRefs {
		readonly provider: FieldRef<"OAuthAccount", "String">;
		readonly providerUserId: FieldRef<"OAuthAccount", "String">;
		readonly userId: FieldRef<"OAuthAccount", "String">;
		readonly accessToken: FieldRef<"OAuthAccount", "String">;
		readonly refreshToken: FieldRef<"OAuthAccount", "String">;
		readonly expiresAt: FieldRef<"OAuthAccount", "DateTime">;
		readonly scope: FieldRef<"OAuthAccount", "String">;
		readonly tokenType: FieldRef<"OAuthAccount", "String">;
		readonly createdAt: FieldRef<"OAuthAccount", "DateTime">;
		readonly updatedAt: FieldRef<"OAuthAccount", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * OAuthAccount findUnique
	 */
	export type OAuthAccountFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * Filter, which OAuthAccount to fetch.
		 */
		where: OAuthAccountWhereUniqueInput;
	};

	/**
	 * OAuthAccount findUniqueOrThrow
	 */
	export type OAuthAccountFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * Filter, which OAuthAccount to fetch.
		 */
		where: OAuthAccountWhereUniqueInput;
	};

	/**
	 * OAuthAccount findFirst
	 */
	export type OAuthAccountFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * Filter, which OAuthAccount to fetch.
		 */
		where?: OAuthAccountWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of OAuthAccounts to fetch.
		 */
		orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for OAuthAccounts.
		 */
		cursor?: OAuthAccountWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` OAuthAccounts from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` OAuthAccounts.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of OAuthAccounts.
		 */
		distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[];
	};

	/**
	 * OAuthAccount findFirstOrThrow
	 */
	export type OAuthAccountFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * Filter, which OAuthAccount to fetch.
		 */
		where?: OAuthAccountWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of OAuthAccounts to fetch.
		 */
		orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for OAuthAccounts.
		 */
		cursor?: OAuthAccountWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` OAuthAccounts from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` OAuthAccounts.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of OAuthAccounts.
		 */
		distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[];
	};

	/**
	 * OAuthAccount findMany
	 */
	export type OAuthAccountFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * Filter, which OAuthAccounts to fetch.
		 */
		where?: OAuthAccountWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of OAuthAccounts to fetch.
		 */
		orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing OAuthAccounts.
		 */
		cursor?: OAuthAccountWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` OAuthAccounts from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` OAuthAccounts.
		 */
		skip?: number;
		distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[];
	};

	/**
	 * OAuthAccount create
	 */
	export type OAuthAccountCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * The data needed to create a OAuthAccount.
		 */
		data: XOR<OAuthAccountCreateInput, OAuthAccountUncheckedCreateInput>;
	};

	/**
	 * OAuthAccount createMany
	 */
	export type OAuthAccountCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many OAuthAccounts.
		 */
		data: OAuthAccountCreateManyInput | OAuthAccountCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * OAuthAccount createManyAndReturn
	 */
	export type OAuthAccountCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * The data used to create many OAuthAccounts.
		 */
		data: OAuthAccountCreateManyInput | OAuthAccountCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * OAuthAccount update
	 */
	export type OAuthAccountUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * The data needed to update a OAuthAccount.
		 */
		data: XOR<OAuthAccountUpdateInput, OAuthAccountUncheckedUpdateInput>;
		/**
		 * Choose, which OAuthAccount to update.
		 */
		where: OAuthAccountWhereUniqueInput;
	};

	/**
	 * OAuthAccount updateMany
	 */
	export type OAuthAccountUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update OAuthAccounts.
		 */
		data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyInput>;
		/**
		 * Filter which OAuthAccounts to update
		 */
		where?: OAuthAccountWhereInput;
		/**
		 * Limit how many OAuthAccounts to update.
		 */
		limit?: number;
	};

	/**
	 * OAuthAccount updateManyAndReturn
	 */
	export type OAuthAccountUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * The data used to update OAuthAccounts.
		 */
		data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyInput>;
		/**
		 * Filter which OAuthAccounts to update
		 */
		where?: OAuthAccountWhereInput;
		/**
		 * Limit how many OAuthAccounts to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * OAuthAccount upsert
	 */
	export type OAuthAccountUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * The filter to search for the OAuthAccount to update in case it exists.
		 */
		where: OAuthAccountWhereUniqueInput;
		/**
		 * In case the OAuthAccount found by the `where` argument doesn't exist, create a new OAuthAccount with this data.
		 */
		create: XOR<OAuthAccountCreateInput, OAuthAccountUncheckedCreateInput>;
		/**
		 * In case the OAuthAccount was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<OAuthAccountUpdateInput, OAuthAccountUncheckedUpdateInput>;
	};

	/**
	 * OAuthAccount delete
	 */
	export type OAuthAccountDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		/**
		 * Filter which OAuthAccount to delete.
		 */
		where: OAuthAccountWhereUniqueInput;
	};

	/**
	 * OAuthAccount deleteMany
	 */
	export type OAuthAccountDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which OAuthAccounts to delete
		 */
		where?: OAuthAccountWhereInput;
		/**
		 * Limit how many OAuthAccounts to delete.
		 */
		limit?: number;
	};

	/**
	 * OAuthAccount without action
	 */
	export type OAuthAccountDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
	};

	/**
	 * Model Session
	 */

	export type AggregateSession = {
		_count: SessionCountAggregateOutputType | null;
		_min: SessionMinAggregateOutputType | null;
		_max: SessionMaxAggregateOutputType | null;
	};

	export type SessionMinAggregateOutputType = {
		id: string | null;
		userId: string | null;
		expiresAt: Date | null;
		createdAt: Date | null;
	};

	export type SessionMaxAggregateOutputType = {
		id: string | null;
		userId: string | null;
		expiresAt: Date | null;
		createdAt: Date | null;
	};

	export type SessionCountAggregateOutputType = {
		id: number;
		userId: number;
		expiresAt: number;
		createdAt: number;
		_all: number;
	};

	export type SessionMinAggregateInputType = {
		id?: true;
		userId?: true;
		expiresAt?: true;
		createdAt?: true;
	};

	export type SessionMaxAggregateInputType = {
		id?: true;
		userId?: true;
		expiresAt?: true;
		createdAt?: true;
	};

	export type SessionCountAggregateInputType = {
		id?: true;
		userId?: true;
		expiresAt?: true;
		createdAt?: true;
		_all?: true;
	};

	export type SessionAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Session to aggregate.
		 */
		where?: SessionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Sessions to fetch.
		 */
		orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: SessionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Sessions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Sessions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Sessions
		 **/
		_count?: true | SessionCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: SessionMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: SessionMaxAggregateInputType;
	};

	export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
		[P in keyof T & keyof AggregateSession]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateSession[P]>
			: GetScalarType<T[P], AggregateSession[P]>;
	};

	export type SessionGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: SessionWhereInput;
		orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[];
		by: SessionScalarFieldEnum[] | SessionScalarFieldEnum;
		having?: SessionScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: SessionCountAggregateInputType | true;
		_min?: SessionMinAggregateInputType;
		_max?: SessionMaxAggregateInputType;
	};

	export type SessionGroupByOutputType = {
		id: string;
		userId: string;
		expiresAt: Date;
		createdAt: Date;
		_count: SessionCountAggregateOutputType | null;
		_min: SessionMinAggregateOutputType | null;
		_max: SessionMaxAggregateOutputType | null;
	};

	type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<SessionGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof SessionGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], SessionGroupByOutputType[P]>
					: GetScalarType<T[P], SessionGroupByOutputType[P]>;
			}
		>
	>;

	export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetSelect<
			{
				id?: boolean;
				userId?: boolean;
				expiresAt?: boolean;
				createdAt?: boolean;
				User?: boolean | UserDefaultArgs<ExtArgs>;
			},
			ExtArgs["result"]["session"]
		>;

	export type SessionSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			userId?: boolean;
			expiresAt?: boolean;
			createdAt?: boolean;
			User?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["session"]
	>;

	export type SessionSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			userId?: boolean;
			expiresAt?: boolean;
			createdAt?: boolean;
			User?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["session"]
	>;

	export type SessionSelectScalar = {
		id?: boolean;
		userId?: boolean;
		expiresAt?: boolean;
		createdAt?: boolean;
	};

	export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<"id" | "userId" | "expiresAt" | "createdAt", ExtArgs["result"]["session"]>;
	export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};
	export type SessionIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};
	export type SessionIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};

	export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			name: "Session";
			objects: {
				User: Prisma.$UserPayload<ExtArgs>;
			};
			scalars: $Extensions.GetPayloadResult<
				{
					id: string;
					userId: string;
					expiresAt: Date;
					createdAt: Date;
				},
				ExtArgs["result"]["session"]
			>;
			composites: {};
		};

	type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> =
		$Result.GetResult<Prisma.$SessionPayload, S>;

	type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		SessionFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: SessionCountAggregateInputType | true;
	};

	export interface SessionDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Session"]; meta: { name: "Session" } };
		/**
		 * Find zero or one Session that matches the filter.
		 * @param {SessionFindUniqueArgs} args - Arguments to find a Session
		 * @example
		 * // Get one Session
		 * const session = await prisma.session.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends SessionFindUniqueArgs>(
			args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>
		): Prisma__SessionClient<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one Session that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
		 * @example
		 * // Get one Session
		 * const session = await prisma.session.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(
			args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__SessionClient<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Session that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SessionFindFirstArgs} args - Arguments to find a Session
		 * @example
		 * // Get one Session
		 * const session = await prisma.session.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends SessionFindFirstArgs>(
			args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>
		): Prisma__SessionClient<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Session that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
		 * @example
		 * // Get one Session
		 * const session = await prisma.session.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(
			args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__SessionClient<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Sessions that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Sessions
		 * const sessions = await prisma.session.findMany()
		 *
		 * // Get first 10 Sessions
		 * const sessions = await prisma.session.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends SessionFindManyArgs>(
			args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a Session.
		 * @param {SessionCreateArgs} args - Arguments to create a Session.
		 * @example
		 * // Create one Session
		 * const Session = await prisma.session.create({
		 *   data: {
		 *     // ... data to create a Session
		 *   }
		 * })
		 *
		 */
		create<T extends SessionCreateArgs>(
			args: SelectSubset<T, SessionCreateArgs<ExtArgs>>
		): Prisma__SessionClient<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many Sessions.
		 * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
		 * @example
		 * // Create many Sessions
		 * const session = await prisma.session.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends SessionCreateManyArgs>(
			args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Sessions and returns the data saved in the database.
		 * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
		 * @example
		 * // Create many Sessions
		 * const session = await prisma.session.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Sessions and only return the `id`
		 * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(
			args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$SessionPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a Session.
		 * @param {SessionDeleteArgs} args - Arguments to delete one Session.
		 * @example
		 * // Delete one Session
		 * const Session = await prisma.session.delete({
		 *   where: {
		 *     // ... filter to delete one Session
		 *   }
		 * })
		 *
		 */
		delete<T extends SessionDeleteArgs>(
			args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>
		): Prisma__SessionClient<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one Session.
		 * @param {SessionUpdateArgs} args - Arguments to update one Session.
		 * @example
		 * // Update one Session
		 * const session = await prisma.session.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends SessionUpdateArgs>(
			args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>
		): Prisma__SessionClient<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more Sessions.
		 * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
		 * @example
		 * // Delete a few Sessions
		 * const { count } = await prisma.session.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends SessionDeleteManyArgs>(
			args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Sessions.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Sessions
		 * const session = await prisma.session.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends SessionUpdateManyArgs>(
			args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Sessions and returns the data updated in the database.
		 * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
		 * @example
		 * // Update many Sessions
		 * const session = await prisma.session.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Sessions and only return the `id`
		 * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(
			args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$SessionPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one Session.
		 * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
		 * @example
		 * // Update or create a Session
		 * const session = await prisma.session.upsert({
		 *   create: {
		 *     // ... data to create a Session
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the Session we want to update
		 *   }
		 * })
		 */
		upsert<T extends SessionUpsertArgs>(
			args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>
		): Prisma__SessionClient<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of Sessions.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
		 * @example
		 * // Count the number of Sessions
		 * const count = await prisma.session.count({
		 *   where: {
		 *     // ... the filter for the Sessions we want to count
		 *   }
		 * })
		 **/
		count<T extends SessionCountArgs>(
			args?: Subset<T, SessionCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], SessionCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a Session.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends SessionAggregateArgs>(
			args: Subset<T, SessionAggregateArgs>
		): Prisma.PrismaPromise<GetSessionAggregateType<T>>;

		/**
		 * Group by Session.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {SessionGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends SessionGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: SessionGroupByArgs["orderBy"] }
				: { orderBy?: SessionGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the Session model
		 */
		readonly fields: SessionFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for Session.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__SessionClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		User<T extends UserDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, UserDefaultArgs<ExtArgs>>
		): Prisma__UserClient<
			| $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the Session model
	 */
	interface SessionFieldRefs {
		readonly id: FieldRef<"Session", "String">;
		readonly userId: FieldRef<"Session", "String">;
		readonly expiresAt: FieldRef<"Session", "DateTime">;
		readonly createdAt: FieldRef<"Session", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * Session findUnique
	 */
	export type SessionFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * Filter, which Session to fetch.
		 */
		where: SessionWhereUniqueInput;
	};

	/**
	 * Session findUniqueOrThrow
	 */
	export type SessionFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * Filter, which Session to fetch.
		 */
		where: SessionWhereUniqueInput;
	};

	/**
	 * Session findFirst
	 */
	export type SessionFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * Filter, which Session to fetch.
		 */
		where?: SessionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Sessions to fetch.
		 */
		orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Sessions.
		 */
		cursor?: SessionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Sessions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Sessions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Sessions.
		 */
		distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
	};

	/**
	 * Session findFirstOrThrow
	 */
	export type SessionFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * Filter, which Session to fetch.
		 */
		where?: SessionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Sessions to fetch.
		 */
		orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Sessions.
		 */
		cursor?: SessionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Sessions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Sessions.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Sessions.
		 */
		distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
	};

	/**
	 * Session findMany
	 */
	export type SessionFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * Filter, which Sessions to fetch.
		 */
		where?: SessionWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Sessions to fetch.
		 */
		orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing Sessions.
		 */
		cursor?: SessionWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Sessions from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Sessions.
		 */
		skip?: number;
		distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
	};

	/**
	 * Session create
	 */
	export type SessionCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * The data needed to create a Session.
		 */
		data: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
	};

	/**
	 * Session createMany
	 */
	export type SessionCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many Sessions.
		 */
		data: SessionCreateManyInput | SessionCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Session createManyAndReturn
	 */
	export type SessionCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * The data used to create many Sessions.
		 */
		data: SessionCreateManyInput | SessionCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * Session update
	 */
	export type SessionUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * The data needed to update a Session.
		 */
		data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
		/**
		 * Choose, which Session to update.
		 */
		where: SessionWhereUniqueInput;
	};

	/**
	 * Session updateMany
	 */
	export type SessionUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update Sessions.
		 */
		data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
		/**
		 * Filter which Sessions to update
		 */
		where?: SessionWhereInput;
		/**
		 * Limit how many Sessions to update.
		 */
		limit?: number;
	};

	/**
	 * Session updateManyAndReturn
	 */
	export type SessionUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * The data used to update Sessions.
		 */
		data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
		/**
		 * Filter which Sessions to update
		 */
		where?: SessionWhereInput;
		/**
		 * Limit how many Sessions to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * Session upsert
	 */
	export type SessionUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * The filter to search for the Session to update in case it exists.
		 */
		where: SessionWhereUniqueInput;
		/**
		 * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
		 */
		create: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
		/**
		 * In case the Session was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
	};

	/**
	 * Session delete
	 */
	export type SessionDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
		/**
		 * Filter which Session to delete.
		 */
		where: SessionWhereUniqueInput;
	};

	/**
	 * Session deleteMany
	 */
	export type SessionDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Sessions to delete
		 */
		where?: SessionWhereInput;
		/**
		 * Limit how many Sessions to delete.
		 */
		limit?: number;
	};

	/**
	 * Session without action
	 */
	export type SessionDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Session
		 */
		select?: SessionSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Session
		 */
		omit?: SessionOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: SessionInclude<ExtArgs> | null;
	};

	/**
	 * Model Station
	 */

	export type AggregateStation = {
		_count: StationCountAggregateOutputType | null;
		_avg: StationAvgAggregateOutputType | null;
		_sum: StationSumAggregateOutputType | null;
		_min: StationMinAggregateOutputType | null;
		_max: StationMaxAggregateOutputType | null;
	};

	export type StationAvgAggregateOutputType = {
		capacity: number | null;
	};

	export type StationSumAggregateOutputType = {
		capacity: number | null;
	};

	export type StationMinAggregateOutputType = {
		id: string | null;
		name: string | null;
		description: string | null;
		capacity: number | null;
		isActive: boolean | null;
		zone: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type StationMaxAggregateOutputType = {
		id: string | null;
		name: string | null;
		description: string | null;
		capacity: number | null;
		isActive: boolean | null;
		zone: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type StationCountAggregateOutputType = {
		id: number;
		name: number;
		description: number;
		capacity: number;
		isActive: number;
		zone: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type StationAvgAggregateInputType = {
		capacity?: true;
	};

	export type StationSumAggregateInputType = {
		capacity?: true;
	};

	export type StationMinAggregateInputType = {
		id?: true;
		name?: true;
		description?: true;
		capacity?: true;
		isActive?: true;
		zone?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type StationMaxAggregateInputType = {
		id?: true;
		name?: true;
		description?: true;
		capacity?: true;
		isActive?: true;
		zone?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type StationCountAggregateInputType = {
		id?: true;
		name?: true;
		description?: true;
		capacity?: true;
		isActive?: true;
		zone?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type StationAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Station to aggregate.
		 */
		where?: StationWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Stations to fetch.
		 */
		orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: StationWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Stations from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Stations.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Stations
		 **/
		_count?: true | StationCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to average
		 **/
		_avg?: StationAvgAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to sum
		 **/
		_sum?: StationSumAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: StationMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: StationMaxAggregateInputType;
	};

	export type GetStationAggregateType<T extends StationAggregateArgs> = {
		[P in keyof T & keyof AggregateStation]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateStation[P]>
			: GetScalarType<T[P], AggregateStation[P]>;
	};

	export type StationGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: StationWhereInput;
		orderBy?: StationOrderByWithAggregationInput | StationOrderByWithAggregationInput[];
		by: StationScalarFieldEnum[] | StationScalarFieldEnum;
		having?: StationScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: StationCountAggregateInputType | true;
		_avg?: StationAvgAggregateInputType;
		_sum?: StationSumAggregateInputType;
		_min?: StationMinAggregateInputType;
		_max?: StationMaxAggregateInputType;
	};

	export type StationGroupByOutputType = {
		id: string;
		name: string;
		description: string | null;
		capacity: number | null;
		isActive: boolean;
		zone: string | null;
		createdAt: Date;
		updatedAt: Date;
		_count: StationCountAggregateOutputType | null;
		_avg: StationAvgAggregateOutputType | null;
		_sum: StationSumAggregateOutputType | null;
		_min: StationMinAggregateOutputType | null;
		_max: StationMaxAggregateOutputType | null;
	};

	type GetStationGroupByPayload<T extends StationGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<StationGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof StationGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], StationGroupByOutputType[P]>
					: GetScalarType<T[P], StationGroupByOutputType[P]>;
			}
		>
	>;

	export type StationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetSelect<
			{
				id?: boolean;
				name?: boolean;
				description?: boolean;
				capacity?: boolean;
				isActive?: boolean;
				zone?: boolean;
				createdAt?: boolean;
				updatedAt?: boolean;
				TimeLog?: boolean | Station$TimeLogArgs<ExtArgs>;
				TaskType?: boolean | Station$TaskTypeArgs<ExtArgs>;
				employeesAtLastStation?: boolean | Station$employeesAtLastStationArgs<ExtArgs>;
				employeesWithDefault?: boolean | Station$employeesWithDefaultArgs<ExtArgs>;
				_count?: boolean | StationCountOutputTypeDefaultArgs<ExtArgs>;
			},
			ExtArgs["result"]["station"]
		>;

	export type StationSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			name?: boolean;
			description?: boolean;
			capacity?: boolean;
			isActive?: boolean;
			zone?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
		},
		ExtArgs["result"]["station"]
	>;

	export type StationSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			name?: boolean;
			description?: boolean;
			capacity?: boolean;
			isActive?: boolean;
			zone?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
		},
		ExtArgs["result"]["station"]
	>;

	export type StationSelectScalar = {
		id?: boolean;
		name?: boolean;
		description?: boolean;
		capacity?: boolean;
		isActive?: boolean;
		zone?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type StationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<
			"id" | "name" | "description" | "capacity" | "isActive" | "zone" | "createdAt" | "updatedAt",
			ExtArgs["result"]["station"]
		>;
	export type StationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		TimeLog?: boolean | Station$TimeLogArgs<ExtArgs>;
		TaskType?: boolean | Station$TaskTypeArgs<ExtArgs>;
		employeesAtLastStation?: boolean | Station$employeesAtLastStationArgs<ExtArgs>;
		employeesWithDefault?: boolean | Station$employeesWithDefaultArgs<ExtArgs>;
		_count?: boolean | StationCountOutputTypeDefaultArgs<ExtArgs>;
	};
	export type StationIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {};
	export type StationIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {};

	export type $StationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			name: "Station";
			objects: {
				TimeLog: Prisma.$TimeLogPayload<ExtArgs>[];
				TaskType: Prisma.$TaskTypePayload<ExtArgs>[];
				employeesAtLastStation: Prisma.$EmployeePayload<ExtArgs>[];
				employeesWithDefault: Prisma.$EmployeePayload<ExtArgs>[];
			};
			scalars: $Extensions.GetPayloadResult<
				{
					id: string;
					name: string;
					description: string | null;
					capacity: number | null;
					isActive: boolean;
					zone: string | null;
					createdAt: Date;
					updatedAt: Date;
				},
				ExtArgs["result"]["station"]
			>;
			composites: {};
		};

	type StationGetPayload<S extends boolean | null | undefined | StationDefaultArgs> =
		$Result.GetResult<Prisma.$StationPayload, S>;

	type StationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		StationFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: StationCountAggregateInputType | true;
	};

	export interface StationDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Station"]; meta: { name: "Station" } };
		/**
		 * Find zero or one Station that matches the filter.
		 * @param {StationFindUniqueArgs} args - Arguments to find a Station
		 * @example
		 * // Get one Station
		 * const station = await prisma.station.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends StationFindUniqueArgs>(
			args: SelectSubset<T, StationFindUniqueArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one Station that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {StationFindUniqueOrThrowArgs} args - Arguments to find a Station
		 * @example
		 * // Get one Station
		 * const station = await prisma.station.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends StationFindUniqueOrThrowArgs>(
			args: SelectSubset<T, StationFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Station that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {StationFindFirstArgs} args - Arguments to find a Station
		 * @example
		 * // Get one Station
		 * const station = await prisma.station.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends StationFindFirstArgs>(
			args?: SelectSubset<T, StationFindFirstArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Station that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {StationFindFirstOrThrowArgs} args - Arguments to find a Station
		 * @example
		 * // Get one Station
		 * const station = await prisma.station.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends StationFindFirstOrThrowArgs>(
			args?: SelectSubset<T, StationFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Stations that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {StationFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Stations
		 * const stations = await prisma.station.findMany()
		 *
		 * // Get first 10 Stations
		 * const stations = await prisma.station.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const stationWithIdOnly = await prisma.station.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends StationFindManyArgs>(
			args?: SelectSubset<T, StationFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a Station.
		 * @param {StationCreateArgs} args - Arguments to create a Station.
		 * @example
		 * // Create one Station
		 * const Station = await prisma.station.create({
		 *   data: {
		 *     // ... data to create a Station
		 *   }
		 * })
		 *
		 */
		create<T extends StationCreateArgs>(
			args: SelectSubset<T, StationCreateArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many Stations.
		 * @param {StationCreateManyArgs} args - Arguments to create many Stations.
		 * @example
		 * // Create many Stations
		 * const station = await prisma.station.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends StationCreateManyArgs>(
			args?: SelectSubset<T, StationCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Stations and returns the data saved in the database.
		 * @param {StationCreateManyAndReturnArgs} args - Arguments to create many Stations.
		 * @example
		 * // Create many Stations
		 * const station = await prisma.station.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Stations and only return the `id`
		 * const stationWithIdOnly = await prisma.station.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends StationCreateManyAndReturnArgs>(
			args?: SelectSubset<T, StationCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$StationPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a Station.
		 * @param {StationDeleteArgs} args - Arguments to delete one Station.
		 * @example
		 * // Delete one Station
		 * const Station = await prisma.station.delete({
		 *   where: {
		 *     // ... filter to delete one Station
		 *   }
		 * })
		 *
		 */
		delete<T extends StationDeleteArgs>(
			args: SelectSubset<T, StationDeleteArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one Station.
		 * @param {StationUpdateArgs} args - Arguments to update one Station.
		 * @example
		 * // Update one Station
		 * const station = await prisma.station.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends StationUpdateArgs>(
			args: SelectSubset<T, StationUpdateArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more Stations.
		 * @param {StationDeleteManyArgs} args - Arguments to filter Stations to delete.
		 * @example
		 * // Delete a few Stations
		 * const { count } = await prisma.station.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends StationDeleteManyArgs>(
			args?: SelectSubset<T, StationDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Stations.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {StationUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Stations
		 * const station = await prisma.station.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends StationUpdateManyArgs>(
			args: SelectSubset<T, StationUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Stations and returns the data updated in the database.
		 * @param {StationUpdateManyAndReturnArgs} args - Arguments to update many Stations.
		 * @example
		 * // Update many Stations
		 * const station = await prisma.station.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Stations and only return the `id`
		 * const stationWithIdOnly = await prisma.station.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends StationUpdateManyAndReturnArgs>(
			args: SelectSubset<T, StationUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$StationPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one Station.
		 * @param {StationUpsertArgs} args - Arguments to update or create a Station.
		 * @example
		 * // Update or create a Station
		 * const station = await prisma.station.upsert({
		 *   create: {
		 *     // ... data to create a Station
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the Station we want to update
		 *   }
		 * })
		 */
		upsert<T extends StationUpsertArgs>(
			args: SelectSubset<T, StationUpsertArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of Stations.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {StationCountArgs} args - Arguments to filter Stations to count.
		 * @example
		 * // Count the number of Stations
		 * const count = await prisma.station.count({
		 *   where: {
		 *     // ... the filter for the Stations we want to count
		 *   }
		 * })
		 **/
		count<T extends StationCountArgs>(
			args?: Subset<T, StationCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], StationCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a Station.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {StationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends StationAggregateArgs>(
			args: Subset<T, StationAggregateArgs>
		): Prisma.PrismaPromise<GetStationAggregateType<T>>;

		/**
		 * Group by Station.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {StationGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends StationGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: StationGroupByArgs["orderBy"] }
				: { orderBy?: StationGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, StationGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors ? GetStationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the Station model
		 */
		readonly fields: StationFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for Station.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__StationClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		TimeLog<T extends Station$TimeLogArgs<ExtArgs> = {}>(
			args?: Subset<T, Station$TimeLogArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
		>;
		TaskType<T extends Station$TaskTypeArgs<ExtArgs> = {}>(
			args?: Subset<T, Station$TaskTypeArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TaskTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
		>;
		employeesAtLastStation<T extends Station$employeesAtLastStationArgs<ExtArgs> = {}>(
			args?: Subset<T, Station$employeesAtLastStationArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
		>;
		employeesWithDefault<T extends Station$employeesWithDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, Station$employeesWithDefaultArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the Station model
	 */
	interface StationFieldRefs {
		readonly id: FieldRef<"Station", "String">;
		readonly name: FieldRef<"Station", "String">;
		readonly description: FieldRef<"Station", "String">;
		readonly capacity: FieldRef<"Station", "Int">;
		readonly isActive: FieldRef<"Station", "Boolean">;
		readonly zone: FieldRef<"Station", "String">;
		readonly createdAt: FieldRef<"Station", "DateTime">;
		readonly updatedAt: FieldRef<"Station", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * Station findUnique
	 */
	export type StationFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * Filter, which Station to fetch.
		 */
		where: StationWhereUniqueInput;
	};

	/**
	 * Station findUniqueOrThrow
	 */
	export type StationFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * Filter, which Station to fetch.
		 */
		where: StationWhereUniqueInput;
	};

	/**
	 * Station findFirst
	 */
	export type StationFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * Filter, which Station to fetch.
		 */
		where?: StationWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Stations to fetch.
		 */
		orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Stations.
		 */
		cursor?: StationWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Stations from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Stations.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Stations.
		 */
		distinct?: StationScalarFieldEnum | StationScalarFieldEnum[];
	};

	/**
	 * Station findFirstOrThrow
	 */
	export type StationFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * Filter, which Station to fetch.
		 */
		where?: StationWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Stations to fetch.
		 */
		orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Stations.
		 */
		cursor?: StationWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Stations from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Stations.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Stations.
		 */
		distinct?: StationScalarFieldEnum | StationScalarFieldEnum[];
	};

	/**
	 * Station findMany
	 */
	export type StationFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * Filter, which Stations to fetch.
		 */
		where?: StationWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Stations to fetch.
		 */
		orderBy?: StationOrderByWithRelationInput | StationOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing Stations.
		 */
		cursor?: StationWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Stations from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Stations.
		 */
		skip?: number;
		distinct?: StationScalarFieldEnum | StationScalarFieldEnum[];
	};

	/**
	 * Station create
	 */
	export type StationCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * The data needed to create a Station.
		 */
		data: XOR<StationCreateInput, StationUncheckedCreateInput>;
	};

	/**
	 * Station createMany
	 */
	export type StationCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many Stations.
		 */
		data: StationCreateManyInput | StationCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Station createManyAndReturn
	 */
	export type StationCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * The data used to create many Stations.
		 */
		data: StationCreateManyInput | StationCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Station update
	 */
	export type StationUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * The data needed to update a Station.
		 */
		data: XOR<StationUpdateInput, StationUncheckedUpdateInput>;
		/**
		 * Choose, which Station to update.
		 */
		where: StationWhereUniqueInput;
	};

	/**
	 * Station updateMany
	 */
	export type StationUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update Stations.
		 */
		data: XOR<StationUpdateManyMutationInput, StationUncheckedUpdateManyInput>;
		/**
		 * Filter which Stations to update
		 */
		where?: StationWhereInput;
		/**
		 * Limit how many Stations to update.
		 */
		limit?: number;
	};

	/**
	 * Station updateManyAndReturn
	 */
	export type StationUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * The data used to update Stations.
		 */
		data: XOR<StationUpdateManyMutationInput, StationUncheckedUpdateManyInput>;
		/**
		 * Filter which Stations to update
		 */
		where?: StationWhereInput;
		/**
		 * Limit how many Stations to update.
		 */
		limit?: number;
	};

	/**
	 * Station upsert
	 */
	export type StationUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * The filter to search for the Station to update in case it exists.
		 */
		where: StationWhereUniqueInput;
		/**
		 * In case the Station found by the `where` argument doesn't exist, create a new Station with this data.
		 */
		create: XOR<StationCreateInput, StationUncheckedCreateInput>;
		/**
		 * In case the Station was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<StationUpdateInput, StationUncheckedUpdateInput>;
	};

	/**
	 * Station delete
	 */
	export type StationDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		/**
		 * Filter which Station to delete.
		 */
		where: StationWhereUniqueInput;
	};

	/**
	 * Station deleteMany
	 */
	export type StationDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Stations to delete
		 */
		where?: StationWhereInput;
		/**
		 * Limit how many Stations to delete.
		 */
		limit?: number;
	};

	/**
	 * Station.TimeLog
	 */
	export type Station$TimeLogArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		where?: TimeLogWhereInput;
		orderBy?: TimeLogOrderByWithRelationInput | TimeLogOrderByWithRelationInput[];
		cursor?: TimeLogWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: TimeLogScalarFieldEnum | TimeLogScalarFieldEnum[];
	};

	/**
	 * Station.TaskType
	 */
	export type Station$TaskTypeArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		where?: TaskTypeWhereInput;
		orderBy?: TaskTypeOrderByWithRelationInput | TaskTypeOrderByWithRelationInput[];
		cursor?: TaskTypeWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: TaskTypeScalarFieldEnum | TaskTypeScalarFieldEnum[];
	};

	/**
	 * Station.employeesAtLastStation
	 */
	export type Station$employeesAtLastStationArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		where?: EmployeeWhereInput;
		orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[];
		cursor?: EmployeeWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[];
	};

	/**
	 * Station.employeesWithDefault
	 */
	export type Station$employeesWithDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		where?: EmployeeWhereInput;
		orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[];
		cursor?: EmployeeWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[];
	};

	/**
	 * Station without action
	 */
	export type StationDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
	};

	/**
	 * Model TimeLog
	 */

	export type AggregateTimeLog = {
		_count: TimeLogCountAggregateOutputType | null;
		_min: TimeLogMinAggregateOutputType | null;
		_max: TimeLogMaxAggregateOutputType | null;
	};

	export type TimeLogMinAggregateOutputType = {
		id: string | null;
		employeeId: string | null;
		stationId: string | null;
		type: $Enums.TimeLog_type | null;
		startTime: Date | null;
		endTime: Date | null;
		note: string | null;
		deletedAt: Date | null;
		correctedBy: string | null;
		taskId: string | null;
		clockMethod: $Enums.ClockMethod | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type TimeLogMaxAggregateOutputType = {
		id: string | null;
		employeeId: string | null;
		stationId: string | null;
		type: $Enums.TimeLog_type | null;
		startTime: Date | null;
		endTime: Date | null;
		note: string | null;
		deletedAt: Date | null;
		correctedBy: string | null;
		taskId: string | null;
		clockMethod: $Enums.ClockMethod | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type TimeLogCountAggregateOutputType = {
		id: number;
		employeeId: number;
		stationId: number;
		type: number;
		startTime: number;
		endTime: number;
		note: number;
		deletedAt: number;
		correctedBy: number;
		taskId: number;
		clockMethod: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type TimeLogMinAggregateInputType = {
		id?: true;
		employeeId?: true;
		stationId?: true;
		type?: true;
		startTime?: true;
		endTime?: true;
		note?: true;
		deletedAt?: true;
		correctedBy?: true;
		taskId?: true;
		clockMethod?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type TimeLogMaxAggregateInputType = {
		id?: true;
		employeeId?: true;
		stationId?: true;
		type?: true;
		startTime?: true;
		endTime?: true;
		note?: true;
		deletedAt?: true;
		correctedBy?: true;
		taskId?: true;
		clockMethod?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type TimeLogCountAggregateInputType = {
		id?: true;
		employeeId?: true;
		stationId?: true;
		type?: true;
		startTime?: true;
		endTime?: true;
		note?: true;
		deletedAt?: true;
		correctedBy?: true;
		taskId?: true;
		clockMethod?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type TimeLogAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which TimeLog to aggregate.
		 */
		where?: TimeLogWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TimeLogs to fetch.
		 */
		orderBy?: TimeLogOrderByWithRelationInput | TimeLogOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: TimeLogWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TimeLogs from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TimeLogs.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned TimeLogs
		 **/
		_count?: true | TimeLogCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: TimeLogMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: TimeLogMaxAggregateInputType;
	};

	export type GetTimeLogAggregateType<T extends TimeLogAggregateArgs> = {
		[P in keyof T & keyof AggregateTimeLog]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateTimeLog[P]>
			: GetScalarType<T[P], AggregateTimeLog[P]>;
	};

	export type TimeLogGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TimeLogWhereInput;
		orderBy?: TimeLogOrderByWithAggregationInput | TimeLogOrderByWithAggregationInput[];
		by: TimeLogScalarFieldEnum[] | TimeLogScalarFieldEnum;
		having?: TimeLogScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: TimeLogCountAggregateInputType | true;
		_min?: TimeLogMinAggregateInputType;
		_max?: TimeLogMaxAggregateInputType;
	};

	export type TimeLogGroupByOutputType = {
		id: string;
		employeeId: string;
		stationId: string | null;
		type: $Enums.TimeLog_type;
		startTime: Date;
		endTime: Date | null;
		note: string | null;
		deletedAt: Date | null;
		correctedBy: string | null;
		taskId: string | null;
		clockMethod: $Enums.ClockMethod;
		createdAt: Date;
		updatedAt: Date;
		_count: TimeLogCountAggregateOutputType | null;
		_min: TimeLogMinAggregateOutputType | null;
		_max: TimeLogMaxAggregateOutputType | null;
	};

	type GetTimeLogGroupByPayload<T extends TimeLogGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<TimeLogGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof TimeLogGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], TimeLogGroupByOutputType[P]>
					: GetScalarType<T[P], TimeLogGroupByOutputType[P]>;
			}
		>
	>;

	export type TimeLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetSelect<
			{
				id?: boolean;
				employeeId?: boolean;
				stationId?: boolean;
				type?: boolean;
				startTime?: boolean;
				endTime?: boolean;
				note?: boolean;
				deletedAt?: boolean;
				correctedBy?: boolean;
				taskId?: boolean;
				clockMethod?: boolean;
				createdAt?: boolean;
				updatedAt?: boolean;
				Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
				Station?: boolean | TimeLog$StationArgs<ExtArgs>;
				Task?: boolean | TimeLog$TaskArgs<ExtArgs>;
			},
			ExtArgs["result"]["timeLog"]
		>;

	export type TimeLogSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			employeeId?: boolean;
			stationId?: boolean;
			type?: boolean;
			startTime?: boolean;
			endTime?: boolean;
			note?: boolean;
			deletedAt?: boolean;
			correctedBy?: boolean;
			taskId?: boolean;
			clockMethod?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
			Station?: boolean | TimeLog$StationArgs<ExtArgs>;
			Task?: boolean | TimeLog$TaskArgs<ExtArgs>;
		},
		ExtArgs["result"]["timeLog"]
	>;

	export type TimeLogSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			employeeId?: boolean;
			stationId?: boolean;
			type?: boolean;
			startTime?: boolean;
			endTime?: boolean;
			note?: boolean;
			deletedAt?: boolean;
			correctedBy?: boolean;
			taskId?: boolean;
			clockMethod?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
			Station?: boolean | TimeLog$StationArgs<ExtArgs>;
			Task?: boolean | TimeLog$TaskArgs<ExtArgs>;
		},
		ExtArgs["result"]["timeLog"]
	>;

	export type TimeLogSelectScalar = {
		id?: boolean;
		employeeId?: boolean;
		stationId?: boolean;
		type?: boolean;
		startTime?: boolean;
		endTime?: boolean;
		note?: boolean;
		deletedAt?: boolean;
		correctedBy?: boolean;
		taskId?: boolean;
		clockMethod?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type TimeLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<
			| "id"
			| "employeeId"
			| "stationId"
			| "type"
			| "startTime"
			| "endTime"
			| "note"
			| "deletedAt"
			| "correctedBy"
			| "taskId"
			| "clockMethod"
			| "createdAt"
			| "updatedAt",
			ExtArgs["result"]["timeLog"]
		>;
	export type TimeLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		Station?: boolean | TimeLog$StationArgs<ExtArgs>;
		Task?: boolean | TimeLog$TaskArgs<ExtArgs>;
	};
	export type TimeLogIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		Station?: boolean | TimeLog$StationArgs<ExtArgs>;
		Task?: boolean | TimeLog$TaskArgs<ExtArgs>;
	};
	export type TimeLogIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		Station?: boolean | TimeLog$StationArgs<ExtArgs>;
		Task?: boolean | TimeLog$TaskArgs<ExtArgs>;
	};

	export type $TimeLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			name: "TimeLog";
			objects: {
				Employee: Prisma.$EmployeePayload<ExtArgs>;
				Station: Prisma.$StationPayload<ExtArgs> | null;
				Task: Prisma.$TaskAssignmentPayload<ExtArgs> | null;
			};
			scalars: $Extensions.GetPayloadResult<
				{
					id: string;
					employeeId: string;
					stationId: string | null;
					type: $Enums.TimeLog_type;
					startTime: Date;
					endTime: Date | null;
					note: string | null;
					deletedAt: Date | null;
					correctedBy: string | null;
					taskId: string | null;
					clockMethod: $Enums.ClockMethod;
					createdAt: Date;
					updatedAt: Date;
				},
				ExtArgs["result"]["timeLog"]
			>;
			composites: {};
		};

	type TimeLogGetPayload<S extends boolean | null | undefined | TimeLogDefaultArgs> =
		$Result.GetResult<Prisma.$TimeLogPayload, S>;

	type TimeLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		TimeLogFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: TimeLogCountAggregateInputType | true;
	};

	export interface TimeLogDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["TimeLog"]; meta: { name: "TimeLog" } };
		/**
		 * Find zero or one TimeLog that matches the filter.
		 * @param {TimeLogFindUniqueArgs} args - Arguments to find a TimeLog
		 * @example
		 * // Get one TimeLog
		 * const timeLog = await prisma.timeLog.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends TimeLogFindUniqueArgs>(
			args: SelectSubset<T, TimeLogFindUniqueArgs<ExtArgs>>
		): Prisma__TimeLogClient<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one TimeLog that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {TimeLogFindUniqueOrThrowArgs} args - Arguments to find a TimeLog
		 * @example
		 * // Get one TimeLog
		 * const timeLog = await prisma.timeLog.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends TimeLogFindUniqueOrThrowArgs>(
			args: SelectSubset<T, TimeLogFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__TimeLogClient<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first TimeLog that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TimeLogFindFirstArgs} args - Arguments to find a TimeLog
		 * @example
		 * // Get one TimeLog
		 * const timeLog = await prisma.timeLog.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends TimeLogFindFirstArgs>(
			args?: SelectSubset<T, TimeLogFindFirstArgs<ExtArgs>>
		): Prisma__TimeLogClient<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first TimeLog that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TimeLogFindFirstOrThrowArgs} args - Arguments to find a TimeLog
		 * @example
		 * // Get one TimeLog
		 * const timeLog = await prisma.timeLog.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends TimeLogFindFirstOrThrowArgs>(
			args?: SelectSubset<T, TimeLogFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__TimeLogClient<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more TimeLogs that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TimeLogFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all TimeLogs
		 * const timeLogs = await prisma.timeLog.findMany()
		 *
		 * // Get first 10 TimeLogs
		 * const timeLogs = await prisma.timeLog.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const timeLogWithIdOnly = await prisma.timeLog.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends TimeLogFindManyArgs>(
			args?: SelectSubset<T, TimeLogFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a TimeLog.
		 * @param {TimeLogCreateArgs} args - Arguments to create a TimeLog.
		 * @example
		 * // Create one TimeLog
		 * const TimeLog = await prisma.timeLog.create({
		 *   data: {
		 *     // ... data to create a TimeLog
		 *   }
		 * })
		 *
		 */
		create<T extends TimeLogCreateArgs>(
			args: SelectSubset<T, TimeLogCreateArgs<ExtArgs>>
		): Prisma__TimeLogClient<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many TimeLogs.
		 * @param {TimeLogCreateManyArgs} args - Arguments to create many TimeLogs.
		 * @example
		 * // Create many TimeLogs
		 * const timeLog = await prisma.timeLog.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends TimeLogCreateManyArgs>(
			args?: SelectSubset<T, TimeLogCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many TimeLogs and returns the data saved in the database.
		 * @param {TimeLogCreateManyAndReturnArgs} args - Arguments to create many TimeLogs.
		 * @example
		 * // Create many TimeLogs
		 * const timeLog = await prisma.timeLog.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many TimeLogs and only return the `id`
		 * const timeLogWithIdOnly = await prisma.timeLog.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends TimeLogCreateManyAndReturnArgs>(
			args?: SelectSubset<T, TimeLogCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$TimeLogPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a TimeLog.
		 * @param {TimeLogDeleteArgs} args - Arguments to delete one TimeLog.
		 * @example
		 * // Delete one TimeLog
		 * const TimeLog = await prisma.timeLog.delete({
		 *   where: {
		 *     // ... filter to delete one TimeLog
		 *   }
		 * })
		 *
		 */
		delete<T extends TimeLogDeleteArgs>(
			args: SelectSubset<T, TimeLogDeleteArgs<ExtArgs>>
		): Prisma__TimeLogClient<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one TimeLog.
		 * @param {TimeLogUpdateArgs} args - Arguments to update one TimeLog.
		 * @example
		 * // Update one TimeLog
		 * const timeLog = await prisma.timeLog.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends TimeLogUpdateArgs>(
			args: SelectSubset<T, TimeLogUpdateArgs<ExtArgs>>
		): Prisma__TimeLogClient<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more TimeLogs.
		 * @param {TimeLogDeleteManyArgs} args - Arguments to filter TimeLogs to delete.
		 * @example
		 * // Delete a few TimeLogs
		 * const { count } = await prisma.timeLog.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends TimeLogDeleteManyArgs>(
			args?: SelectSubset<T, TimeLogDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more TimeLogs.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TimeLogUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many TimeLogs
		 * const timeLog = await prisma.timeLog.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends TimeLogUpdateManyArgs>(
			args: SelectSubset<T, TimeLogUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more TimeLogs and returns the data updated in the database.
		 * @param {TimeLogUpdateManyAndReturnArgs} args - Arguments to update many TimeLogs.
		 * @example
		 * // Update many TimeLogs
		 * const timeLog = await prisma.timeLog.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more TimeLogs and only return the `id`
		 * const timeLogWithIdOnly = await prisma.timeLog.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends TimeLogUpdateManyAndReturnArgs>(
			args: SelectSubset<T, TimeLogUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$TimeLogPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one TimeLog.
		 * @param {TimeLogUpsertArgs} args - Arguments to update or create a TimeLog.
		 * @example
		 * // Update or create a TimeLog
		 * const timeLog = await prisma.timeLog.upsert({
		 *   create: {
		 *     // ... data to create a TimeLog
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the TimeLog we want to update
		 *   }
		 * })
		 */
		upsert<T extends TimeLogUpsertArgs>(
			args: SelectSubset<T, TimeLogUpsertArgs<ExtArgs>>
		): Prisma__TimeLogClient<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of TimeLogs.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TimeLogCountArgs} args - Arguments to filter TimeLogs to count.
		 * @example
		 * // Count the number of TimeLogs
		 * const count = await prisma.timeLog.count({
		 *   where: {
		 *     // ... the filter for the TimeLogs we want to count
		 *   }
		 * })
		 **/
		count<T extends TimeLogCountArgs>(
			args?: Subset<T, TimeLogCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], TimeLogCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a TimeLog.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TimeLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends TimeLogAggregateArgs>(
			args: Subset<T, TimeLogAggregateArgs>
		): Prisma.PrismaPromise<GetTimeLogAggregateType<T>>;

		/**
		 * Group by TimeLog.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TimeLogGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends TimeLogGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: TimeLogGroupByArgs["orderBy"] }
				: { orderBy?: TimeLogGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, TimeLogGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors ? GetTimeLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the TimeLog model
		 */
		readonly fields: TimeLogFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for TimeLog.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__TimeLogClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		Employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			| $Result.GetResult<
					Prisma.$EmployeePayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		Station<T extends TimeLog$StationArgs<ExtArgs> = {}>(
			args?: Subset<T, TimeLog$StationArgs<ExtArgs>>
		): Prisma__StationClient<
			$Result.GetResult<
				Prisma.$StationPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;
		Task<T extends TimeLog$TaskArgs<ExtArgs> = {}>(
			args?: Subset<T, TimeLog$TaskArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<
				Prisma.$TaskAssignmentPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the TimeLog model
	 */
	interface TimeLogFieldRefs {
		readonly id: FieldRef<"TimeLog", "String">;
		readonly employeeId: FieldRef<"TimeLog", "String">;
		readonly stationId: FieldRef<"TimeLog", "String">;
		readonly type: FieldRef<"TimeLog", "TimeLog_type">;
		readonly startTime: FieldRef<"TimeLog", "DateTime">;
		readonly endTime: FieldRef<"TimeLog", "DateTime">;
		readonly note: FieldRef<"TimeLog", "String">;
		readonly deletedAt: FieldRef<"TimeLog", "DateTime">;
		readonly correctedBy: FieldRef<"TimeLog", "String">;
		readonly taskId: FieldRef<"TimeLog", "String">;
		readonly clockMethod: FieldRef<"TimeLog", "ClockMethod">;
		readonly createdAt: FieldRef<"TimeLog", "DateTime">;
		readonly updatedAt: FieldRef<"TimeLog", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * TimeLog findUnique
	 */
	export type TimeLogFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * Filter, which TimeLog to fetch.
		 */
		where: TimeLogWhereUniqueInput;
	};

	/**
	 * TimeLog findUniqueOrThrow
	 */
	export type TimeLogFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * Filter, which TimeLog to fetch.
		 */
		where: TimeLogWhereUniqueInput;
	};

	/**
	 * TimeLog findFirst
	 */
	export type TimeLogFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * Filter, which TimeLog to fetch.
		 */
		where?: TimeLogWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TimeLogs to fetch.
		 */
		orderBy?: TimeLogOrderByWithRelationInput | TimeLogOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for TimeLogs.
		 */
		cursor?: TimeLogWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TimeLogs from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TimeLogs.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of TimeLogs.
		 */
		distinct?: TimeLogScalarFieldEnum | TimeLogScalarFieldEnum[];
	};

	/**
	 * TimeLog findFirstOrThrow
	 */
	export type TimeLogFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * Filter, which TimeLog to fetch.
		 */
		where?: TimeLogWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TimeLogs to fetch.
		 */
		orderBy?: TimeLogOrderByWithRelationInput | TimeLogOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for TimeLogs.
		 */
		cursor?: TimeLogWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TimeLogs from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TimeLogs.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of TimeLogs.
		 */
		distinct?: TimeLogScalarFieldEnum | TimeLogScalarFieldEnum[];
	};

	/**
	 * TimeLog findMany
	 */
	export type TimeLogFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * Filter, which TimeLogs to fetch.
		 */
		where?: TimeLogWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TimeLogs to fetch.
		 */
		orderBy?: TimeLogOrderByWithRelationInput | TimeLogOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing TimeLogs.
		 */
		cursor?: TimeLogWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TimeLogs from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TimeLogs.
		 */
		skip?: number;
		distinct?: TimeLogScalarFieldEnum | TimeLogScalarFieldEnum[];
	};

	/**
	 * TimeLog create
	 */
	export type TimeLogCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * The data needed to create a TimeLog.
		 */
		data: XOR<TimeLogCreateInput, TimeLogUncheckedCreateInput>;
	};

	/**
	 * TimeLog createMany
	 */
	export type TimeLogCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many TimeLogs.
		 */
		data: TimeLogCreateManyInput | TimeLogCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * TimeLog createManyAndReturn
	 */
	export type TimeLogCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * The data used to create many TimeLogs.
		 */
		data: TimeLogCreateManyInput | TimeLogCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * TimeLog update
	 */
	export type TimeLogUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * The data needed to update a TimeLog.
		 */
		data: XOR<TimeLogUpdateInput, TimeLogUncheckedUpdateInput>;
		/**
		 * Choose, which TimeLog to update.
		 */
		where: TimeLogWhereUniqueInput;
	};

	/**
	 * TimeLog updateMany
	 */
	export type TimeLogUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update TimeLogs.
		 */
		data: XOR<TimeLogUpdateManyMutationInput, TimeLogUncheckedUpdateManyInput>;
		/**
		 * Filter which TimeLogs to update
		 */
		where?: TimeLogWhereInput;
		/**
		 * Limit how many TimeLogs to update.
		 */
		limit?: number;
	};

	/**
	 * TimeLog updateManyAndReturn
	 */
	export type TimeLogUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * The data used to update TimeLogs.
		 */
		data: XOR<TimeLogUpdateManyMutationInput, TimeLogUncheckedUpdateManyInput>;
		/**
		 * Filter which TimeLogs to update
		 */
		where?: TimeLogWhereInput;
		/**
		 * Limit how many TimeLogs to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * TimeLog upsert
	 */
	export type TimeLogUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * The filter to search for the TimeLog to update in case it exists.
		 */
		where: TimeLogWhereUniqueInput;
		/**
		 * In case the TimeLog found by the `where` argument doesn't exist, create a new TimeLog with this data.
		 */
		create: XOR<TimeLogCreateInput, TimeLogUncheckedCreateInput>;
		/**
		 * In case the TimeLog was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<TimeLogUpdateInput, TimeLogUncheckedUpdateInput>;
	};

	/**
	 * TimeLog delete
	 */
	export type TimeLogDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		/**
		 * Filter which TimeLog to delete.
		 */
		where: TimeLogWhereUniqueInput;
	};

	/**
	 * TimeLog deleteMany
	 */
	export type TimeLogDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which TimeLogs to delete
		 */
		where?: TimeLogWhereInput;
		/**
		 * Limit how many TimeLogs to delete.
		 */
		limit?: number;
	};

	/**
	 * TimeLog.Station
	 */
	export type TimeLog$StationArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Station
		 */
		select?: StationSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Station
		 */
		omit?: StationOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: StationInclude<ExtArgs> | null;
		where?: StationWhereInput;
	};

	/**
	 * TimeLog.Task
	 */
	export type TimeLog$TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the TaskAssignment
			 */
			select?: TaskAssignmentSelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the TaskAssignment
			 */
			omit?: TaskAssignmentOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: TaskAssignmentInclude<ExtArgs> | null;
			where?: TaskAssignmentWhereInput;
		};

	/**
	 * TimeLog without action
	 */
	export type TimeLogDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
	};

	/**
	 * Model TaskType
	 */

	export type AggregateTaskType = {
		_count: TaskTypeCountAggregateOutputType | null;
		_avg: TaskTypeAvgAggregateOutputType | null;
		_sum: TaskTypeSumAggregateOutputType | null;
		_min: TaskTypeMinAggregateOutputType | null;
		_max: TaskTypeMaxAggregateOutputType | null;
	};

	export type TaskTypeAvgAggregateOutputType = {
		estimatedMinutesPerUnit: number | null;
	};

	export type TaskTypeSumAggregateOutputType = {
		estimatedMinutesPerUnit: number | null;
	};

	export type TaskTypeMinAggregateOutputType = {
		id: string | null;
		name: string | null;
		stationId: string | null;
		description: string | null;
		estimatedMinutesPerUnit: number | null;
		isActive: boolean | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type TaskTypeMaxAggregateOutputType = {
		id: string | null;
		name: string | null;
		stationId: string | null;
		description: string | null;
		estimatedMinutesPerUnit: number | null;
		isActive: boolean | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type TaskTypeCountAggregateOutputType = {
		id: number;
		name: number;
		stationId: number;
		description: number;
		estimatedMinutesPerUnit: number;
		isActive: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type TaskTypeAvgAggregateInputType = {
		estimatedMinutesPerUnit?: true;
	};

	export type TaskTypeSumAggregateInputType = {
		estimatedMinutesPerUnit?: true;
	};

	export type TaskTypeMinAggregateInputType = {
		id?: true;
		name?: true;
		stationId?: true;
		description?: true;
		estimatedMinutesPerUnit?: true;
		isActive?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type TaskTypeMaxAggregateInputType = {
		id?: true;
		name?: true;
		stationId?: true;
		description?: true;
		estimatedMinutesPerUnit?: true;
		isActive?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type TaskTypeCountAggregateInputType = {
		id?: true;
		name?: true;
		stationId?: true;
		description?: true;
		estimatedMinutesPerUnit?: true;
		isActive?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type TaskTypeAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which TaskType to aggregate.
		 */
		where?: TaskTypeWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TaskTypes to fetch.
		 */
		orderBy?: TaskTypeOrderByWithRelationInput | TaskTypeOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: TaskTypeWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TaskTypes from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TaskTypes.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned TaskTypes
		 **/
		_count?: true | TaskTypeCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to average
		 **/
		_avg?: TaskTypeAvgAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to sum
		 **/
		_sum?: TaskTypeSumAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: TaskTypeMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: TaskTypeMaxAggregateInputType;
	};

	export type GetTaskTypeAggregateType<T extends TaskTypeAggregateArgs> = {
		[P in keyof T & keyof AggregateTaskType]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateTaskType[P]>
			: GetScalarType<T[P], AggregateTaskType[P]>;
	};

	export type TaskTypeGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TaskTypeWhereInput;
		orderBy?: TaskTypeOrderByWithAggregationInput | TaskTypeOrderByWithAggregationInput[];
		by: TaskTypeScalarFieldEnum[] | TaskTypeScalarFieldEnum;
		having?: TaskTypeScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: TaskTypeCountAggregateInputType | true;
		_avg?: TaskTypeAvgAggregateInputType;
		_sum?: TaskTypeSumAggregateInputType;
		_min?: TaskTypeMinAggregateInputType;
		_max?: TaskTypeMaxAggregateInputType;
	};

	export type TaskTypeGroupByOutputType = {
		id: string;
		name: string;
		stationId: string;
		description: string | null;
		estimatedMinutesPerUnit: number | null;
		isActive: boolean;
		createdAt: Date;
		updatedAt: Date;
		_count: TaskTypeCountAggregateOutputType | null;
		_avg: TaskTypeAvgAggregateOutputType | null;
		_sum: TaskTypeSumAggregateOutputType | null;
		_min: TaskTypeMinAggregateOutputType | null;
		_max: TaskTypeMaxAggregateOutputType | null;
	};

	type GetTaskTypeGroupByPayload<T extends TaskTypeGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<TaskTypeGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof TaskTypeGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], TaskTypeGroupByOutputType[P]>
					: GetScalarType<T[P], TaskTypeGroupByOutputType[P]>;
			}
		>
	>;

	export type TaskTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetSelect<
			{
				id?: boolean;
				name?: boolean;
				stationId?: boolean;
				description?: boolean;
				estimatedMinutesPerUnit?: boolean;
				isActive?: boolean;
				createdAt?: boolean;
				updatedAt?: boolean;
				Station?: boolean | StationDefaultArgs<ExtArgs>;
				TaskAssignment?: boolean | TaskType$TaskAssignmentArgs<ExtArgs>;
				_count?: boolean | TaskTypeCountOutputTypeDefaultArgs<ExtArgs>;
			},
			ExtArgs["result"]["taskType"]
		>;

	export type TaskTypeSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			name?: boolean;
			stationId?: boolean;
			description?: boolean;
			estimatedMinutesPerUnit?: boolean;
			isActive?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Station?: boolean | StationDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["taskType"]
	>;

	export type TaskTypeSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			name?: boolean;
			stationId?: boolean;
			description?: boolean;
			estimatedMinutesPerUnit?: boolean;
			isActive?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Station?: boolean | StationDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["taskType"]
	>;

	export type TaskTypeSelectScalar = {
		id?: boolean;
		name?: boolean;
		stationId?: boolean;
		description?: boolean;
		estimatedMinutesPerUnit?: boolean;
		isActive?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type TaskTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<
			| "id"
			| "name"
			| "stationId"
			| "description"
			| "estimatedMinutesPerUnit"
			| "isActive"
			| "createdAt"
			| "updatedAt",
			ExtArgs["result"]["taskType"]
		>;
	export type TaskTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			Station?: boolean | StationDefaultArgs<ExtArgs>;
			TaskAssignment?: boolean | TaskType$TaskAssignmentArgs<ExtArgs>;
			_count?: boolean | TaskTypeCountOutputTypeDefaultArgs<ExtArgs>;
		};
	export type TaskTypeIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Station?: boolean | StationDefaultArgs<ExtArgs>;
	};
	export type TaskTypeIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Station?: boolean | StationDefaultArgs<ExtArgs>;
	};

	export type $TaskTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			name: "TaskType";
			objects: {
				Station: Prisma.$StationPayload<ExtArgs>;
				TaskAssignment: Prisma.$TaskAssignmentPayload<ExtArgs>[];
			};
			scalars: $Extensions.GetPayloadResult<
				{
					id: string;
					name: string;
					stationId: string;
					description: string | null;
					estimatedMinutesPerUnit: number | null;
					isActive: boolean;
					createdAt: Date;
					updatedAt: Date;
				},
				ExtArgs["result"]["taskType"]
			>;
			composites: {};
		};

	type TaskTypeGetPayload<S extends boolean | null | undefined | TaskTypeDefaultArgs> =
		$Result.GetResult<Prisma.$TaskTypePayload, S>;

	type TaskTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		TaskTypeFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: TaskTypeCountAggregateInputType | true;
	};

	export interface TaskTypeDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["TaskType"];
			meta: { name: "TaskType" };
		};
		/**
		 * Find zero or one TaskType that matches the filter.
		 * @param {TaskTypeFindUniqueArgs} args - Arguments to find a TaskType
		 * @example
		 * // Get one TaskType
		 * const taskType = await prisma.taskType.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends TaskTypeFindUniqueArgs>(
			args: SelectSubset<T, TaskTypeFindUniqueArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			$Result.GetResult<
				Prisma.$TaskTypePayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one TaskType that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {TaskTypeFindUniqueOrThrowArgs} args - Arguments to find a TaskType
		 * @example
		 * // Get one TaskType
		 * const taskType = await prisma.taskType.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends TaskTypeFindUniqueOrThrowArgs>(
			args: SelectSubset<T, TaskTypeFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			$Result.GetResult<
				Prisma.$TaskTypePayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first TaskType that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskTypeFindFirstArgs} args - Arguments to find a TaskType
		 * @example
		 * // Get one TaskType
		 * const taskType = await prisma.taskType.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends TaskTypeFindFirstArgs>(
			args?: SelectSubset<T, TaskTypeFindFirstArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			$Result.GetResult<Prisma.$TaskTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first TaskType that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskTypeFindFirstOrThrowArgs} args - Arguments to find a TaskType
		 * @example
		 * // Get one TaskType
		 * const taskType = await prisma.taskType.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends TaskTypeFindFirstOrThrowArgs>(
			args?: SelectSubset<T, TaskTypeFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			$Result.GetResult<Prisma.$TaskTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more TaskTypes that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskTypeFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all TaskTypes
		 * const taskTypes = await prisma.taskType.findMany()
		 *
		 * // Get first 10 TaskTypes
		 * const taskTypes = await prisma.taskType.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const taskTypeWithIdOnly = await prisma.taskType.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends TaskTypeFindManyArgs>(
			args?: SelectSubset<T, TaskTypeFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TaskTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a TaskType.
		 * @param {TaskTypeCreateArgs} args - Arguments to create a TaskType.
		 * @example
		 * // Create one TaskType
		 * const TaskType = await prisma.taskType.create({
		 *   data: {
		 *     // ... data to create a TaskType
		 *   }
		 * })
		 *
		 */
		create<T extends TaskTypeCreateArgs>(
			args: SelectSubset<T, TaskTypeCreateArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			$Result.GetResult<Prisma.$TaskTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many TaskTypes.
		 * @param {TaskTypeCreateManyArgs} args - Arguments to create many TaskTypes.
		 * @example
		 * // Create many TaskTypes
		 * const taskType = await prisma.taskType.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends TaskTypeCreateManyArgs>(
			args?: SelectSubset<T, TaskTypeCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many TaskTypes and returns the data saved in the database.
		 * @param {TaskTypeCreateManyAndReturnArgs} args - Arguments to create many TaskTypes.
		 * @example
		 * // Create many TaskTypes
		 * const taskType = await prisma.taskType.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many TaskTypes and only return the `id`
		 * const taskTypeWithIdOnly = await prisma.taskType.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends TaskTypeCreateManyAndReturnArgs>(
			args?: SelectSubset<T, TaskTypeCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$TaskTypePayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a TaskType.
		 * @param {TaskTypeDeleteArgs} args - Arguments to delete one TaskType.
		 * @example
		 * // Delete one TaskType
		 * const TaskType = await prisma.taskType.delete({
		 *   where: {
		 *     // ... filter to delete one TaskType
		 *   }
		 * })
		 *
		 */
		delete<T extends TaskTypeDeleteArgs>(
			args: SelectSubset<T, TaskTypeDeleteArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			$Result.GetResult<Prisma.$TaskTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one TaskType.
		 * @param {TaskTypeUpdateArgs} args - Arguments to update one TaskType.
		 * @example
		 * // Update one TaskType
		 * const taskType = await prisma.taskType.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends TaskTypeUpdateArgs>(
			args: SelectSubset<T, TaskTypeUpdateArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			$Result.GetResult<Prisma.$TaskTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more TaskTypes.
		 * @param {TaskTypeDeleteManyArgs} args - Arguments to filter TaskTypes to delete.
		 * @example
		 * // Delete a few TaskTypes
		 * const { count } = await prisma.taskType.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends TaskTypeDeleteManyArgs>(
			args?: SelectSubset<T, TaskTypeDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more TaskTypes.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskTypeUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many TaskTypes
		 * const taskType = await prisma.taskType.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends TaskTypeUpdateManyArgs>(
			args: SelectSubset<T, TaskTypeUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more TaskTypes and returns the data updated in the database.
		 * @param {TaskTypeUpdateManyAndReturnArgs} args - Arguments to update many TaskTypes.
		 * @example
		 * // Update many TaskTypes
		 * const taskType = await prisma.taskType.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more TaskTypes and only return the `id`
		 * const taskTypeWithIdOnly = await prisma.taskType.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends TaskTypeUpdateManyAndReturnArgs>(
			args: SelectSubset<T, TaskTypeUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$TaskTypePayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one TaskType.
		 * @param {TaskTypeUpsertArgs} args - Arguments to update or create a TaskType.
		 * @example
		 * // Update or create a TaskType
		 * const taskType = await prisma.taskType.upsert({
		 *   create: {
		 *     // ... data to create a TaskType
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the TaskType we want to update
		 *   }
		 * })
		 */
		upsert<T extends TaskTypeUpsertArgs>(
			args: SelectSubset<T, TaskTypeUpsertArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			$Result.GetResult<Prisma.$TaskTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of TaskTypes.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskTypeCountArgs} args - Arguments to filter TaskTypes to count.
		 * @example
		 * // Count the number of TaskTypes
		 * const count = await prisma.taskType.count({
		 *   where: {
		 *     // ... the filter for the TaskTypes we want to count
		 *   }
		 * })
		 **/
		count<T extends TaskTypeCountArgs>(
			args?: Subset<T, TaskTypeCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], TaskTypeCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a TaskType.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends TaskTypeAggregateArgs>(
			args: Subset<T, TaskTypeAggregateArgs>
		): Prisma.PrismaPromise<GetTaskTypeAggregateType<T>>;

		/**
		 * Group by TaskType.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskTypeGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends TaskTypeGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: TaskTypeGroupByArgs["orderBy"] }
				: { orderBy?: TaskTypeGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, TaskTypeGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors ? GetTaskTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the TaskType model
		 */
		readonly fields: TaskTypeFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for TaskType.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__TaskTypeClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		Station<T extends StationDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, StationDefaultArgs<ExtArgs>>
		): Prisma__StationClient<
			| $Result.GetResult<
					Prisma.$StationPayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		TaskAssignment<T extends TaskType$TaskAssignmentArgs<ExtArgs> = {}>(
			args?: Subset<T, TaskType$TaskAssignmentArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			| $Result.GetResult<Prisma.$TaskAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
			| Null
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the TaskType model
	 */
	interface TaskTypeFieldRefs {
		readonly id: FieldRef<"TaskType", "String">;
		readonly name: FieldRef<"TaskType", "String">;
		readonly stationId: FieldRef<"TaskType", "String">;
		readonly description: FieldRef<"TaskType", "String">;
		readonly estimatedMinutesPerUnit: FieldRef<"TaskType", "Float">;
		readonly isActive: FieldRef<"TaskType", "Boolean">;
		readonly createdAt: FieldRef<"TaskType", "DateTime">;
		readonly updatedAt: FieldRef<"TaskType", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * TaskType findUnique
	 */
	export type TaskTypeFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskType to fetch.
		 */
		where: TaskTypeWhereUniqueInput;
	};

	/**
	 * TaskType findUniqueOrThrow
	 */
	export type TaskTypeFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskType to fetch.
		 */
		where: TaskTypeWhereUniqueInput;
	};

	/**
	 * TaskType findFirst
	 */
	export type TaskTypeFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskType to fetch.
		 */
		where?: TaskTypeWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TaskTypes to fetch.
		 */
		orderBy?: TaskTypeOrderByWithRelationInput | TaskTypeOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for TaskTypes.
		 */
		cursor?: TaskTypeWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TaskTypes from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TaskTypes.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of TaskTypes.
		 */
		distinct?: TaskTypeScalarFieldEnum | TaskTypeScalarFieldEnum[];
	};

	/**
	 * TaskType findFirstOrThrow
	 */
	export type TaskTypeFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskType to fetch.
		 */
		where?: TaskTypeWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TaskTypes to fetch.
		 */
		orderBy?: TaskTypeOrderByWithRelationInput | TaskTypeOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for TaskTypes.
		 */
		cursor?: TaskTypeWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TaskTypes from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TaskTypes.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of TaskTypes.
		 */
		distinct?: TaskTypeScalarFieldEnum | TaskTypeScalarFieldEnum[];
	};

	/**
	 * TaskType findMany
	 */
	export type TaskTypeFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskTypes to fetch.
		 */
		where?: TaskTypeWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TaskTypes to fetch.
		 */
		orderBy?: TaskTypeOrderByWithRelationInput | TaskTypeOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing TaskTypes.
		 */
		cursor?: TaskTypeWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TaskTypes from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TaskTypes.
		 */
		skip?: number;
		distinct?: TaskTypeScalarFieldEnum | TaskTypeScalarFieldEnum[];
	};

	/**
	 * TaskType create
	 */
	export type TaskTypeCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * The data needed to create a TaskType.
		 */
		data: XOR<TaskTypeCreateInput, TaskTypeUncheckedCreateInput>;
	};

	/**
	 * TaskType createMany
	 */
	export type TaskTypeCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many TaskTypes.
		 */
		data: TaskTypeCreateManyInput | TaskTypeCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * TaskType createManyAndReturn
	 */
	export type TaskTypeCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * The data used to create many TaskTypes.
		 */
		data: TaskTypeCreateManyInput | TaskTypeCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * TaskType update
	 */
	export type TaskTypeUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * The data needed to update a TaskType.
		 */
		data: XOR<TaskTypeUpdateInput, TaskTypeUncheckedUpdateInput>;
		/**
		 * Choose, which TaskType to update.
		 */
		where: TaskTypeWhereUniqueInput;
	};

	/**
	 * TaskType updateMany
	 */
	export type TaskTypeUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update TaskTypes.
		 */
		data: XOR<TaskTypeUpdateManyMutationInput, TaskTypeUncheckedUpdateManyInput>;
		/**
		 * Filter which TaskTypes to update
		 */
		where?: TaskTypeWhereInput;
		/**
		 * Limit how many TaskTypes to update.
		 */
		limit?: number;
	};

	/**
	 * TaskType updateManyAndReturn
	 */
	export type TaskTypeUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * The data used to update TaskTypes.
		 */
		data: XOR<TaskTypeUpdateManyMutationInput, TaskTypeUncheckedUpdateManyInput>;
		/**
		 * Filter which TaskTypes to update
		 */
		where?: TaskTypeWhereInput;
		/**
		 * Limit how many TaskTypes to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * TaskType upsert
	 */
	export type TaskTypeUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * The filter to search for the TaskType to update in case it exists.
		 */
		where: TaskTypeWhereUniqueInput;
		/**
		 * In case the TaskType found by the `where` argument doesn't exist, create a new TaskType with this data.
		 */
		create: XOR<TaskTypeCreateInput, TaskTypeUncheckedCreateInput>;
		/**
		 * In case the TaskType was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<TaskTypeUpdateInput, TaskTypeUncheckedUpdateInput>;
	};

	/**
	 * TaskType delete
	 */
	export type TaskTypeDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
		/**
		 * Filter which TaskType to delete.
		 */
		where: TaskTypeWhereUniqueInput;
	};

	/**
	 * TaskType deleteMany
	 */
	export type TaskTypeDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which TaskTypes to delete
		 */
		where?: TaskTypeWhereInput;
		/**
		 * Limit how many TaskTypes to delete.
		 */
		limit?: number;
	};

	/**
	 * TaskType.TaskAssignment
	 */
	export type TaskType$TaskAssignmentArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		where?: TaskAssignmentWhereInput;
		orderBy?: TaskAssignmentOrderByWithRelationInput | TaskAssignmentOrderByWithRelationInput[];
		cursor?: TaskAssignmentWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: TaskAssignmentScalarFieldEnum | TaskAssignmentScalarFieldEnum[];
	};

	/**
	 * TaskType without action
	 */
	export type TaskTypeDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskType
		 */
		select?: TaskTypeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskType
		 */
		omit?: TaskTypeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskTypeInclude<ExtArgs> | null;
	};

	/**
	 * Model TaskAssignment
	 */

	export type AggregateTaskAssignment = {
		_count: TaskAssignmentCountAggregateOutputType | null;
		_avg: TaskAssignmentAvgAggregateOutputType | null;
		_sum: TaskAssignmentSumAggregateOutputType | null;
		_min: TaskAssignmentMinAggregateOutputType | null;
		_max: TaskAssignmentMaxAggregateOutputType | null;
	};

	export type TaskAssignmentAvgAggregateOutputType = {
		unitsCompleted: number | null;
	};

	export type TaskAssignmentSumAggregateOutputType = {
		unitsCompleted: number | null;
	};

	export type TaskAssignmentMinAggregateOutputType = {
		id: string | null;
		employeeId: string | null;
		taskTypeId: string | null;
		startTime: Date | null;
		endTime: Date | null;
		unitsCompleted: number | null;
		notes: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type TaskAssignmentMaxAggregateOutputType = {
		id: string | null;
		employeeId: string | null;
		taskTypeId: string | null;
		startTime: Date | null;
		endTime: Date | null;
		unitsCompleted: number | null;
		notes: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type TaskAssignmentCountAggregateOutputType = {
		id: number;
		employeeId: number;
		taskTypeId: number;
		startTime: number;
		endTime: number;
		unitsCompleted: number;
		notes: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type TaskAssignmentAvgAggregateInputType = {
		unitsCompleted?: true;
	};

	export type TaskAssignmentSumAggregateInputType = {
		unitsCompleted?: true;
	};

	export type TaskAssignmentMinAggregateInputType = {
		id?: true;
		employeeId?: true;
		taskTypeId?: true;
		startTime?: true;
		endTime?: true;
		unitsCompleted?: true;
		notes?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type TaskAssignmentMaxAggregateInputType = {
		id?: true;
		employeeId?: true;
		taskTypeId?: true;
		startTime?: true;
		endTime?: true;
		unitsCompleted?: true;
		notes?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type TaskAssignmentCountAggregateInputType = {
		id?: true;
		employeeId?: true;
		taskTypeId?: true;
		startTime?: true;
		endTime?: true;
		unitsCompleted?: true;
		notes?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type TaskAssignmentAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which TaskAssignment to aggregate.
		 */
		where?: TaskAssignmentWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TaskAssignments to fetch.
		 */
		orderBy?: TaskAssignmentOrderByWithRelationInput | TaskAssignmentOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: TaskAssignmentWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TaskAssignments from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TaskAssignments.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned TaskAssignments
		 **/
		_count?: true | TaskAssignmentCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to average
		 **/
		_avg?: TaskAssignmentAvgAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to sum
		 **/
		_sum?: TaskAssignmentSumAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: TaskAssignmentMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: TaskAssignmentMaxAggregateInputType;
	};

	export type GetTaskAssignmentAggregateType<T extends TaskAssignmentAggregateArgs> = {
		[P in keyof T & keyof AggregateTaskAssignment]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateTaskAssignment[P]>
			: GetScalarType<T[P], AggregateTaskAssignment[P]>;
	};

	export type TaskAssignmentGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: TaskAssignmentWhereInput;
		orderBy?:
			| TaskAssignmentOrderByWithAggregationInput
			| TaskAssignmentOrderByWithAggregationInput[];
		by: TaskAssignmentScalarFieldEnum[] | TaskAssignmentScalarFieldEnum;
		having?: TaskAssignmentScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: TaskAssignmentCountAggregateInputType | true;
		_avg?: TaskAssignmentAvgAggregateInputType;
		_sum?: TaskAssignmentSumAggregateInputType;
		_min?: TaskAssignmentMinAggregateInputType;
		_max?: TaskAssignmentMaxAggregateInputType;
	};

	export type TaskAssignmentGroupByOutputType = {
		id: string;
		employeeId: string;
		taskTypeId: string;
		startTime: Date;
		endTime: Date | null;
		unitsCompleted: number | null;
		notes: string | null;
		createdAt: Date;
		updatedAt: Date;
		_count: TaskAssignmentCountAggregateOutputType | null;
		_avg: TaskAssignmentAvgAggregateOutputType | null;
		_sum: TaskAssignmentSumAggregateOutputType | null;
		_min: TaskAssignmentMinAggregateOutputType | null;
		_max: TaskAssignmentMaxAggregateOutputType | null;
	};

	type GetTaskAssignmentGroupByPayload<T extends TaskAssignmentGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<TaskAssignmentGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof TaskAssignmentGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], TaskAssignmentGroupByOutputType[P]>
					: GetScalarType<T[P], TaskAssignmentGroupByOutputType[P]>;
			}
		>
	>;

	export type TaskAssignmentSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			employeeId?: boolean;
			taskTypeId?: boolean;
			startTime?: boolean;
			endTime?: boolean;
			unitsCompleted?: boolean;
			notes?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
			TaskType?: boolean | TaskTypeDefaultArgs<ExtArgs>;
			TimeLogs?: boolean | TaskAssignment$TimeLogsArgs<ExtArgs>;
			_count?: boolean | TaskAssignmentCountOutputTypeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["taskAssignment"]
	>;

	export type TaskAssignmentSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			employeeId?: boolean;
			taskTypeId?: boolean;
			startTime?: boolean;
			endTime?: boolean;
			unitsCompleted?: boolean;
			notes?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
			TaskType?: boolean | TaskTypeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["taskAssignment"]
	>;

	export type TaskAssignmentSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			employeeId?: boolean;
			taskTypeId?: boolean;
			startTime?: boolean;
			endTime?: boolean;
			unitsCompleted?: boolean;
			notes?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
			TaskType?: boolean | TaskTypeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["taskAssignment"]
	>;

	export type TaskAssignmentSelectScalar = {
		id?: boolean;
		employeeId?: boolean;
		taskTypeId?: boolean;
		startTime?: boolean;
		endTime?: boolean;
		unitsCompleted?: boolean;
		notes?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type TaskAssignmentOmit<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetOmit<
		| "id"
		| "employeeId"
		| "taskTypeId"
		| "startTime"
		| "endTime"
		| "unitsCompleted"
		| "notes"
		| "createdAt"
		| "updatedAt",
		ExtArgs["result"]["taskAssignment"]
	>;
	export type TaskAssignmentInclude<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		TaskType?: boolean | TaskTypeDefaultArgs<ExtArgs>;
		TimeLogs?: boolean | TaskAssignment$TimeLogsArgs<ExtArgs>;
		_count?: boolean | TaskAssignmentCountOutputTypeDefaultArgs<ExtArgs>;
	};
	export type TaskAssignmentIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		TaskType?: boolean | TaskTypeDefaultArgs<ExtArgs>;
	};
	export type TaskAssignmentIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		TaskType?: boolean | TaskTypeDefaultArgs<ExtArgs>;
	};

	export type $TaskAssignmentPayload<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		name: "TaskAssignment";
		objects: {
			Employee: Prisma.$EmployeePayload<ExtArgs>;
			TaskType: Prisma.$TaskTypePayload<ExtArgs>;
			TimeLogs: Prisma.$TimeLogPayload<ExtArgs>[];
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				employeeId: string;
				taskTypeId: string;
				startTime: Date;
				endTime: Date | null;
				unitsCompleted: number | null;
				notes: string | null;
				createdAt: Date;
				updatedAt: Date;
			},
			ExtArgs["result"]["taskAssignment"]
		>;
		composites: {};
	};

	type TaskAssignmentGetPayload<S extends boolean | null | undefined | TaskAssignmentDefaultArgs> =
		$Result.GetResult<Prisma.$TaskAssignmentPayload, S>;

	type TaskAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		Omit<TaskAssignmentFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
			select?: TaskAssignmentCountAggregateInputType | true;
		};

	export interface TaskAssignmentDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["TaskAssignment"];
			meta: { name: "TaskAssignment" };
		};
		/**
		 * Find zero or one TaskAssignment that matches the filter.
		 * @param {TaskAssignmentFindUniqueArgs} args - Arguments to find a TaskAssignment
		 * @example
		 * // Get one TaskAssignment
		 * const taskAssignment = await prisma.taskAssignment.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends TaskAssignmentFindUniqueArgs>(
			args: SelectSubset<T, TaskAssignmentFindUniqueArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<
				Prisma.$TaskAssignmentPayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one TaskAssignment that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {TaskAssignmentFindUniqueOrThrowArgs} args - Arguments to find a TaskAssignment
		 * @example
		 * // Get one TaskAssignment
		 * const taskAssignment = await prisma.taskAssignment.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends TaskAssignmentFindUniqueOrThrowArgs>(
			args: SelectSubset<T, TaskAssignmentFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<
				Prisma.$TaskAssignmentPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first TaskAssignment that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskAssignmentFindFirstArgs} args - Arguments to find a TaskAssignment
		 * @example
		 * // Get one TaskAssignment
		 * const taskAssignment = await prisma.taskAssignment.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends TaskAssignmentFindFirstArgs>(
			args?: SelectSubset<T, TaskAssignmentFindFirstArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<
				Prisma.$TaskAssignmentPayload<ExtArgs>,
				T,
				"findFirst",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first TaskAssignment that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskAssignmentFindFirstOrThrowArgs} args - Arguments to find a TaskAssignment
		 * @example
		 * // Get one TaskAssignment
		 * const taskAssignment = await prisma.taskAssignment.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends TaskAssignmentFindFirstOrThrowArgs>(
			args?: SelectSubset<T, TaskAssignmentFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<
				Prisma.$TaskAssignmentPayload<ExtArgs>,
				T,
				"findFirstOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more TaskAssignments that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all TaskAssignments
		 * const taskAssignments = await prisma.taskAssignment.findMany()
		 *
		 * // Get first 10 TaskAssignments
		 * const taskAssignments = await prisma.taskAssignment.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const taskAssignmentWithIdOnly = await prisma.taskAssignment.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends TaskAssignmentFindManyArgs>(
			args?: SelectSubset<T, TaskAssignmentFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TaskAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a TaskAssignment.
		 * @param {TaskAssignmentCreateArgs} args - Arguments to create a TaskAssignment.
		 * @example
		 * // Create one TaskAssignment
		 * const TaskAssignment = await prisma.taskAssignment.create({
		 *   data: {
		 *     // ... data to create a TaskAssignment
		 *   }
		 * })
		 *
		 */
		create<T extends TaskAssignmentCreateArgs>(
			args: SelectSubset<T, TaskAssignmentCreateArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<Prisma.$TaskAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many TaskAssignments.
		 * @param {TaskAssignmentCreateManyArgs} args - Arguments to create many TaskAssignments.
		 * @example
		 * // Create many TaskAssignments
		 * const taskAssignment = await prisma.taskAssignment.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends TaskAssignmentCreateManyArgs>(
			args?: SelectSubset<T, TaskAssignmentCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many TaskAssignments and returns the data saved in the database.
		 * @param {TaskAssignmentCreateManyAndReturnArgs} args - Arguments to create many TaskAssignments.
		 * @example
		 * // Create many TaskAssignments
		 * const taskAssignment = await prisma.taskAssignment.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many TaskAssignments and only return the `id`
		 * const taskAssignmentWithIdOnly = await prisma.taskAssignment.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends TaskAssignmentCreateManyAndReturnArgs>(
			args?: SelectSubset<T, TaskAssignmentCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$TaskAssignmentPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a TaskAssignment.
		 * @param {TaskAssignmentDeleteArgs} args - Arguments to delete one TaskAssignment.
		 * @example
		 * // Delete one TaskAssignment
		 * const TaskAssignment = await prisma.taskAssignment.delete({
		 *   where: {
		 *     // ... filter to delete one TaskAssignment
		 *   }
		 * })
		 *
		 */
		delete<T extends TaskAssignmentDeleteArgs>(
			args: SelectSubset<T, TaskAssignmentDeleteArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<Prisma.$TaskAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one TaskAssignment.
		 * @param {TaskAssignmentUpdateArgs} args - Arguments to update one TaskAssignment.
		 * @example
		 * // Update one TaskAssignment
		 * const taskAssignment = await prisma.taskAssignment.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends TaskAssignmentUpdateArgs>(
			args: SelectSubset<T, TaskAssignmentUpdateArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<Prisma.$TaskAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more TaskAssignments.
		 * @param {TaskAssignmentDeleteManyArgs} args - Arguments to filter TaskAssignments to delete.
		 * @example
		 * // Delete a few TaskAssignments
		 * const { count } = await prisma.taskAssignment.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends TaskAssignmentDeleteManyArgs>(
			args?: SelectSubset<T, TaskAssignmentDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more TaskAssignments.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many TaskAssignments
		 * const taskAssignment = await prisma.taskAssignment.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends TaskAssignmentUpdateManyArgs>(
			args: SelectSubset<T, TaskAssignmentUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more TaskAssignments and returns the data updated in the database.
		 * @param {TaskAssignmentUpdateManyAndReturnArgs} args - Arguments to update many TaskAssignments.
		 * @example
		 * // Update many TaskAssignments
		 * const taskAssignment = await prisma.taskAssignment.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more TaskAssignments and only return the `id`
		 * const taskAssignmentWithIdOnly = await prisma.taskAssignment.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends TaskAssignmentUpdateManyAndReturnArgs>(
			args: SelectSubset<T, TaskAssignmentUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$TaskAssignmentPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one TaskAssignment.
		 * @param {TaskAssignmentUpsertArgs} args - Arguments to update or create a TaskAssignment.
		 * @example
		 * // Update or create a TaskAssignment
		 * const taskAssignment = await prisma.taskAssignment.upsert({
		 *   create: {
		 *     // ... data to create a TaskAssignment
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the TaskAssignment we want to update
		 *   }
		 * })
		 */
		upsert<T extends TaskAssignmentUpsertArgs>(
			args: SelectSubset<T, TaskAssignmentUpsertArgs<ExtArgs>>
		): Prisma__TaskAssignmentClient<
			$Result.GetResult<Prisma.$TaskAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of TaskAssignments.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskAssignmentCountArgs} args - Arguments to filter TaskAssignments to count.
		 * @example
		 * // Count the number of TaskAssignments
		 * const count = await prisma.taskAssignment.count({
		 *   where: {
		 *     // ... the filter for the TaskAssignments we want to count
		 *   }
		 * })
		 **/
		count<T extends TaskAssignmentCountArgs>(
			args?: Subset<T, TaskAssignmentCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], TaskAssignmentCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a TaskAssignment.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends TaskAssignmentAggregateArgs>(
			args: Subset<T, TaskAssignmentAggregateArgs>
		): Prisma.PrismaPromise<GetTaskAssignmentAggregateType<T>>;

		/**
		 * Group by TaskAssignment.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TaskAssignmentGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends TaskAssignmentGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: TaskAssignmentGroupByArgs["orderBy"] }
				: { orderBy?: TaskAssignmentGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, TaskAssignmentGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors
			? GetTaskAssignmentGroupByPayload<T>
			: Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the TaskAssignment model
		 */
		readonly fields: TaskAssignmentFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for TaskAssignment.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__TaskAssignmentClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		Employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			| $Result.GetResult<
					Prisma.$EmployeePayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		TaskType<T extends TaskTypeDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, TaskTypeDefaultArgs<ExtArgs>>
		): Prisma__TaskTypeClient<
			| $Result.GetResult<
					Prisma.$TaskTypePayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		TimeLogs<T extends TaskAssignment$TimeLogsArgs<ExtArgs> = {}>(
			args?: Subset<T, TaskAssignment$TimeLogsArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the TaskAssignment model
	 */
	interface TaskAssignmentFieldRefs {
		readonly id: FieldRef<"TaskAssignment", "String">;
		readonly employeeId: FieldRef<"TaskAssignment", "String">;
		readonly taskTypeId: FieldRef<"TaskAssignment", "String">;
		readonly startTime: FieldRef<"TaskAssignment", "DateTime">;
		readonly endTime: FieldRef<"TaskAssignment", "DateTime">;
		readonly unitsCompleted: FieldRef<"TaskAssignment", "Int">;
		readonly notes: FieldRef<"TaskAssignment", "String">;
		readonly createdAt: FieldRef<"TaskAssignment", "DateTime">;
		readonly updatedAt: FieldRef<"TaskAssignment", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * TaskAssignment findUnique
	 */
	export type TaskAssignmentFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskAssignment to fetch.
		 */
		where: TaskAssignmentWhereUniqueInput;
	};

	/**
	 * TaskAssignment findUniqueOrThrow
	 */
	export type TaskAssignmentFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskAssignment to fetch.
		 */
		where: TaskAssignmentWhereUniqueInput;
	};

	/**
	 * TaskAssignment findFirst
	 */
	export type TaskAssignmentFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskAssignment to fetch.
		 */
		where?: TaskAssignmentWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TaskAssignments to fetch.
		 */
		orderBy?: TaskAssignmentOrderByWithRelationInput | TaskAssignmentOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for TaskAssignments.
		 */
		cursor?: TaskAssignmentWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TaskAssignments from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TaskAssignments.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of TaskAssignments.
		 */
		distinct?: TaskAssignmentScalarFieldEnum | TaskAssignmentScalarFieldEnum[];
	};

	/**
	 * TaskAssignment findFirstOrThrow
	 */
	export type TaskAssignmentFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskAssignment to fetch.
		 */
		where?: TaskAssignmentWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TaskAssignments to fetch.
		 */
		orderBy?: TaskAssignmentOrderByWithRelationInput | TaskAssignmentOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for TaskAssignments.
		 */
		cursor?: TaskAssignmentWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TaskAssignments from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TaskAssignments.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of TaskAssignments.
		 */
		distinct?: TaskAssignmentScalarFieldEnum | TaskAssignmentScalarFieldEnum[];
	};

	/**
	 * TaskAssignment findMany
	 */
	export type TaskAssignmentFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * Filter, which TaskAssignments to fetch.
		 */
		where?: TaskAssignmentWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of TaskAssignments to fetch.
		 */
		orderBy?: TaskAssignmentOrderByWithRelationInput | TaskAssignmentOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing TaskAssignments.
		 */
		cursor?: TaskAssignmentWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` TaskAssignments from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` TaskAssignments.
		 */
		skip?: number;
		distinct?: TaskAssignmentScalarFieldEnum | TaskAssignmentScalarFieldEnum[];
	};

	/**
	 * TaskAssignment create
	 */
	export type TaskAssignmentCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * The data needed to create a TaskAssignment.
		 */
		data: XOR<TaskAssignmentCreateInput, TaskAssignmentUncheckedCreateInput>;
	};

	/**
	 * TaskAssignment createMany
	 */
	export type TaskAssignmentCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many TaskAssignments.
		 */
		data: TaskAssignmentCreateManyInput | TaskAssignmentCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * TaskAssignment createManyAndReturn
	 */
	export type TaskAssignmentCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * The data used to create many TaskAssignments.
		 */
		data: TaskAssignmentCreateManyInput | TaskAssignmentCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * TaskAssignment update
	 */
	export type TaskAssignmentUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * The data needed to update a TaskAssignment.
		 */
		data: XOR<TaskAssignmentUpdateInput, TaskAssignmentUncheckedUpdateInput>;
		/**
		 * Choose, which TaskAssignment to update.
		 */
		where: TaskAssignmentWhereUniqueInput;
	};

	/**
	 * TaskAssignment updateMany
	 */
	export type TaskAssignmentUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update TaskAssignments.
		 */
		data: XOR<TaskAssignmentUpdateManyMutationInput, TaskAssignmentUncheckedUpdateManyInput>;
		/**
		 * Filter which TaskAssignments to update
		 */
		where?: TaskAssignmentWhereInput;
		/**
		 * Limit how many TaskAssignments to update.
		 */
		limit?: number;
	};

	/**
	 * TaskAssignment updateManyAndReturn
	 */
	export type TaskAssignmentUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * The data used to update TaskAssignments.
		 */
		data: XOR<TaskAssignmentUpdateManyMutationInput, TaskAssignmentUncheckedUpdateManyInput>;
		/**
		 * Filter which TaskAssignments to update
		 */
		where?: TaskAssignmentWhereInput;
		/**
		 * Limit how many TaskAssignments to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * TaskAssignment upsert
	 */
	export type TaskAssignmentUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * The filter to search for the TaskAssignment to update in case it exists.
		 */
		where: TaskAssignmentWhereUniqueInput;
		/**
		 * In case the TaskAssignment found by the `where` argument doesn't exist, create a new TaskAssignment with this data.
		 */
		create: XOR<TaskAssignmentCreateInput, TaskAssignmentUncheckedCreateInput>;
		/**
		 * In case the TaskAssignment was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<TaskAssignmentUpdateInput, TaskAssignmentUncheckedUpdateInput>;
	};

	/**
	 * TaskAssignment delete
	 */
	export type TaskAssignmentDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
		/**
		 * Filter which TaskAssignment to delete.
		 */
		where: TaskAssignmentWhereUniqueInput;
	};

	/**
	 * TaskAssignment deleteMany
	 */
	export type TaskAssignmentDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which TaskAssignments to delete
		 */
		where?: TaskAssignmentWhereInput;
		/**
		 * Limit how many TaskAssignments to delete.
		 */
		limit?: number;
	};

	/**
	 * TaskAssignment.TimeLogs
	 */
	export type TaskAssignment$TimeLogsArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TimeLog
		 */
		select?: TimeLogSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TimeLog
		 */
		omit?: TimeLogOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TimeLogInclude<ExtArgs> | null;
		where?: TimeLogWhereInput;
		orderBy?: TimeLogOrderByWithRelationInput | TimeLogOrderByWithRelationInput[];
		cursor?: TimeLogWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: TimeLogScalarFieldEnum | TimeLogScalarFieldEnum[];
	};

	/**
	 * TaskAssignment without action
	 */
	export type TaskAssignmentDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the TaskAssignment
		 */
		select?: TaskAssignmentSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the TaskAssignment
		 */
		omit?: TaskAssignmentOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: TaskAssignmentInclude<ExtArgs> | null;
	};

	/**
	 * Model PerformanceMetric
	 */

	export type AggregatePerformanceMetric = {
		_count: PerformanceMetricCountAggregateOutputType | null;
		_avg: PerformanceMetricAvgAggregateOutputType | null;
		_sum: PerformanceMetricSumAggregateOutputType | null;
		_min: PerformanceMetricMinAggregateOutputType | null;
		_max: PerformanceMetricMaxAggregateOutputType | null;
	};

	export type PerformanceMetricAvgAggregateOutputType = {
		hoursWorked: number | null;
		unitsProcessed: number | null;
		efficiency: number | null;
		qualityScore: number | null;
		overtimeHours: number | null;
	};

	export type PerformanceMetricSumAggregateOutputType = {
		hoursWorked: number | null;
		unitsProcessed: number | null;
		efficiency: number | null;
		qualityScore: number | null;
		overtimeHours: number | null;
	};

	export type PerformanceMetricMinAggregateOutputType = {
		id: string | null;
		employeeId: string | null;
		date: Date | null;
		stationId: string | null;
		hoursWorked: number | null;
		unitsProcessed: number | null;
		efficiency: number | null;
		qualityScore: number | null;
		overtimeHours: number | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type PerformanceMetricMaxAggregateOutputType = {
		id: string | null;
		employeeId: string | null;
		date: Date | null;
		stationId: string | null;
		hoursWorked: number | null;
		unitsProcessed: number | null;
		efficiency: number | null;
		qualityScore: number | null;
		overtimeHours: number | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type PerformanceMetricCountAggregateOutputType = {
		id: number;
		employeeId: number;
		date: number;
		stationId: number;
		hoursWorked: number;
		unitsProcessed: number;
		efficiency: number;
		qualityScore: number;
		overtimeHours: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type PerformanceMetricAvgAggregateInputType = {
		hoursWorked?: true;
		unitsProcessed?: true;
		efficiency?: true;
		qualityScore?: true;
		overtimeHours?: true;
	};

	export type PerformanceMetricSumAggregateInputType = {
		hoursWorked?: true;
		unitsProcessed?: true;
		efficiency?: true;
		qualityScore?: true;
		overtimeHours?: true;
	};

	export type PerformanceMetricMinAggregateInputType = {
		id?: true;
		employeeId?: true;
		date?: true;
		stationId?: true;
		hoursWorked?: true;
		unitsProcessed?: true;
		efficiency?: true;
		qualityScore?: true;
		overtimeHours?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type PerformanceMetricMaxAggregateInputType = {
		id?: true;
		employeeId?: true;
		date?: true;
		stationId?: true;
		hoursWorked?: true;
		unitsProcessed?: true;
		efficiency?: true;
		qualityScore?: true;
		overtimeHours?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type PerformanceMetricCountAggregateInputType = {
		id?: true;
		employeeId?: true;
		date?: true;
		stationId?: true;
		hoursWorked?: true;
		unitsProcessed?: true;
		efficiency?: true;
		qualityScore?: true;
		overtimeHours?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type PerformanceMetricAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which PerformanceMetric to aggregate.
		 */
		where?: PerformanceMetricWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of PerformanceMetrics to fetch.
		 */
		orderBy?:
			| PerformanceMetricOrderByWithRelationInput
			| PerformanceMetricOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: PerformanceMetricWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` PerformanceMetrics from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` PerformanceMetrics.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned PerformanceMetrics
		 **/
		_count?: true | PerformanceMetricCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to average
		 **/
		_avg?: PerformanceMetricAvgAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to sum
		 **/
		_sum?: PerformanceMetricSumAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: PerformanceMetricMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: PerformanceMetricMaxAggregateInputType;
	};

	export type GetPerformanceMetricAggregateType<T extends PerformanceMetricAggregateArgs> = {
		[P in keyof T & keyof AggregatePerformanceMetric]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregatePerformanceMetric[P]>
			: GetScalarType<T[P], AggregatePerformanceMetric[P]>;
	};

	export type PerformanceMetricGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: PerformanceMetricWhereInput;
		orderBy?:
			| PerformanceMetricOrderByWithAggregationInput
			| PerformanceMetricOrderByWithAggregationInput[];
		by: PerformanceMetricScalarFieldEnum[] | PerformanceMetricScalarFieldEnum;
		having?: PerformanceMetricScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: PerformanceMetricCountAggregateInputType | true;
		_avg?: PerformanceMetricAvgAggregateInputType;
		_sum?: PerformanceMetricSumAggregateInputType;
		_min?: PerformanceMetricMinAggregateInputType;
		_max?: PerformanceMetricMaxAggregateInputType;
	};

	export type PerformanceMetricGroupByOutputType = {
		id: string;
		employeeId: string;
		date: Date;
		stationId: string | null;
		hoursWorked: number;
		unitsProcessed: number | null;
		efficiency: number | null;
		qualityScore: number | null;
		overtimeHours: number | null;
		createdAt: Date;
		updatedAt: Date;
		_count: PerformanceMetricCountAggregateOutputType | null;
		_avg: PerformanceMetricAvgAggregateOutputType | null;
		_sum: PerformanceMetricSumAggregateOutputType | null;
		_min: PerformanceMetricMinAggregateOutputType | null;
		_max: PerformanceMetricMaxAggregateOutputType | null;
	};

	type GetPerformanceMetricGroupByPayload<T extends PerformanceMetricGroupByArgs> =
		Prisma.PrismaPromise<
			Array<
				PickEnumerable<PerformanceMetricGroupByOutputType, T["by"]> & {
					[P in keyof T & keyof PerformanceMetricGroupByOutputType]: P extends "_count"
						? T[P] extends boolean
							? number
							: GetScalarType<T[P], PerformanceMetricGroupByOutputType[P]>
						: GetScalarType<T[P], PerformanceMetricGroupByOutputType[P]>;
				}
			>
		>;

	export type PerformanceMetricSelect<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			employeeId?: boolean;
			date?: boolean;
			stationId?: boolean;
			hoursWorked?: boolean;
			unitsProcessed?: boolean;
			efficiency?: boolean;
			qualityScore?: boolean;
			overtimeHours?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["performanceMetric"]
	>;

	export type PerformanceMetricSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			employeeId?: boolean;
			date?: boolean;
			stationId?: boolean;
			hoursWorked?: boolean;
			unitsProcessed?: boolean;
			efficiency?: boolean;
			qualityScore?: boolean;
			overtimeHours?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["performanceMetric"]
	>;

	export type PerformanceMetricSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			employeeId?: boolean;
			date?: boolean;
			stationId?: boolean;
			hoursWorked?: boolean;
			unitsProcessed?: boolean;
			efficiency?: boolean;
			qualityScore?: boolean;
			overtimeHours?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["performanceMetric"]
	>;

	export type PerformanceMetricSelectScalar = {
		id?: boolean;
		employeeId?: boolean;
		date?: boolean;
		stationId?: boolean;
		hoursWorked?: boolean;
		unitsProcessed?: boolean;
		efficiency?: boolean;
		qualityScore?: boolean;
		overtimeHours?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type PerformanceMetricOmit<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetOmit<
		| "id"
		| "employeeId"
		| "date"
		| "stationId"
		| "hoursWorked"
		| "unitsProcessed"
		| "efficiency"
		| "qualityScore"
		| "overtimeHours"
		| "createdAt"
		| "updatedAt",
		ExtArgs["result"]["performanceMetric"]
	>;
	export type PerformanceMetricInclude<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
	};
	export type PerformanceMetricIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
	};
	export type PerformanceMetricIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | EmployeeDefaultArgs<ExtArgs>;
	};

	export type $PerformanceMetricPayload<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		name: "PerformanceMetric";
		objects: {
			Employee: Prisma.$EmployeePayload<ExtArgs>;
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				employeeId: string;
				date: Date;
				stationId: string | null;
				hoursWorked: number;
				unitsProcessed: number | null;
				efficiency: number | null;
				qualityScore: number | null;
				overtimeHours: number | null;
				createdAt: Date;
				updatedAt: Date;
			},
			ExtArgs["result"]["performanceMetric"]
		>;
		composites: {};
	};

	type PerformanceMetricGetPayload<
		S extends boolean | null | undefined | PerformanceMetricDefaultArgs,
	> = $Result.GetResult<Prisma.$PerformanceMetricPayload, S>;

	type PerformanceMetricCountArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = Omit<PerformanceMetricFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
		select?: PerformanceMetricCountAggregateInputType | true;
	};

	export interface PerformanceMetricDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: {
			types: Prisma.TypeMap<ExtArgs>["model"]["PerformanceMetric"];
			meta: { name: "PerformanceMetric" };
		};
		/**
		 * Find zero or one PerformanceMetric that matches the filter.
		 * @param {PerformanceMetricFindUniqueArgs} args - Arguments to find a PerformanceMetric
		 * @example
		 * // Get one PerformanceMetric
		 * const performanceMetric = await prisma.performanceMetric.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends PerformanceMetricFindUniqueArgs>(
			args: SelectSubset<T, PerformanceMetricFindUniqueArgs<ExtArgs>>
		): Prisma__PerformanceMetricClient<
			$Result.GetResult<
				Prisma.$PerformanceMetricPayload<ExtArgs>,
				T,
				"findUnique",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one PerformanceMetric that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {PerformanceMetricFindUniqueOrThrowArgs} args - Arguments to find a PerformanceMetric
		 * @example
		 * // Get one PerformanceMetric
		 * const performanceMetric = await prisma.performanceMetric.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends PerformanceMetricFindUniqueOrThrowArgs>(
			args: SelectSubset<T, PerformanceMetricFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__PerformanceMetricClient<
			$Result.GetResult<
				Prisma.$PerformanceMetricPayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first PerformanceMetric that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PerformanceMetricFindFirstArgs} args - Arguments to find a PerformanceMetric
		 * @example
		 * // Get one PerformanceMetric
		 * const performanceMetric = await prisma.performanceMetric.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends PerformanceMetricFindFirstArgs>(
			args?: SelectSubset<T, PerformanceMetricFindFirstArgs<ExtArgs>>
		): Prisma__PerformanceMetricClient<
			$Result.GetResult<
				Prisma.$PerformanceMetricPayload<ExtArgs>,
				T,
				"findFirst",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first PerformanceMetric that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PerformanceMetricFindFirstOrThrowArgs} args - Arguments to find a PerformanceMetric
		 * @example
		 * // Get one PerformanceMetric
		 * const performanceMetric = await prisma.performanceMetric.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends PerformanceMetricFindFirstOrThrowArgs>(
			args?: SelectSubset<T, PerformanceMetricFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__PerformanceMetricClient<
			$Result.GetResult<
				Prisma.$PerformanceMetricPayload<ExtArgs>,
				T,
				"findFirstOrThrow",
				GlobalOmitOptions
			>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more PerformanceMetrics that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PerformanceMetricFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all PerformanceMetrics
		 * const performanceMetrics = await prisma.performanceMetric.findMany()
		 *
		 * // Get first 10 PerformanceMetrics
		 * const performanceMetrics = await prisma.performanceMetric.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const performanceMetricWithIdOnly = await prisma.performanceMetric.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends PerformanceMetricFindManyArgs>(
			args?: SelectSubset<T, PerformanceMetricFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a PerformanceMetric.
		 * @param {PerformanceMetricCreateArgs} args - Arguments to create a PerformanceMetric.
		 * @example
		 * // Create one PerformanceMetric
		 * const PerformanceMetric = await prisma.performanceMetric.create({
		 *   data: {
		 *     // ... data to create a PerformanceMetric
		 *   }
		 * })
		 *
		 */
		create<T extends PerformanceMetricCreateArgs>(
			args: SelectSubset<T, PerformanceMetricCreateArgs<ExtArgs>>
		): Prisma__PerformanceMetricClient<
			$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many PerformanceMetrics.
		 * @param {PerformanceMetricCreateManyArgs} args - Arguments to create many PerformanceMetrics.
		 * @example
		 * // Create many PerformanceMetrics
		 * const performanceMetric = await prisma.performanceMetric.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends PerformanceMetricCreateManyArgs>(
			args?: SelectSubset<T, PerformanceMetricCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many PerformanceMetrics and returns the data saved in the database.
		 * @param {PerformanceMetricCreateManyAndReturnArgs} args - Arguments to create many PerformanceMetrics.
		 * @example
		 * // Create many PerformanceMetrics
		 * const performanceMetric = await prisma.performanceMetric.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many PerformanceMetrics and only return the `id`
		 * const performanceMetricWithIdOnly = await prisma.performanceMetric.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends PerformanceMetricCreateManyAndReturnArgs>(
			args?: SelectSubset<T, PerformanceMetricCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$PerformanceMetricPayload<ExtArgs>,
				T,
				"createManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Delete a PerformanceMetric.
		 * @param {PerformanceMetricDeleteArgs} args - Arguments to delete one PerformanceMetric.
		 * @example
		 * // Delete one PerformanceMetric
		 * const PerformanceMetric = await prisma.performanceMetric.delete({
		 *   where: {
		 *     // ... filter to delete one PerformanceMetric
		 *   }
		 * })
		 *
		 */
		delete<T extends PerformanceMetricDeleteArgs>(
			args: SelectSubset<T, PerformanceMetricDeleteArgs<ExtArgs>>
		): Prisma__PerformanceMetricClient<
			$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one PerformanceMetric.
		 * @param {PerformanceMetricUpdateArgs} args - Arguments to update one PerformanceMetric.
		 * @example
		 * // Update one PerformanceMetric
		 * const performanceMetric = await prisma.performanceMetric.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends PerformanceMetricUpdateArgs>(
			args: SelectSubset<T, PerformanceMetricUpdateArgs<ExtArgs>>
		): Prisma__PerformanceMetricClient<
			$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more PerformanceMetrics.
		 * @param {PerformanceMetricDeleteManyArgs} args - Arguments to filter PerformanceMetrics to delete.
		 * @example
		 * // Delete a few PerformanceMetrics
		 * const { count } = await prisma.performanceMetric.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends PerformanceMetricDeleteManyArgs>(
			args?: SelectSubset<T, PerformanceMetricDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more PerformanceMetrics.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PerformanceMetricUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many PerformanceMetrics
		 * const performanceMetric = await prisma.performanceMetric.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends PerformanceMetricUpdateManyArgs>(
			args: SelectSubset<T, PerformanceMetricUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more PerformanceMetrics and returns the data updated in the database.
		 * @param {PerformanceMetricUpdateManyAndReturnArgs} args - Arguments to update many PerformanceMetrics.
		 * @example
		 * // Update many PerformanceMetrics
		 * const performanceMetric = await prisma.performanceMetric.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more PerformanceMetrics and only return the `id`
		 * const performanceMetricWithIdOnly = await prisma.performanceMetric.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends PerformanceMetricUpdateManyAndReturnArgs>(
			args: SelectSubset<T, PerformanceMetricUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<
				Prisma.$PerformanceMetricPayload<ExtArgs>,
				T,
				"updateManyAndReturn",
				GlobalOmitOptions
			>
		>;

		/**
		 * Create or update one PerformanceMetric.
		 * @param {PerformanceMetricUpsertArgs} args - Arguments to update or create a PerformanceMetric.
		 * @example
		 * // Update or create a PerformanceMetric
		 * const performanceMetric = await prisma.performanceMetric.upsert({
		 *   create: {
		 *     // ... data to create a PerformanceMetric
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the PerformanceMetric we want to update
		 *   }
		 * })
		 */
		upsert<T extends PerformanceMetricUpsertArgs>(
			args: SelectSubset<T, PerformanceMetricUpsertArgs<ExtArgs>>
		): Prisma__PerformanceMetricClient<
			$Result.GetResult<Prisma.$PerformanceMetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of PerformanceMetrics.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PerformanceMetricCountArgs} args - Arguments to filter PerformanceMetrics to count.
		 * @example
		 * // Count the number of PerformanceMetrics
		 * const count = await prisma.performanceMetric.count({
		 *   where: {
		 *     // ... the filter for the PerformanceMetrics we want to count
		 *   }
		 * })
		 **/
		count<T extends PerformanceMetricCountArgs>(
			args?: Subset<T, PerformanceMetricCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], PerformanceMetricCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a PerformanceMetric.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PerformanceMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends PerformanceMetricAggregateArgs>(
			args: Subset<T, PerformanceMetricAggregateArgs>
		): Prisma.PrismaPromise<GetPerformanceMetricAggregateType<T>>;

		/**
		 * Group by PerformanceMetric.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {PerformanceMetricGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends PerformanceMetricGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: PerformanceMetricGroupByArgs["orderBy"] }
				: { orderBy?: PerformanceMetricGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, PerformanceMetricGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors
			? GetPerformanceMetricGroupByPayload<T>
			: Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the PerformanceMetric model
		 */
		readonly fields: PerformanceMetricFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for PerformanceMetric.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__PerformanceMetricClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		Employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			| $Result.GetResult<
					Prisma.$EmployeePayload<ExtArgs>,
					T,
					"findUniqueOrThrow",
					GlobalOmitOptions
			  >
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the PerformanceMetric model
	 */
	interface PerformanceMetricFieldRefs {
		readonly id: FieldRef<"PerformanceMetric", "String">;
		readonly employeeId: FieldRef<"PerformanceMetric", "String">;
		readonly date: FieldRef<"PerformanceMetric", "DateTime">;
		readonly stationId: FieldRef<"PerformanceMetric", "String">;
		readonly hoursWorked: FieldRef<"PerformanceMetric", "Float">;
		readonly unitsProcessed: FieldRef<"PerformanceMetric", "Int">;
		readonly efficiency: FieldRef<"PerformanceMetric", "Float">;
		readonly qualityScore: FieldRef<"PerformanceMetric", "Float">;
		readonly overtimeHours: FieldRef<"PerformanceMetric", "Float">;
		readonly createdAt: FieldRef<"PerformanceMetric", "DateTime">;
		readonly updatedAt: FieldRef<"PerformanceMetric", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * PerformanceMetric findUnique
	 */
	export type PerformanceMetricFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * Filter, which PerformanceMetric to fetch.
		 */
		where: PerformanceMetricWhereUniqueInput;
	};

	/**
	 * PerformanceMetric findUniqueOrThrow
	 */
	export type PerformanceMetricFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * Filter, which PerformanceMetric to fetch.
		 */
		where: PerformanceMetricWhereUniqueInput;
	};

	/**
	 * PerformanceMetric findFirst
	 */
	export type PerformanceMetricFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * Filter, which PerformanceMetric to fetch.
		 */
		where?: PerformanceMetricWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of PerformanceMetrics to fetch.
		 */
		orderBy?:
			| PerformanceMetricOrderByWithRelationInput
			| PerformanceMetricOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for PerformanceMetrics.
		 */
		cursor?: PerformanceMetricWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` PerformanceMetrics from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` PerformanceMetrics.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of PerformanceMetrics.
		 */
		distinct?: PerformanceMetricScalarFieldEnum | PerformanceMetricScalarFieldEnum[];
	};

	/**
	 * PerformanceMetric findFirstOrThrow
	 */
	export type PerformanceMetricFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * Filter, which PerformanceMetric to fetch.
		 */
		where?: PerformanceMetricWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of PerformanceMetrics to fetch.
		 */
		orderBy?:
			| PerformanceMetricOrderByWithRelationInput
			| PerformanceMetricOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for PerformanceMetrics.
		 */
		cursor?: PerformanceMetricWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` PerformanceMetrics from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` PerformanceMetrics.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of PerformanceMetrics.
		 */
		distinct?: PerformanceMetricScalarFieldEnum | PerformanceMetricScalarFieldEnum[];
	};

	/**
	 * PerformanceMetric findMany
	 */
	export type PerformanceMetricFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * Filter, which PerformanceMetrics to fetch.
		 */
		where?: PerformanceMetricWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of PerformanceMetrics to fetch.
		 */
		orderBy?:
			| PerformanceMetricOrderByWithRelationInput
			| PerformanceMetricOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing PerformanceMetrics.
		 */
		cursor?: PerformanceMetricWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` PerformanceMetrics from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` PerformanceMetrics.
		 */
		skip?: number;
		distinct?: PerformanceMetricScalarFieldEnum | PerformanceMetricScalarFieldEnum[];
	};

	/**
	 * PerformanceMetric create
	 */
	export type PerformanceMetricCreateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * The data needed to create a PerformanceMetric.
		 */
		data: XOR<PerformanceMetricCreateInput, PerformanceMetricUncheckedCreateInput>;
	};

	/**
	 * PerformanceMetric createMany
	 */
	export type PerformanceMetricCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many PerformanceMetrics.
		 */
		data: PerformanceMetricCreateManyInput | PerformanceMetricCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * PerformanceMetric createManyAndReturn
	 */
	export type PerformanceMetricCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * The data used to create many PerformanceMetrics.
		 */
		data: PerformanceMetricCreateManyInput | PerformanceMetricCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * PerformanceMetric update
	 */
	export type PerformanceMetricUpdateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * The data needed to update a PerformanceMetric.
		 */
		data: XOR<PerformanceMetricUpdateInput, PerformanceMetricUncheckedUpdateInput>;
		/**
		 * Choose, which PerformanceMetric to update.
		 */
		where: PerformanceMetricWhereUniqueInput;
	};

	/**
	 * PerformanceMetric updateMany
	 */
	export type PerformanceMetricUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update PerformanceMetrics.
		 */
		data: XOR<PerformanceMetricUpdateManyMutationInput, PerformanceMetricUncheckedUpdateManyInput>;
		/**
		 * Filter which PerformanceMetrics to update
		 */
		where?: PerformanceMetricWhereInput;
		/**
		 * Limit how many PerformanceMetrics to update.
		 */
		limit?: number;
	};

	/**
	 * PerformanceMetric updateManyAndReturn
	 */
	export type PerformanceMetricUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * The data used to update PerformanceMetrics.
		 */
		data: XOR<PerformanceMetricUpdateManyMutationInput, PerformanceMetricUncheckedUpdateManyInput>;
		/**
		 * Filter which PerformanceMetrics to update
		 */
		where?: PerformanceMetricWhereInput;
		/**
		 * Limit how many PerformanceMetrics to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * PerformanceMetric upsert
	 */
	export type PerformanceMetricUpsertArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * The filter to search for the PerformanceMetric to update in case it exists.
		 */
		where: PerformanceMetricWhereUniqueInput;
		/**
		 * In case the PerformanceMetric found by the `where` argument doesn't exist, create a new PerformanceMetric with this data.
		 */
		create: XOR<PerformanceMetricCreateInput, PerformanceMetricUncheckedCreateInput>;
		/**
		 * In case the PerformanceMetric was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<PerformanceMetricUpdateInput, PerformanceMetricUncheckedUpdateInput>;
	};

	/**
	 * PerformanceMetric delete
	 */
	export type PerformanceMetricDeleteArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
		/**
		 * Filter which PerformanceMetric to delete.
		 */
		where: PerformanceMetricWhereUniqueInput;
	};

	/**
	 * PerformanceMetric deleteMany
	 */
	export type PerformanceMetricDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which PerformanceMetrics to delete
		 */
		where?: PerformanceMetricWhereInput;
		/**
		 * Limit how many PerformanceMetrics to delete.
		 */
		limit?: number;
	};

	/**
	 * PerformanceMetric without action
	 */
	export type PerformanceMetricDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the PerformanceMetric
		 */
		select?: PerformanceMetricSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the PerformanceMetric
		 */
		omit?: PerformanceMetricOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: PerformanceMetricInclude<ExtArgs> | null;
	};

	/**
	 * Model Todo
	 */

	export type AggregateTodo = {
		_count: TodoCountAggregateOutputType | null;
		_min: TodoMinAggregateOutputType | null;
		_max: TodoMaxAggregateOutputType | null;
	};

	export type TodoMinAggregateOutputType = {
		id: string | null;
		title: string | null;
		completed: boolean | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type TodoMaxAggregateOutputType = {
		id: string | null;
		title: string | null;
		completed: boolean | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};

	export type TodoCountAggregateOutputType = {
		id: number;
		title: number;
		completed: number;
		createdAt: number;
		updatedAt: number;
		_all: number;
	};

	export type TodoMinAggregateInputType = {
		id?: true;
		title?: true;
		completed?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type TodoMaxAggregateInputType = {
		id?: true;
		title?: true;
		completed?: true;
		createdAt?: true;
		updatedAt?: true;
	};

	export type TodoCountAggregateInputType = {
		id?: true;
		title?: true;
		completed?: true;
		createdAt?: true;
		updatedAt?: true;
		_all?: true;
	};

	export type TodoAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Todo to aggregate.
		 */
		where?: TodoWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Todos to fetch.
		 */
		orderBy?: TodoOrderByWithRelationInput | TodoOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: TodoWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Todos from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Todos.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Todos
		 **/
		_count?: true | TodoCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: TodoMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: TodoMaxAggregateInputType;
	};

	export type GetTodoAggregateType<T extends TodoAggregateArgs> = {
		[P in keyof T & keyof AggregateTodo]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateTodo[P]>
			: GetScalarType<T[P], AggregateTodo[P]>;
	};

	export type TodoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			where?: TodoWhereInput;
			orderBy?: TodoOrderByWithAggregationInput | TodoOrderByWithAggregationInput[];
			by: TodoScalarFieldEnum[] | TodoScalarFieldEnum;
			having?: TodoScalarWhereWithAggregatesInput;
			take?: number;
			skip?: number;
			_count?: TodoCountAggregateInputType | true;
			_min?: TodoMinAggregateInputType;
			_max?: TodoMaxAggregateInputType;
		};

	export type TodoGroupByOutputType = {
		id: string;
		title: string;
		completed: boolean;
		createdAt: Date;
		updatedAt: Date;
		_count: TodoCountAggregateOutputType | null;
		_min: TodoMinAggregateOutputType | null;
		_max: TodoMaxAggregateOutputType | null;
	};

	type GetTodoGroupByPayload<T extends TodoGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<TodoGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof TodoGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], TodoGroupByOutputType[P]>
					: GetScalarType<T[P], TodoGroupByOutputType[P]>;
			}
		>
	>;

	export type TodoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetSelect<
			{
				id?: boolean;
				title?: boolean;
				completed?: boolean;
				createdAt?: boolean;
				updatedAt?: boolean;
			},
			ExtArgs["result"]["todo"]
		>;

	export type TodoSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			title?: boolean;
			completed?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
		},
		ExtArgs["result"]["todo"]
	>;

	export type TodoSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			title?: boolean;
			completed?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
		},
		ExtArgs["result"]["todo"]
	>;

	export type TodoSelectScalar = {
		id?: boolean;
		title?: boolean;
		completed?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
	};

	export type TodoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<
			"id" | "title" | "completed" | "createdAt" | "updatedAt",
			ExtArgs["result"]["todo"]
		>;

	export type $TodoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		name: "Todo";
		objects: {};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				title: string;
				completed: boolean;
				createdAt: Date;
				updatedAt: Date;
			},
			ExtArgs["result"]["todo"]
		>;
		composites: {};
	};

	type TodoGetPayload<S extends boolean | null | undefined | TodoDefaultArgs> = $Result.GetResult<
		Prisma.$TodoPayload,
		S
	>;

	type TodoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		TodoFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: TodoCountAggregateInputType | true;
	};

	export interface TodoDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Todo"]; meta: { name: "Todo" } };
		/**
		 * Find zero or one Todo that matches the filter.
		 * @param {TodoFindUniqueArgs} args - Arguments to find a Todo
		 * @example
		 * // Get one Todo
		 * const todo = await prisma.todo.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends TodoFindUniqueArgs>(
			args: SelectSubset<T, TodoFindUniqueArgs<ExtArgs>>
		): Prisma__TodoClient<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one Todo that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {TodoFindUniqueOrThrowArgs} args - Arguments to find a Todo
		 * @example
		 * // Get one Todo
		 * const todo = await prisma.todo.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends TodoFindUniqueOrThrowArgs>(
			args: SelectSubset<T, TodoFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__TodoClient<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Todo that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TodoFindFirstArgs} args - Arguments to find a Todo
		 * @example
		 * // Get one Todo
		 * const todo = await prisma.todo.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends TodoFindFirstArgs>(
			args?: SelectSubset<T, TodoFindFirstArgs<ExtArgs>>
		): Prisma__TodoClient<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first Todo that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TodoFindFirstOrThrowArgs} args - Arguments to find a Todo
		 * @example
		 * // Get one Todo
		 * const todo = await prisma.todo.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends TodoFindFirstOrThrowArgs>(
			args?: SelectSubset<T, TodoFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__TodoClient<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Todos that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TodoFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Todos
		 * const todos = await prisma.todo.findMany()
		 *
		 * // Get first 10 Todos
		 * const todos = await prisma.todo.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const todoWithIdOnly = await prisma.todo.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends TodoFindManyArgs>(
			args?: SelectSubset<T, TodoFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a Todo.
		 * @param {TodoCreateArgs} args - Arguments to create a Todo.
		 * @example
		 * // Create one Todo
		 * const Todo = await prisma.todo.create({
		 *   data: {
		 *     // ... data to create a Todo
		 *   }
		 * })
		 *
		 */
		create<T extends TodoCreateArgs>(
			args: SelectSubset<T, TodoCreateArgs<ExtArgs>>
		): Prisma__TodoClient<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many Todos.
		 * @param {TodoCreateManyArgs} args - Arguments to create many Todos.
		 * @example
		 * // Create many Todos
		 * const todo = await prisma.todo.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends TodoCreateManyArgs>(
			args?: SelectSubset<T, TodoCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Todos and returns the data saved in the database.
		 * @param {TodoCreateManyAndReturnArgs} args - Arguments to create many Todos.
		 * @example
		 * // Create many Todos
		 * const todo = await prisma.todo.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Todos and only return the `id`
		 * const todoWithIdOnly = await prisma.todo.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends TodoCreateManyAndReturnArgs>(
			args?: SelectSubset<T, TodoCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>
		>;

		/**
		 * Delete a Todo.
		 * @param {TodoDeleteArgs} args - Arguments to delete one Todo.
		 * @example
		 * // Delete one Todo
		 * const Todo = await prisma.todo.delete({
		 *   where: {
		 *     // ... filter to delete one Todo
		 *   }
		 * })
		 *
		 */
		delete<T extends TodoDeleteArgs>(
			args: SelectSubset<T, TodoDeleteArgs<ExtArgs>>
		): Prisma__TodoClient<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one Todo.
		 * @param {TodoUpdateArgs} args - Arguments to update one Todo.
		 * @example
		 * // Update one Todo
		 * const todo = await prisma.todo.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends TodoUpdateArgs>(
			args: SelectSubset<T, TodoUpdateArgs<ExtArgs>>
		): Prisma__TodoClient<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more Todos.
		 * @param {TodoDeleteManyArgs} args - Arguments to filter Todos to delete.
		 * @example
		 * // Delete a few Todos
		 * const { count } = await prisma.todo.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends TodoDeleteManyArgs>(
			args?: SelectSubset<T, TodoDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Todos.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TodoUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Todos
		 * const todo = await prisma.todo.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends TodoUpdateManyArgs>(
			args: SelectSubset<T, TodoUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Todos and returns the data updated in the database.
		 * @param {TodoUpdateManyAndReturnArgs} args - Arguments to update many Todos.
		 * @example
		 * // Update many Todos
		 * const todo = await prisma.todo.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Todos and only return the `id`
		 * const todoWithIdOnly = await prisma.todo.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends TodoUpdateManyAndReturnArgs>(
			args: SelectSubset<T, TodoUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>
		>;

		/**
		 * Create or update one Todo.
		 * @param {TodoUpsertArgs} args - Arguments to update or create a Todo.
		 * @example
		 * // Update or create a Todo
		 * const todo = await prisma.todo.upsert({
		 *   create: {
		 *     // ... data to create a Todo
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the Todo we want to update
		 *   }
		 * })
		 */
		upsert<T extends TodoUpsertArgs>(
			args: SelectSubset<T, TodoUpsertArgs<ExtArgs>>
		): Prisma__TodoClient<
			$Result.GetResult<Prisma.$TodoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of Todos.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TodoCountArgs} args - Arguments to filter Todos to count.
		 * @example
		 * // Count the number of Todos
		 * const count = await prisma.todo.count({
		 *   where: {
		 *     // ... the filter for the Todos we want to count
		 *   }
		 * })
		 **/
		count<T extends TodoCountArgs>(
			args?: Subset<T, TodoCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], TodoCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a Todo.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TodoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends TodoAggregateArgs>(
			args: Subset<T, TodoAggregateArgs>
		): Prisma.PrismaPromise<GetTodoAggregateType<T>>;

		/**
		 * Group by Todo.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {TodoGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends TodoGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: TodoGroupByArgs["orderBy"] }
				: { orderBy?: TodoGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, TodoGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors ? GetTodoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the Todo model
		 */
		readonly fields: TodoFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for Todo.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__TodoClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the Todo model
	 */
	interface TodoFieldRefs {
		readonly id: FieldRef<"Todo", "String">;
		readonly title: FieldRef<"Todo", "String">;
		readonly completed: FieldRef<"Todo", "Boolean">;
		readonly createdAt: FieldRef<"Todo", "DateTime">;
		readonly updatedAt: FieldRef<"Todo", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * Todo findUnique
	 */
	export type TodoFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * Filter, which Todo to fetch.
		 */
		where: TodoWhereUniqueInput;
	};

	/**
	 * Todo findUniqueOrThrow
	 */
	export type TodoFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * Filter, which Todo to fetch.
		 */
		where: TodoWhereUniqueInput;
	};

	/**
	 * Todo findFirst
	 */
	export type TodoFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * Filter, which Todo to fetch.
		 */
		where?: TodoWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Todos to fetch.
		 */
		orderBy?: TodoOrderByWithRelationInput | TodoOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Todos.
		 */
		cursor?: TodoWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Todos from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Todos.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Todos.
		 */
		distinct?: TodoScalarFieldEnum | TodoScalarFieldEnum[];
	};

	/**
	 * Todo findFirstOrThrow
	 */
	export type TodoFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * Filter, which Todo to fetch.
		 */
		where?: TodoWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Todos to fetch.
		 */
		orderBy?: TodoOrderByWithRelationInput | TodoOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Todos.
		 */
		cursor?: TodoWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Todos from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Todos.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Todos.
		 */
		distinct?: TodoScalarFieldEnum | TodoScalarFieldEnum[];
	};

	/**
	 * Todo findMany
	 */
	export type TodoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the Todo
			 */
			select?: TodoSelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the Todo
			 */
			omit?: TodoOmit<ExtArgs> | null;
			/**
			 * Filter, which Todos to fetch.
			 */
			where?: TodoWhereInput;
			/**
			 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
			 *
			 * Determine the order of Todos to fetch.
			 */
			orderBy?: TodoOrderByWithRelationInput | TodoOrderByWithRelationInput[];
			/**
			 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
			 *
			 * Sets the position for listing Todos.
			 */
			cursor?: TodoWhereUniqueInput;
			/**
			 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
			 *
			 * Take `±n` Todos from the position of the cursor.
			 */
			take?: number;
			/**
			 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
			 *
			 * Skip the first `n` Todos.
			 */
			skip?: number;
			distinct?: TodoScalarFieldEnum | TodoScalarFieldEnum[];
		};

	/**
	 * Todo create
	 */
	export type TodoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * The data needed to create a Todo.
		 */
		data: XOR<TodoCreateInput, TodoUncheckedCreateInput>;
	};

	/**
	 * Todo createMany
	 */
	export type TodoCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many Todos.
		 */
		data: TodoCreateManyInput | TodoCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Todo createManyAndReturn
	 */
	export type TodoCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * The data used to create many Todos.
		 */
		data: TodoCreateManyInput | TodoCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * Todo update
	 */
	export type TodoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * The data needed to update a Todo.
		 */
		data: XOR<TodoUpdateInput, TodoUncheckedUpdateInput>;
		/**
		 * Choose, which Todo to update.
		 */
		where: TodoWhereUniqueInput;
	};

	/**
	 * Todo updateMany
	 */
	export type TodoUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update Todos.
		 */
		data: XOR<TodoUpdateManyMutationInput, TodoUncheckedUpdateManyInput>;
		/**
		 * Filter which Todos to update
		 */
		where?: TodoWhereInput;
		/**
		 * Limit how many Todos to update.
		 */
		limit?: number;
	};

	/**
	 * Todo updateManyAndReturn
	 */
	export type TodoUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * The data used to update Todos.
		 */
		data: XOR<TodoUpdateManyMutationInput, TodoUncheckedUpdateManyInput>;
		/**
		 * Filter which Todos to update
		 */
		where?: TodoWhereInput;
		/**
		 * Limit how many Todos to update.
		 */
		limit?: number;
	};

	/**
	 * Todo upsert
	 */
	export type TodoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * The filter to search for the Todo to update in case it exists.
		 */
		where: TodoWhereUniqueInput;
		/**
		 * In case the Todo found by the `where` argument doesn't exist, create a new Todo with this data.
		 */
		create: XOR<TodoCreateInput, TodoUncheckedCreateInput>;
		/**
		 * In case the Todo was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<TodoUpdateInput, TodoUncheckedUpdateInput>;
	};

	/**
	 * Todo delete
	 */
	export type TodoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the Todo
		 */
		select?: TodoSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Todo
		 */
		omit?: TodoOmit<ExtArgs> | null;
		/**
		 * Filter which Todo to delete.
		 */
		where: TodoWhereUniqueInput;
	};

	/**
	 * Todo deleteMany
	 */
	export type TodoDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Todos to delete
		 */
		where?: TodoWhereInput;
		/**
		 * Limit how many Todos to delete.
		 */
		limit?: number;
	};

	/**
	 * Todo without action
	 */
	export type TodoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the Todo
			 */
			select?: TodoSelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the Todo
			 */
			omit?: TodoOmit<ExtArgs> | null;
		};

	/**
	 * Model User
	 */

	export type AggregateUser = {
		_count: UserCountAggregateOutputType | null;
		_min: UserMinAggregateOutputType | null;
		_max: UserMaxAggregateOutputType | null;
	};

	export type UserMinAggregateOutputType = {
		id: string | null;
		email: string | null;
		name: string | null;
		image: string | null;
		role: $Enums.User_role | null;
		createdAt: Date | null;
		updatedAt: Date | null;
		employeeId: string | null;
	};

	export type UserMaxAggregateOutputType = {
		id: string | null;
		email: string | null;
		name: string | null;
		image: string | null;
		role: $Enums.User_role | null;
		createdAt: Date | null;
		updatedAt: Date | null;
		employeeId: string | null;
	};

	export type UserCountAggregateOutputType = {
		id: number;
		email: number;
		name: number;
		image: number;
		role: number;
		createdAt: number;
		updatedAt: number;
		employeeId: number;
		_all: number;
	};

	export type UserMinAggregateInputType = {
		id?: true;
		email?: true;
		name?: true;
		image?: true;
		role?: true;
		createdAt?: true;
		updatedAt?: true;
		employeeId?: true;
	};

	export type UserMaxAggregateInputType = {
		id?: true;
		email?: true;
		name?: true;
		image?: true;
		role?: true;
		createdAt?: true;
		updatedAt?: true;
		employeeId?: true;
	};

	export type UserCountAggregateInputType = {
		id?: true;
		email?: true;
		name?: true;
		image?: true;
		role?: true;
		createdAt?: true;
		updatedAt?: true;
		employeeId?: true;
		_all?: true;
	};

	export type UserAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which User to aggregate.
		 */
		where?: UserWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Users to fetch.
		 */
		orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: UserWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Users from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Users.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned Users
		 **/
		_count?: true | UserCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: UserMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: UserMaxAggregateInputType;
	};

	export type GetUserAggregateType<T extends UserAggregateArgs> = {
		[P in keyof T & keyof AggregateUser]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateUser[P]>
			: GetScalarType<T[P], AggregateUser[P]>;
	};

	export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			where?: UserWhereInput;
			orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[];
			by: UserScalarFieldEnum[] | UserScalarFieldEnum;
			having?: UserScalarWhereWithAggregatesInput;
			take?: number;
			skip?: number;
			_count?: UserCountAggregateInputType | true;
			_min?: UserMinAggregateInputType;
			_max?: UserMaxAggregateInputType;
		};

	export type UserGroupByOutputType = {
		id: string;
		email: string;
		name: string | null;
		image: string | null;
		role: $Enums.User_role;
		createdAt: Date;
		updatedAt: Date;
		employeeId: string | null;
		_count: UserCountAggregateOutputType | null;
		_min: UserMinAggregateOutputType | null;
		_max: UserMaxAggregateOutputType | null;
	};

	type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<UserGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof UserGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], UserGroupByOutputType[P]>
					: GetScalarType<T[P], UserGroupByOutputType[P]>;
			}
		>
	>;

	export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetSelect<
			{
				id?: boolean;
				email?: boolean;
				name?: boolean;
				image?: boolean;
				role?: boolean;
				createdAt?: boolean;
				updatedAt?: boolean;
				employeeId?: boolean;
				OAuthAccount?: boolean | User$OAuthAccountArgs<ExtArgs>;
				Session?: boolean | User$SessionArgs<ExtArgs>;
				Employee?: boolean | User$EmployeeArgs<ExtArgs>;
				ApiKey?: boolean | User$ApiKeyArgs<ExtArgs>;
				_count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
			},
			ExtArgs["result"]["user"]
		>;

	export type UserSelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			email?: boolean;
			name?: boolean;
			image?: boolean;
			role?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			employeeId?: boolean;
			Employee?: boolean | User$EmployeeArgs<ExtArgs>;
		},
		ExtArgs["result"]["user"]
	>;

	export type UserSelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			email?: boolean;
			name?: boolean;
			image?: boolean;
			role?: boolean;
			createdAt?: boolean;
			updatedAt?: boolean;
			employeeId?: boolean;
			Employee?: boolean | User$EmployeeArgs<ExtArgs>;
		},
		ExtArgs["result"]["user"]
	>;

	export type UserSelectScalar = {
		id?: boolean;
		email?: boolean;
		name?: boolean;
		image?: boolean;
		role?: boolean;
		createdAt?: boolean;
		updatedAt?: boolean;
		employeeId?: boolean;
	};

	export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<
			"id" | "email" | "name" | "image" | "role" | "createdAt" | "updatedAt" | "employeeId",
			ExtArgs["result"]["user"]
		>;
	export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		OAuthAccount?: boolean | User$OAuthAccountArgs<ExtArgs>;
		Session?: boolean | User$SessionArgs<ExtArgs>;
		Employee?: boolean | User$EmployeeArgs<ExtArgs>;
		ApiKey?: boolean | User$ApiKeyArgs<ExtArgs>;
		_count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
	};
	export type UserIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | User$EmployeeArgs<ExtArgs>;
	};
	export type UserIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		Employee?: boolean | User$EmployeeArgs<ExtArgs>;
	};

	export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		name: "User";
		objects: {
			OAuthAccount: Prisma.$OAuthAccountPayload<ExtArgs>[];
			Session: Prisma.$SessionPayload<ExtArgs>[];
			Employee: Prisma.$EmployeePayload<ExtArgs> | null;
			ApiKey: Prisma.$ApiKeyPayload<ExtArgs>[];
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				email: string;
				name: string | null;
				image: string | null;
				role: $Enums.User_role;
				createdAt: Date;
				updatedAt: Date;
				employeeId: string | null;
			},
			ExtArgs["result"]["user"]
		>;
		composites: {};
	};

	type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<
		Prisma.$UserPayload,
		S
	>;

	type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		UserFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: UserCountAggregateInputType | true;
	};

	export interface UserDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["User"]; meta: { name: "User" } };
		/**
		 * Find zero or one User that matches the filter.
		 * @param {UserFindUniqueArgs} args - Arguments to find a User
		 * @example
		 * // Get one User
		 * const user = await prisma.user.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends UserFindUniqueArgs>(
			args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one User that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
		 * @example
		 * // Get one User
		 * const user = await prisma.user.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
			args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first User that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserFindFirstArgs} args - Arguments to find a User
		 * @example
		 * // Get one User
		 * const user = await prisma.user.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends UserFindFirstArgs>(
			args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first User that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
		 * @example
		 * // Get one User
		 * const user = await prisma.user.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
			args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more Users that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all Users
		 * const users = await prisma.user.findMany()
		 *
		 * // Get first 10 Users
		 * const users = await prisma.user.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends UserFindManyArgs>(
			args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a User.
		 * @param {UserCreateArgs} args - Arguments to create a User.
		 * @example
		 * // Create one User
		 * const User = await prisma.user.create({
		 *   data: {
		 *     // ... data to create a User
		 *   }
		 * })
		 *
		 */
		create<T extends UserCreateArgs>(
			args: SelectSubset<T, UserCreateArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many Users.
		 * @param {UserCreateManyArgs} args - Arguments to create many Users.
		 * @example
		 * // Create many Users
		 * const user = await prisma.user.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends UserCreateManyArgs>(
			args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many Users and returns the data saved in the database.
		 * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
		 * @example
		 * // Create many Users
		 * const user = await prisma.user.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many Users and only return the `id`
		 * const userWithIdOnly = await prisma.user.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
			args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>
		>;

		/**
		 * Delete a User.
		 * @param {UserDeleteArgs} args - Arguments to delete one User.
		 * @example
		 * // Delete one User
		 * const User = await prisma.user.delete({
		 *   where: {
		 *     // ... filter to delete one User
		 *   }
		 * })
		 *
		 */
		delete<T extends UserDeleteArgs>(
			args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one User.
		 * @param {UserUpdateArgs} args - Arguments to update one User.
		 * @example
		 * // Update one User
		 * const user = await prisma.user.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends UserUpdateArgs>(
			args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more Users.
		 * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
		 * @example
		 * // Delete a few Users
		 * const { count } = await prisma.user.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends UserDeleteManyArgs>(
			args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Users.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many Users
		 * const user = await prisma.user.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends UserUpdateManyArgs>(
			args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more Users and returns the data updated in the database.
		 * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
		 * @example
		 * // Update many Users
		 * const user = await prisma.user.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more Users and only return the `id`
		 * const userWithIdOnly = await prisma.user.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
			args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>
		>;

		/**
		 * Create or update one User.
		 * @param {UserUpsertArgs} args - Arguments to update or create a User.
		 * @example
		 * // Update or create a User
		 * const user = await prisma.user.upsert({
		 *   create: {
		 *     // ... data to create a User
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the User we want to update
		 *   }
		 * })
		 */
		upsert<T extends UserUpsertArgs>(
			args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
		): Prisma__UserClient<
			$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of Users.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserCountArgs} args - Arguments to filter Users to count.
		 * @example
		 * // Count the number of Users
		 * const count = await prisma.user.count({
		 *   where: {
		 *     // ... the filter for the Users we want to count
		 *   }
		 * })
		 **/
		count<T extends UserCountArgs>(
			args?: Subset<T, UserCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], UserCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a User.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends UserAggregateArgs>(
			args: Subset<T, UserAggregateArgs>
		): Prisma.PrismaPromise<GetUserAggregateType<T>>;

		/**
		 * Group by User.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {UserGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends UserGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: UserGroupByArgs["orderBy"] }
				: { orderBy?: UserGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the User model
		 */
		readonly fields: UserFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for User.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__UserClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		OAuthAccount<T extends User$OAuthAccountArgs<ExtArgs> = {}>(
			args?: Subset<T, User$OAuthAccountArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			| $Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
			| Null
		>;
		Session<T extends User$SessionArgs<ExtArgs> = {}>(
			args?: Subset<T, User$SessionArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
		>;
		Employee<T extends User$EmployeeArgs<ExtArgs> = {}>(
			args?: Subset<T, User$EmployeeArgs<ExtArgs>>
		): Prisma__EmployeeClient<
			$Result.GetResult<
				Prisma.$EmployeePayload<ExtArgs>,
				T,
				"findUniqueOrThrow",
				GlobalOmitOptions
			> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;
		ApiKey<T extends User$ApiKeyArgs<ExtArgs> = {}>(
			args?: Subset<T, User$ApiKeyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the User model
	 */
	interface UserFieldRefs {
		readonly id: FieldRef<"User", "String">;
		readonly email: FieldRef<"User", "String">;
		readonly name: FieldRef<"User", "String">;
		readonly image: FieldRef<"User", "String">;
		readonly role: FieldRef<"User", "User_role">;
		readonly createdAt: FieldRef<"User", "DateTime">;
		readonly updatedAt: FieldRef<"User", "DateTime">;
		readonly employeeId: FieldRef<"User", "String">;
	}

	// Custom InputTypes
	/**
	 * User findUnique
	 */
	export type UserFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which User to fetch.
		 */
		where: UserWhereUniqueInput;
	};

	/**
	 * User findUniqueOrThrow
	 */
	export type UserFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which User to fetch.
		 */
		where: UserWhereUniqueInput;
	};

	/**
	 * User findFirst
	 */
	export type UserFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which User to fetch.
		 */
		where?: UserWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Users to fetch.
		 */
		orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Users.
		 */
		cursor?: UserWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Users from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Users.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Users.
		 */
		distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
	};

	/**
	 * User findFirstOrThrow
	 */
	export type UserFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter, which User to fetch.
		 */
		where?: UserWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of Users to fetch.
		 */
		orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for Users.
		 */
		cursor?: UserWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` Users from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` Users.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of Users.
		 */
		distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
	};

	/**
	 * User findMany
	 */
	export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the User
			 */
			select?: UserSelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the User
			 */
			omit?: UserOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: UserInclude<ExtArgs> | null;
			/**
			 * Filter, which Users to fetch.
			 */
			where?: UserWhereInput;
			/**
			 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
			 *
			 * Determine the order of Users to fetch.
			 */
			orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
			/**
			 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
			 *
			 * Sets the position for listing Users.
			 */
			cursor?: UserWhereUniqueInput;
			/**
			 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
			 *
			 * Take `±n` Users from the position of the cursor.
			 */
			take?: number;
			/**
			 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
			 *
			 * Skip the first `n` Users.
			 */
			skip?: number;
			distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
		};

	/**
	 * User create
	 */
	export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * The data needed to create a User.
		 */
		data: XOR<UserCreateInput, UserUncheckedCreateInput>;
	};

	/**
	 * User createMany
	 */
	export type UserCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many Users.
		 */
		data: UserCreateManyInput | UserCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * User createManyAndReturn
	 */
	export type UserCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * The data used to create many Users.
		 */
		data: UserCreateManyInput | UserCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * User update
	 */
	export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * The data needed to update a User.
		 */
		data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
		/**
		 * Choose, which User to update.
		 */
		where: UserWhereUniqueInput;
	};

	/**
	 * User updateMany
	 */
	export type UserUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update Users.
		 */
		data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
		/**
		 * Filter which Users to update
		 */
		where?: UserWhereInput;
		/**
		 * Limit how many Users to update.
		 */
		limit?: number;
	};

	/**
	 * User updateManyAndReturn
	 */
	export type UserUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * The data used to update Users.
		 */
		data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
		/**
		 * Filter which Users to update
		 */
		where?: UserWhereInput;
		/**
		 * Limit how many Users to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * User upsert
	 */
	export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * The filter to search for the User to update in case it exists.
		 */
		where: UserWhereUniqueInput;
		/**
		 * In case the User found by the `where` argument doesn't exist, create a new User with this data.
		 */
		create: XOR<UserCreateInput, UserUncheckedCreateInput>;
		/**
		 * In case the User was found with the provided `where` argument, update it with this data.
		 */
		update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
	};

	/**
	 * User delete
	 */
	export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		/**
		 * Select specific fields to fetch from the User
		 */
		select?: UserSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the User
		 */
		omit?: UserOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: UserInclude<ExtArgs> | null;
		/**
		 * Filter which User to delete.
		 */
		where: UserWhereUniqueInput;
	};

	/**
	 * User deleteMany
	 */
	export type UserDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which Users to delete
		 */
		where?: UserWhereInput;
		/**
		 * Limit how many Users to delete.
		 */
		limit?: number;
	};

	/**
	 * User.OAuthAccount
	 */
	export type User$OAuthAccountArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the OAuthAccount
		 */
		select?: OAuthAccountSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the OAuthAccount
		 */
		omit?: OAuthAccountOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: OAuthAccountInclude<ExtArgs> | null;
		where?: OAuthAccountWhereInput;
		orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[];
		cursor?: OAuthAccountWhereUniqueInput;
		take?: number;
		skip?: number;
		distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[];
	};

	/**
	 * User.Session
	 */
	export type User$SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the Session
			 */
			select?: SessionSelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the Session
			 */
			omit?: SessionOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: SessionInclude<ExtArgs> | null;
			where?: SessionWhereInput;
			orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
			cursor?: SessionWhereUniqueInput;
			take?: number;
			skip?: number;
			distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
		};

	/**
	 * User.Employee
	 */
	export type User$EmployeeArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the Employee
		 */
		select?: EmployeeSelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the Employee
		 */
		omit?: EmployeeOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: EmployeeInclude<ExtArgs> | null;
		where?: EmployeeWhereInput;
	};

	/**
	 * User.ApiKey
	 */
	export type User$ApiKeyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the ApiKey
			 */
			select?: ApiKeySelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the ApiKey
			 */
			omit?: ApiKeyOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: ApiKeyInclude<ExtArgs> | null;
			where?: ApiKeyWhereInput;
			orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[];
			cursor?: ApiKeyWhereUniqueInput;
			take?: number;
			skip?: number;
			distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[];
		};

	/**
	 * User without action
	 */
	export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the User
			 */
			select?: UserSelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the User
			 */
			omit?: UserOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: UserInclude<ExtArgs> | null;
		};

	/**
	 * Model ApiKey
	 */

	export type AggregateApiKey = {
		_count: ApiKeyCountAggregateOutputType | null;
		_min: ApiKeyMinAggregateOutputType | null;
		_max: ApiKeyMaxAggregateOutputType | null;
	};

	export type ApiKeyMinAggregateOutputType = {
		id: string | null;
		name: string | null;
		key: string | null;
		userId: string | null;
		createdAt: Date | null;
		expiresAt: Date | null;
		lastUsedAt: Date | null;
	};

	export type ApiKeyMaxAggregateOutputType = {
		id: string | null;
		name: string | null;
		key: string | null;
		userId: string | null;
		createdAt: Date | null;
		expiresAt: Date | null;
		lastUsedAt: Date | null;
	};

	export type ApiKeyCountAggregateOutputType = {
		id: number;
		name: number;
		key: number;
		userId: number;
		createdAt: number;
		expiresAt: number;
		lastUsedAt: number;
		_all: number;
	};

	export type ApiKeyMinAggregateInputType = {
		id?: true;
		name?: true;
		key?: true;
		userId?: true;
		createdAt?: true;
		expiresAt?: true;
		lastUsedAt?: true;
	};

	export type ApiKeyMaxAggregateInputType = {
		id?: true;
		name?: true;
		key?: true;
		userId?: true;
		createdAt?: true;
		expiresAt?: true;
		lastUsedAt?: true;
	};

	export type ApiKeyCountAggregateInputType = {
		id?: true;
		name?: true;
		key?: true;
		userId?: true;
		createdAt?: true;
		expiresAt?: true;
		lastUsedAt?: true;
		_all?: true;
	};

	export type ApiKeyAggregateArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which ApiKey to aggregate.
		 */
		where?: ApiKeyWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ApiKeys to fetch.
		 */
		orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the start position
		 */
		cursor?: ApiKeyWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ApiKeys from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ApiKeys.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Count returned ApiKeys
		 **/
		_count?: true | ApiKeyCountAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the minimum value
		 **/
		_min?: ApiKeyMinAggregateInputType;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
		 *
		 * Select which fields to find the maximum value
		 **/
		_max?: ApiKeyMaxAggregateInputType;
	};

	export type GetApiKeyAggregateType<T extends ApiKeyAggregateArgs> = {
		[P in keyof T & keyof AggregateApiKey]: P extends "_count" | "count"
			? T[P] extends true
				? number
				: GetScalarType<T[P], AggregateApiKey[P]>
			: GetScalarType<T[P], AggregateApiKey[P]>;
	};

	export type ApiKeyGroupByArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		where?: ApiKeyWhereInput;
		orderBy?: ApiKeyOrderByWithAggregationInput | ApiKeyOrderByWithAggregationInput[];
		by: ApiKeyScalarFieldEnum[] | ApiKeyScalarFieldEnum;
		having?: ApiKeyScalarWhereWithAggregatesInput;
		take?: number;
		skip?: number;
		_count?: ApiKeyCountAggregateInputType | true;
		_min?: ApiKeyMinAggregateInputType;
		_max?: ApiKeyMaxAggregateInputType;
	};

	export type ApiKeyGroupByOutputType = {
		id: string;
		name: string;
		key: string;
		userId: string;
		createdAt: Date;
		expiresAt: Date | null;
		lastUsedAt: Date | null;
		_count: ApiKeyCountAggregateOutputType | null;
		_min: ApiKeyMinAggregateOutputType | null;
		_max: ApiKeyMaxAggregateOutputType | null;
	};

	type GetApiKeyGroupByPayload<T extends ApiKeyGroupByArgs> = Prisma.PrismaPromise<
		Array<
			PickEnumerable<ApiKeyGroupByOutputType, T["by"]> & {
				[P in keyof T & keyof ApiKeyGroupByOutputType]: P extends "_count"
					? T[P] extends boolean
						? number
						: GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
					: GetScalarType<T[P], ApiKeyGroupByOutputType[P]>;
			}
		>
	>;

	export type ApiKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetSelect<
			{
				id?: boolean;
				name?: boolean;
				key?: boolean;
				userId?: boolean;
				createdAt?: boolean;
				expiresAt?: boolean;
				lastUsedAt?: boolean;
				User?: boolean | UserDefaultArgs<ExtArgs>;
			},
			ExtArgs["result"]["apiKey"]
		>;

	export type ApiKeySelectCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			name?: boolean;
			key?: boolean;
			userId?: boolean;
			createdAt?: boolean;
			expiresAt?: boolean;
			lastUsedAt?: boolean;
			User?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["apiKey"]
	>;

	export type ApiKeySelectUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = $Extensions.GetSelect<
		{
			id?: boolean;
			name?: boolean;
			key?: boolean;
			userId?: boolean;
			createdAt?: boolean;
			expiresAt?: boolean;
			lastUsedAt?: boolean;
			User?: boolean | UserDefaultArgs<ExtArgs>;
		},
		ExtArgs["result"]["apiKey"]
	>;

	export type ApiKeySelectScalar = {
		id?: boolean;
		name?: boolean;
		key?: boolean;
		userId?: boolean;
		createdAt?: boolean;
		expiresAt?: boolean;
		lastUsedAt?: boolean;
	};

	export type ApiKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		$Extensions.GetOmit<
			"id" | "name" | "key" | "userId" | "createdAt" | "expiresAt" | "lastUsedAt",
			ExtArgs["result"]["apiKey"]
		>;
	export type ApiKeyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};
	export type ApiKeyIncludeCreateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};
	export type ApiKeyIncludeUpdateManyAndReturn<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		User?: boolean | UserDefaultArgs<ExtArgs>;
	};

	export type $ApiKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
		name: "ApiKey";
		objects: {
			User: Prisma.$UserPayload<ExtArgs>;
		};
		scalars: $Extensions.GetPayloadResult<
			{
				id: string;
				name: string;
				key: string;
				userId: string;
				createdAt: Date;
				expiresAt: Date | null;
				lastUsedAt: Date | null;
			},
			ExtArgs["result"]["apiKey"]
		>;
		composites: {};
	};

	type ApiKeyGetPayload<S extends boolean | null | undefined | ApiKeyDefaultArgs> =
		$Result.GetResult<Prisma.$ApiKeyPayload, S>;

	type ApiKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
		ApiKeyFindManyArgs,
		"select" | "include" | "distinct" | "omit"
	> & {
		select?: ApiKeyCountAggregateInputType | true;
	};

	export interface ApiKeyDelegate<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> {
		[K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["ApiKey"]; meta: { name: "ApiKey" } };
		/**
		 * Find zero or one ApiKey that matches the filter.
		 * @param {ApiKeyFindUniqueArgs} args - Arguments to find a ApiKey
		 * @example
		 * // Get one ApiKey
		 * const apiKey = await prisma.apiKey.findUnique({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUnique<T extends ApiKeyFindUniqueArgs>(
			args: SelectSubset<T, ApiKeyFindUniqueArgs<ExtArgs>>
		): Prisma__ApiKeyClient<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find one ApiKey that matches the filter or throw an error with `error.code='P2025'`
		 * if no matches were found.
		 * @param {ApiKeyFindUniqueOrThrowArgs} args - Arguments to find a ApiKey
		 * @example
		 * // Get one ApiKey
		 * const apiKey = await prisma.apiKey.findUniqueOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findUniqueOrThrow<T extends ApiKeyFindUniqueOrThrowArgs>(
			args: SelectSubset<T, ApiKeyFindUniqueOrThrowArgs<ExtArgs>>
		): Prisma__ApiKeyClient<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first ApiKey that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ApiKeyFindFirstArgs} args - Arguments to find a ApiKey
		 * @example
		 * // Get one ApiKey
		 * const apiKey = await prisma.apiKey.findFirst({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirst<T extends ApiKeyFindFirstArgs>(
			args?: SelectSubset<T, ApiKeyFindFirstArgs<ExtArgs>>
		): Prisma__ApiKeyClient<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
			null,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find the first ApiKey that matches the filter or
		 * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ApiKeyFindFirstOrThrowArgs} args - Arguments to find a ApiKey
		 * @example
		 * // Get one ApiKey
		 * const apiKey = await prisma.apiKey.findFirstOrThrow({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 */
		findFirstOrThrow<T extends ApiKeyFindFirstOrThrowArgs>(
			args?: SelectSubset<T, ApiKeyFindFirstOrThrowArgs<ExtArgs>>
		): Prisma__ApiKeyClient<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Find zero or more ApiKeys that matches the filter.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ApiKeyFindManyArgs} args - Arguments to filter and select certain fields only.
		 * @example
		 * // Get all ApiKeys
		 * const apiKeys = await prisma.apiKey.findMany()
		 *
		 * // Get first 10 ApiKeys
		 * const apiKeys = await prisma.apiKey.findMany({ take: 10 })
		 *
		 * // Only select the `id`
		 * const apiKeyWithIdOnly = await prisma.apiKey.findMany({ select: { id: true } })
		 *
		 */
		findMany<T extends ApiKeyFindManyArgs>(
			args?: SelectSubset<T, ApiKeyFindManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
		>;

		/**
		 * Create a ApiKey.
		 * @param {ApiKeyCreateArgs} args - Arguments to create a ApiKey.
		 * @example
		 * // Create one ApiKey
		 * const ApiKey = await prisma.apiKey.create({
		 *   data: {
		 *     // ... data to create a ApiKey
		 *   }
		 * })
		 *
		 */
		create<T extends ApiKeyCreateArgs>(
			args: SelectSubset<T, ApiKeyCreateArgs<ExtArgs>>
		): Prisma__ApiKeyClient<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Create many ApiKeys.
		 * @param {ApiKeyCreateManyArgs} args - Arguments to create many ApiKeys.
		 * @example
		 * // Create many ApiKeys
		 * const apiKey = await prisma.apiKey.createMany({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 */
		createMany<T extends ApiKeyCreateManyArgs>(
			args?: SelectSubset<T, ApiKeyCreateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Create many ApiKeys and returns the data saved in the database.
		 * @param {ApiKeyCreateManyAndReturnArgs} args - Arguments to create many ApiKeys.
		 * @example
		 * // Create many ApiKeys
		 * const apiKey = await prisma.apiKey.createManyAndReturn({
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Create many ApiKeys and only return the `id`
		 * const apiKeyWithIdOnly = await prisma.apiKey.createManyAndReturn({
		 *   select: { id: true },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		createManyAndReturn<T extends ApiKeyCreateManyAndReturnArgs>(
			args?: SelectSubset<T, ApiKeyCreateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>
		>;

		/**
		 * Delete a ApiKey.
		 * @param {ApiKeyDeleteArgs} args - Arguments to delete one ApiKey.
		 * @example
		 * // Delete one ApiKey
		 * const ApiKey = await prisma.apiKey.delete({
		 *   where: {
		 *     // ... filter to delete one ApiKey
		 *   }
		 * })
		 *
		 */
		delete<T extends ApiKeyDeleteArgs>(
			args: SelectSubset<T, ApiKeyDeleteArgs<ExtArgs>>
		): Prisma__ApiKeyClient<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Update one ApiKey.
		 * @param {ApiKeyUpdateArgs} args - Arguments to update one ApiKey.
		 * @example
		 * // Update one ApiKey
		 * const apiKey = await prisma.apiKey.update({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		update<T extends ApiKeyUpdateArgs>(
			args: SelectSubset<T, ApiKeyUpdateArgs<ExtArgs>>
		): Prisma__ApiKeyClient<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Delete zero or more ApiKeys.
		 * @param {ApiKeyDeleteManyArgs} args - Arguments to filter ApiKeys to delete.
		 * @example
		 * // Delete a few ApiKeys
		 * const { count } = await prisma.apiKey.deleteMany({
		 *   where: {
		 *     // ... provide filter here
		 *   }
		 * })
		 *
		 */
		deleteMany<T extends ApiKeyDeleteManyArgs>(
			args?: SelectSubset<T, ApiKeyDeleteManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more ApiKeys.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ApiKeyUpdateManyArgs} args - Arguments to update one or more rows.
		 * @example
		 * // Update many ApiKeys
		 * const apiKey = await prisma.apiKey.updateMany({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: {
		 *     // ... provide data here
		 *   }
		 * })
		 *
		 */
		updateMany<T extends ApiKeyUpdateManyArgs>(
			args: SelectSubset<T, ApiKeyUpdateManyArgs<ExtArgs>>
		): Prisma.PrismaPromise<BatchPayload>;

		/**
		 * Update zero or more ApiKeys and returns the data updated in the database.
		 * @param {ApiKeyUpdateManyAndReturnArgs} args - Arguments to update many ApiKeys.
		 * @example
		 * // Update many ApiKeys
		 * const apiKey = await prisma.apiKey.updateManyAndReturn({
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 *
		 * // Update zero or more ApiKeys and only return the `id`
		 * const apiKeyWithIdOnly = await prisma.apiKey.updateManyAndReturn({
		 *   select: { id: true },
		 *   where: {
		 *     // ... provide filter here
		 *   },
		 *   data: [
		 *     // ... provide data here
		 *   ]
		 * })
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 *
		 */
		updateManyAndReturn<T extends ApiKeyUpdateManyAndReturnArgs>(
			args: SelectSubset<T, ApiKeyUpdateManyAndReturnArgs<ExtArgs>>
		): Prisma.PrismaPromise<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>
		>;

		/**
		 * Create or update one ApiKey.
		 * @param {ApiKeyUpsertArgs} args - Arguments to update or create a ApiKey.
		 * @example
		 * // Update or create a ApiKey
		 * const apiKey = await prisma.apiKey.upsert({
		 *   create: {
		 *     // ... data to create a ApiKey
		 *   },
		 *   update: {
		 *     // ... in case it already exists, update
		 *   },
		 *   where: {
		 *     // ... the filter for the ApiKey we want to update
		 *   }
		 * })
		 */
		upsert<T extends ApiKeyUpsertArgs>(
			args: SelectSubset<T, ApiKeyUpsertArgs<ExtArgs>>
		): Prisma__ApiKeyClient<
			$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
			never,
			ExtArgs,
			GlobalOmitOptions
		>;

		/**
		 * Count the number of ApiKeys.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ApiKeyCountArgs} args - Arguments to filter ApiKeys to count.
		 * @example
		 * // Count the number of ApiKeys
		 * const count = await prisma.apiKey.count({
		 *   where: {
		 *     // ... the filter for the ApiKeys we want to count
		 *   }
		 * })
		 **/
		count<T extends ApiKeyCountArgs>(
			args?: Subset<T, ApiKeyCountArgs>
		): Prisma.PrismaPromise<
			T extends $Utils.Record<"select", any>
				? T["select"] extends true
					? number
					: GetScalarType<T["select"], ApiKeyCountAggregateOutputType>
				: number
		>;

		/**
		 * Allows you to perform aggregations operations on a ApiKey.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ApiKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
		 * @example
		 * // Ordered by age ascending
		 * // Where email contains prisma.io
		 * // Limited to the 10 users
		 * const aggregations = await prisma.user.aggregate({
		 *   _avg: {
		 *     age: true,
		 *   },
		 *   where: {
		 *     email: {
		 *       contains: "prisma.io",
		 *     },
		 *   },
		 *   orderBy: {
		 *     age: "asc",
		 *   },
		 *   take: 10,
		 * })
		 **/
		aggregate<T extends ApiKeyAggregateArgs>(
			args: Subset<T, ApiKeyAggregateArgs>
		): Prisma.PrismaPromise<GetApiKeyAggregateType<T>>;

		/**
		 * Group by ApiKey.
		 * Note, that providing `undefined` is treated as the value not being there.
		 * Read more here: https://pris.ly/d/null-undefined
		 * @param {ApiKeyGroupByArgs} args - Group by arguments.
		 * @example
		 * // Group by city, order by createdAt, get count
		 * const result = await prisma.user.groupBy({
		 *   by: ['city', 'createdAt'],
		 *   orderBy: {
		 *     createdAt: true
		 *   },
		 *   _count: {
		 *     _all: true
		 *   },
		 * })
		 *
		 **/
		groupBy<
			T extends ApiKeyGroupByArgs,
			HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
			OrderByArg extends True extends HasSelectOrTake
				? { orderBy: ApiKeyGroupByArgs["orderBy"] }
				: { orderBy?: ApiKeyGroupByArgs["orderBy"] },
			OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
			ByFields extends MaybeTupleToUnion<T["by"]>,
			ByValid extends Has<ByFields, OrderFields>,
			HavingFields extends GetHavingFields<T["having"]>,
			HavingValid extends Has<ByFields, HavingFields>,
			ByEmpty extends T["by"] extends never[] ? True : False,
			InputErrors extends ByEmpty extends True
				? `Error: "by" must not be empty.`
				: HavingValid extends False
					? {
							[P in HavingFields]: P extends ByFields
								? never
								: P extends string
									? `Error: Field "${P}" used in "having" needs to be provided in "by".`
									: [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
						}[HavingFields]
					: "take" extends Keys<T>
						? "orderBy" extends Keys<T>
							? ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields]
							: 'Error: If you provide "take", you also need to provide "orderBy"'
						: "skip" extends Keys<T>
							? "orderBy" extends Keys<T>
								? ByValid extends True
									? {}
									: {
											[P in OrderFields]: P extends ByFields
												? never
												: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
										}[OrderFields]
								: 'Error: If you provide "skip", you also need to provide "orderBy"'
							: ByValid extends True
								? {}
								: {
										[P in OrderFields]: P extends ByFields
											? never
											: `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
									}[OrderFields],
		>(
			args: SubsetIntersection<T, ApiKeyGroupByArgs, OrderByArg> & InputErrors
		): {} extends InputErrors ? GetApiKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
		/**
		 * Fields of the ApiKey model
		 */
		readonly fields: ApiKeyFieldRefs;
	}

	/**
	 * The delegate class that acts as a "Promise-like" for ApiKey.
	 * Why is this prefixed with `Prisma__`?
	 * Because we want to prevent naming conflicts as mentioned in
	 * https://github.com/prisma/prisma-client-js/issues/707
	 */
	export interface Prisma__ApiKeyClient<
		T,
		Null = never,
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
		GlobalOmitOptions = {},
	> extends Prisma.PrismaPromise<T> {
		readonly [Symbol.toStringTag]: "PrismaPromise";
		User<T extends UserDefaultArgs<ExtArgs> = {}>(
			args?: Subset<T, UserDefaultArgs<ExtArgs>>
		): Prisma__UserClient<
			| $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
			| Null,
			Null,
			ExtArgs,
			GlobalOmitOptions
		>;
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): $Utils.JsPromise<TResult1 | TResult2>;
		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch<TResult = never>(
			onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
		): $Utils.JsPromise<T | TResult>;
		/**
		 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
		 * resolved value cannot be modified from the callback.
		 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
		 * @returns A Promise for the completion of the callback.
		 */
		finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
	}

	/**
	 * Fields of the ApiKey model
	 */
	interface ApiKeyFieldRefs {
		readonly id: FieldRef<"ApiKey", "String">;
		readonly name: FieldRef<"ApiKey", "String">;
		readonly key: FieldRef<"ApiKey", "String">;
		readonly userId: FieldRef<"ApiKey", "String">;
		readonly createdAt: FieldRef<"ApiKey", "DateTime">;
		readonly expiresAt: FieldRef<"ApiKey", "DateTime">;
		readonly lastUsedAt: FieldRef<"ApiKey", "DateTime">;
	}

	// Custom InputTypes
	/**
	 * ApiKey findUnique
	 */
	export type ApiKeyFindUniqueArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ApiKey
		 */
		select?: ApiKeySelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ApiKey
		 */
		omit?: ApiKeyOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ApiKeyInclude<ExtArgs> | null;
		/**
		 * Filter, which ApiKey to fetch.
		 */
		where: ApiKeyWhereUniqueInput;
	};

	/**
	 * ApiKey findUniqueOrThrow
	 */
	export type ApiKeyFindUniqueOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ApiKey
		 */
		select?: ApiKeySelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ApiKey
		 */
		omit?: ApiKeyOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ApiKeyInclude<ExtArgs> | null;
		/**
		 * Filter, which ApiKey to fetch.
		 */
		where: ApiKeyWhereUniqueInput;
	};

	/**
	 * ApiKey findFirst
	 */
	export type ApiKeyFindFirstArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ApiKey
		 */
		select?: ApiKeySelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ApiKey
		 */
		omit?: ApiKeyOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ApiKeyInclude<ExtArgs> | null;
		/**
		 * Filter, which ApiKey to fetch.
		 */
		where?: ApiKeyWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ApiKeys to fetch.
		 */
		orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for ApiKeys.
		 */
		cursor?: ApiKeyWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ApiKeys from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ApiKeys.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ApiKeys.
		 */
		distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[];
	};

	/**
	 * ApiKey findFirstOrThrow
	 */
	export type ApiKeyFindFirstOrThrowArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ApiKey
		 */
		select?: ApiKeySelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ApiKey
		 */
		omit?: ApiKeyOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ApiKeyInclude<ExtArgs> | null;
		/**
		 * Filter, which ApiKey to fetch.
		 */
		where?: ApiKeyWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ApiKeys to fetch.
		 */
		orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for searching for ApiKeys.
		 */
		cursor?: ApiKeyWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ApiKeys from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ApiKeys.
		 */
		skip?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
		 *
		 * Filter by unique combinations of ApiKeys.
		 */
		distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[];
	};

	/**
	 * ApiKey findMany
	 */
	export type ApiKeyFindManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ApiKey
		 */
		select?: ApiKeySelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ApiKey
		 */
		omit?: ApiKeyOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ApiKeyInclude<ExtArgs> | null;
		/**
		 * Filter, which ApiKeys to fetch.
		 */
		where?: ApiKeyWhereInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
		 *
		 * Determine the order of ApiKeys to fetch.
		 */
		orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[];
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
		 *
		 * Sets the position for listing ApiKeys.
		 */
		cursor?: ApiKeyWhereUniqueInput;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Take `±n` ApiKeys from the position of the cursor.
		 */
		take?: number;
		/**
		 * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
		 *
		 * Skip the first `n` ApiKeys.
		 */
		skip?: number;
		distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[];
	};

	/**
	 * ApiKey create
	 */
	export type ApiKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the ApiKey
			 */
			select?: ApiKeySelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the ApiKey
			 */
			omit?: ApiKeyOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: ApiKeyInclude<ExtArgs> | null;
			/**
			 * The data needed to create a ApiKey.
			 */
			data: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>;
		};

	/**
	 * ApiKey createMany
	 */
	export type ApiKeyCreateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to create many ApiKeys.
		 */
		data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[];
		skipDuplicates?: boolean;
	};

	/**
	 * ApiKey createManyAndReturn
	 */
	export type ApiKeyCreateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ApiKey
		 */
		select?: ApiKeySelectCreateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the ApiKey
		 */
		omit?: ApiKeyOmit<ExtArgs> | null;
		/**
		 * The data used to create many ApiKeys.
		 */
		data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[];
		skipDuplicates?: boolean;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ApiKeyIncludeCreateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * ApiKey update
	 */
	export type ApiKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the ApiKey
			 */
			select?: ApiKeySelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the ApiKey
			 */
			omit?: ApiKeyOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: ApiKeyInclude<ExtArgs> | null;
			/**
			 * The data needed to update a ApiKey.
			 */
			data: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>;
			/**
			 * Choose, which ApiKey to update.
			 */
			where: ApiKeyWhereUniqueInput;
		};

	/**
	 * ApiKey updateMany
	 */
	export type ApiKeyUpdateManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * The data used to update ApiKeys.
		 */
		data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>;
		/**
		 * Filter which ApiKeys to update
		 */
		where?: ApiKeyWhereInput;
		/**
		 * Limit how many ApiKeys to update.
		 */
		limit?: number;
	};

	/**
	 * ApiKey updateManyAndReturn
	 */
	export type ApiKeyUpdateManyAndReturnArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ApiKey
		 */
		select?: ApiKeySelectUpdateManyAndReturn<ExtArgs> | null;
		/**
		 * Omit specific fields from the ApiKey
		 */
		omit?: ApiKeyOmit<ExtArgs> | null;
		/**
		 * The data used to update ApiKeys.
		 */
		data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>;
		/**
		 * Filter which ApiKeys to update
		 */
		where?: ApiKeyWhereInput;
		/**
		 * Limit how many ApiKeys to update.
		 */
		limit?: number;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ApiKeyIncludeUpdateManyAndReturn<ExtArgs> | null;
	};

	/**
	 * ApiKey upsert
	 */
	export type ApiKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the ApiKey
			 */
			select?: ApiKeySelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the ApiKey
			 */
			omit?: ApiKeyOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: ApiKeyInclude<ExtArgs> | null;
			/**
			 * The filter to search for the ApiKey to update in case it exists.
			 */
			where: ApiKeyWhereUniqueInput;
			/**
			 * In case the ApiKey found by the `where` argument doesn't exist, create a new ApiKey with this data.
			 */
			create: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>;
			/**
			 * In case the ApiKey was found with the provided `where` argument, update it with this data.
			 */
			update: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>;
		};

	/**
	 * ApiKey delete
	 */
	export type ApiKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
		{
			/**
			 * Select specific fields to fetch from the ApiKey
			 */
			select?: ApiKeySelect<ExtArgs> | null;
			/**
			 * Omit specific fields from the ApiKey
			 */
			omit?: ApiKeyOmit<ExtArgs> | null;
			/**
			 * Choose, which related nodes to fetch as well
			 */
			include?: ApiKeyInclude<ExtArgs> | null;
			/**
			 * Filter which ApiKey to delete.
			 */
			where: ApiKeyWhereUniqueInput;
		};

	/**
	 * ApiKey deleteMany
	 */
	export type ApiKeyDeleteManyArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Filter which ApiKeys to delete
		 */
		where?: ApiKeyWhereInput;
		/**
		 * Limit how many ApiKeys to delete.
		 */
		limit?: number;
	};

	/**
	 * ApiKey without action
	 */
	export type ApiKeyDefaultArgs<
		ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
	> = {
		/**
		 * Select specific fields to fetch from the ApiKey
		 */
		select?: ApiKeySelect<ExtArgs> | null;
		/**
		 * Omit specific fields from the ApiKey
		 */
		omit?: ApiKeyOmit<ExtArgs> | null;
		/**
		 * Choose, which related nodes to fetch as well
		 */
		include?: ApiKeyInclude<ExtArgs> | null;
	};

	/**
	 * Enums
	 */

	export const TransactionIsolationLevel: {
		ReadUncommitted: "ReadUncommitted";
		ReadCommitted: "ReadCommitted";
		RepeatableRead: "RepeatableRead";
		Serializable: "Serializable";
	};

	export type TransactionIsolationLevel =
		(typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

	export const EmployeeScalarFieldEnum: {
		id: "id";
		name: "name";
		email: "email";
		pinHash: "pinHash";
		lastStationId: "lastStationId";
		dailyHoursLimit: "dailyHoursLimit";
		weeklyHoursLimit: "weeklyHoursLimit";
		employeeCode: "employeeCode";
		phoneNumber: "phoneNumber";
		hireDate: "hireDate";
		status: "status";
		defaultStationId: "defaultStationId";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type EmployeeScalarFieldEnum =
		(typeof EmployeeScalarFieldEnum)[keyof typeof EmployeeScalarFieldEnum];

	export const OAuthAccountScalarFieldEnum: {
		provider: "provider";
		providerUserId: "providerUserId";
		userId: "userId";
		accessToken: "accessToken";
		refreshToken: "refreshToken";
		expiresAt: "expiresAt";
		scope: "scope";
		tokenType: "tokenType";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type OAuthAccountScalarFieldEnum =
		(typeof OAuthAccountScalarFieldEnum)[keyof typeof OAuthAccountScalarFieldEnum];

	export const SessionScalarFieldEnum: {
		id: "id";
		userId: "userId";
		expiresAt: "expiresAt";
		createdAt: "createdAt";
	};

	export type SessionScalarFieldEnum =
		(typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];

	export const StationScalarFieldEnum: {
		id: "id";
		name: "name";
		description: "description";
		capacity: "capacity";
		isActive: "isActive";
		zone: "zone";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type StationScalarFieldEnum =
		(typeof StationScalarFieldEnum)[keyof typeof StationScalarFieldEnum];

	export const TimeLogScalarFieldEnum: {
		id: "id";
		employeeId: "employeeId";
		stationId: "stationId";
		type: "type";
		startTime: "startTime";
		endTime: "endTime";
		note: "note";
		deletedAt: "deletedAt";
		correctedBy: "correctedBy";
		taskId: "taskId";
		clockMethod: "clockMethod";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type TimeLogScalarFieldEnum =
		(typeof TimeLogScalarFieldEnum)[keyof typeof TimeLogScalarFieldEnum];

	export const TaskTypeScalarFieldEnum: {
		id: "id";
		name: "name";
		stationId: "stationId";
		description: "description";
		estimatedMinutesPerUnit: "estimatedMinutesPerUnit";
		isActive: "isActive";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type TaskTypeScalarFieldEnum =
		(typeof TaskTypeScalarFieldEnum)[keyof typeof TaskTypeScalarFieldEnum];

	export const TaskAssignmentScalarFieldEnum: {
		id: "id";
		employeeId: "employeeId";
		taskTypeId: "taskTypeId";
		startTime: "startTime";
		endTime: "endTime";
		unitsCompleted: "unitsCompleted";
		notes: "notes";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type TaskAssignmentScalarFieldEnum =
		(typeof TaskAssignmentScalarFieldEnum)[keyof typeof TaskAssignmentScalarFieldEnum];

	export const PerformanceMetricScalarFieldEnum: {
		id: "id";
		employeeId: "employeeId";
		date: "date";
		stationId: "stationId";
		hoursWorked: "hoursWorked";
		unitsProcessed: "unitsProcessed";
		efficiency: "efficiency";
		qualityScore: "qualityScore";
		overtimeHours: "overtimeHours";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type PerformanceMetricScalarFieldEnum =
		(typeof PerformanceMetricScalarFieldEnum)[keyof typeof PerformanceMetricScalarFieldEnum];

	export const TodoScalarFieldEnum: {
		id: "id";
		title: "title";
		completed: "completed";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
	};

	export type TodoScalarFieldEnum = (typeof TodoScalarFieldEnum)[keyof typeof TodoScalarFieldEnum];

	export const UserScalarFieldEnum: {
		id: "id";
		email: "email";
		name: "name";
		image: "image";
		role: "role";
		createdAt: "createdAt";
		updatedAt: "updatedAt";
		employeeId: "employeeId";
	};

	export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

	export const ApiKeyScalarFieldEnum: {
		id: "id";
		name: "name";
		key: "key";
		userId: "userId";
		createdAt: "createdAt";
		expiresAt: "expiresAt";
		lastUsedAt: "lastUsedAt";
	};

	export type ApiKeyScalarFieldEnum =
		(typeof ApiKeyScalarFieldEnum)[keyof typeof ApiKeyScalarFieldEnum];

	export const SortOrder: {
		asc: "asc";
		desc: "desc";
	};

	export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

	export const QueryMode: {
		default: "default";
		insensitive: "insensitive";
	};

	export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

	export const NullsOrder: {
		first: "first";
		last: "last";
	};

	export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

	/**
	 * Field references
	 */

	/**
	 * Reference to a field of type 'String'
	 */
	export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "String">;

	/**
	 * Reference to a field of type 'String[]'
	 */
	export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "String[]">;

	/**
	 * Reference to a field of type 'Float'
	 */
	export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Float">;

	/**
	 * Reference to a field of type 'Float[]'
	 */
	export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Float[]">;

	/**
	 * Reference to a field of type 'DateTime'
	 */
	export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "DateTime">;

	/**
	 * Reference to a field of type 'DateTime[]'
	 */
	export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"DateTime[]"
	>;

	/**
	 * Reference to a field of type 'EmployeeStatus'
	 */
	export type EnumEmployeeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"EmployeeStatus"
	>;

	/**
	 * Reference to a field of type 'EmployeeStatus[]'
	 */
	export type ListEnumEmployeeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"EmployeeStatus[]"
	>;

	/**
	 * Reference to a field of type 'Int'
	 */
	export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Int">;

	/**
	 * Reference to a field of type 'Int[]'
	 */
	export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Int[]">;

	/**
	 * Reference to a field of type 'Boolean'
	 */
	export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Boolean">;

	/**
	 * Reference to a field of type 'TimeLog_type'
	 */
	export type EnumTimeLog_typeFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"TimeLog_type"
	>;

	/**
	 * Reference to a field of type 'TimeLog_type[]'
	 */
	export type ListEnumTimeLog_typeFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"TimeLog_type[]"
	>;

	/**
	 * Reference to a field of type 'ClockMethod'
	 */
	export type EnumClockMethodFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"ClockMethod"
	>;

	/**
	 * Reference to a field of type 'ClockMethod[]'
	 */
	export type ListEnumClockMethodFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"ClockMethod[]"
	>;

	/**
	 * Reference to a field of type 'User_role'
	 */
	export type EnumUser_roleFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"User_role"
	>;

	/**
	 * Reference to a field of type 'User_role[]'
	 */
	export type ListEnumUser_roleFieldRefInput<$PrismaModel> = FieldRefInputType<
		$PrismaModel,
		"User_role[]"
	>;

	/**
	 * Deep Input Types
	 */

	export type EmployeeWhereInput = {
		AND?: EmployeeWhereInput | EmployeeWhereInput[];
		OR?: EmployeeWhereInput[];
		NOT?: EmployeeWhereInput | EmployeeWhereInput[];
		id?: StringFilter<"Employee"> | string;
		name?: StringFilter<"Employee"> | string;
		email?: StringFilter<"Employee"> | string;
		pinHash?: StringNullableFilter<"Employee"> | string | null;
		lastStationId?: StringNullableFilter<"Employee"> | string | null;
		dailyHoursLimit?: FloatNullableFilter<"Employee"> | number | null;
		weeklyHoursLimit?: FloatNullableFilter<"Employee"> | number | null;
		employeeCode?: StringNullableFilter<"Employee"> | string | null;
		phoneNumber?: StringNullableFilter<"Employee"> | string | null;
		hireDate?: DateTimeNullableFilter<"Employee"> | Date | string | null;
		status?: EnumEmployeeStatusFilter<"Employee"> | $Enums.EmployeeStatus;
		defaultStationId?: StringNullableFilter<"Employee"> | string | null;
		createdAt?: DateTimeFilter<"Employee"> | Date | string;
		updatedAt?: DateTimeFilter<"Employee"> | Date | string;
		TimeLog?: TimeLogListRelationFilter;
		User?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null;
		TaskAssignment?: TaskAssignmentListRelationFilter;
		PerformanceMetric?: PerformanceMetricListRelationFilter;
		defaultStation?: XOR<StationNullableScalarRelationFilter, StationWhereInput> | null;
		lastStation?: XOR<StationNullableScalarRelationFilter, StationWhereInput> | null;
	};

	export type EmployeeOrderByWithRelationInput = {
		id?: SortOrder;
		name?: SortOrder;
		email?: SortOrder;
		pinHash?: SortOrderInput | SortOrder;
		lastStationId?: SortOrderInput | SortOrder;
		dailyHoursLimit?: SortOrderInput | SortOrder;
		weeklyHoursLimit?: SortOrderInput | SortOrder;
		employeeCode?: SortOrderInput | SortOrder;
		phoneNumber?: SortOrderInput | SortOrder;
		hireDate?: SortOrderInput | SortOrder;
		status?: SortOrder;
		defaultStationId?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		TimeLog?: TimeLogOrderByRelationAggregateInput;
		User?: UserOrderByWithRelationInput;
		TaskAssignment?: TaskAssignmentOrderByRelationAggregateInput;
		PerformanceMetric?: PerformanceMetricOrderByRelationAggregateInput;
		defaultStation?: StationOrderByWithRelationInput;
		lastStation?: StationOrderByWithRelationInput;
	};

	export type EmployeeWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			email?: string;
			employeeCode?: string;
			AND?: EmployeeWhereInput | EmployeeWhereInput[];
			OR?: EmployeeWhereInput[];
			NOT?: EmployeeWhereInput | EmployeeWhereInput[];
			name?: StringFilter<"Employee"> | string;
			pinHash?: StringNullableFilter<"Employee"> | string | null;
			lastStationId?: StringNullableFilter<"Employee"> | string | null;
			dailyHoursLimit?: FloatNullableFilter<"Employee"> | number | null;
			weeklyHoursLimit?: FloatNullableFilter<"Employee"> | number | null;
			phoneNumber?: StringNullableFilter<"Employee"> | string | null;
			hireDate?: DateTimeNullableFilter<"Employee"> | Date | string | null;
			status?: EnumEmployeeStatusFilter<"Employee"> | $Enums.EmployeeStatus;
			defaultStationId?: StringNullableFilter<"Employee"> | string | null;
			createdAt?: DateTimeFilter<"Employee"> | Date | string;
			updatedAt?: DateTimeFilter<"Employee"> | Date | string;
			TimeLog?: TimeLogListRelationFilter;
			User?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null;
			TaskAssignment?: TaskAssignmentListRelationFilter;
			PerformanceMetric?: PerformanceMetricListRelationFilter;
			defaultStation?: XOR<StationNullableScalarRelationFilter, StationWhereInput> | null;
			lastStation?: XOR<StationNullableScalarRelationFilter, StationWhereInput> | null;
		},
		"id" | "email" | "employeeCode"
	>;

	export type EmployeeOrderByWithAggregationInput = {
		id?: SortOrder;
		name?: SortOrder;
		email?: SortOrder;
		pinHash?: SortOrderInput | SortOrder;
		lastStationId?: SortOrderInput | SortOrder;
		dailyHoursLimit?: SortOrderInput | SortOrder;
		weeklyHoursLimit?: SortOrderInput | SortOrder;
		employeeCode?: SortOrderInput | SortOrder;
		phoneNumber?: SortOrderInput | SortOrder;
		hireDate?: SortOrderInput | SortOrder;
		status?: SortOrder;
		defaultStationId?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: EmployeeCountOrderByAggregateInput;
		_avg?: EmployeeAvgOrderByAggregateInput;
		_max?: EmployeeMaxOrderByAggregateInput;
		_min?: EmployeeMinOrderByAggregateInput;
		_sum?: EmployeeSumOrderByAggregateInput;
	};

	export type EmployeeScalarWhereWithAggregatesInput = {
		AND?: EmployeeScalarWhereWithAggregatesInput | EmployeeScalarWhereWithAggregatesInput[];
		OR?: EmployeeScalarWhereWithAggregatesInput[];
		NOT?: EmployeeScalarWhereWithAggregatesInput | EmployeeScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"Employee"> | string;
		name?: StringWithAggregatesFilter<"Employee"> | string;
		email?: StringWithAggregatesFilter<"Employee"> | string;
		pinHash?: StringNullableWithAggregatesFilter<"Employee"> | string | null;
		lastStationId?: StringNullableWithAggregatesFilter<"Employee"> | string | null;
		dailyHoursLimit?: FloatNullableWithAggregatesFilter<"Employee"> | number | null;
		weeklyHoursLimit?: FloatNullableWithAggregatesFilter<"Employee"> | number | null;
		employeeCode?: StringNullableWithAggregatesFilter<"Employee"> | string | null;
		phoneNumber?: StringNullableWithAggregatesFilter<"Employee"> | string | null;
		hireDate?: DateTimeNullableWithAggregatesFilter<"Employee"> | Date | string | null;
		status?: EnumEmployeeStatusWithAggregatesFilter<"Employee"> | $Enums.EmployeeStatus;
		defaultStationId?: StringNullableWithAggregatesFilter<"Employee"> | string | null;
		createdAt?: DateTimeWithAggregatesFilter<"Employee"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"Employee"> | Date | string;
	};

	export type OAuthAccountWhereInput = {
		AND?: OAuthAccountWhereInput | OAuthAccountWhereInput[];
		OR?: OAuthAccountWhereInput[];
		NOT?: OAuthAccountWhereInput | OAuthAccountWhereInput[];
		provider?: StringFilter<"OAuthAccount"> | string;
		providerUserId?: StringFilter<"OAuthAccount"> | string;
		userId?: StringFilter<"OAuthAccount"> | string;
		accessToken?: StringNullableFilter<"OAuthAccount"> | string | null;
		refreshToken?: StringNullableFilter<"OAuthAccount"> | string | null;
		expiresAt?: DateTimeNullableFilter<"OAuthAccount"> | Date | string | null;
		scope?: StringNullableFilter<"OAuthAccount"> | string | null;
		tokenType?: StringNullableFilter<"OAuthAccount"> | string | null;
		createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string;
		updatedAt?: DateTimeFilter<"OAuthAccount"> | Date | string;
		User?: XOR<UserScalarRelationFilter, UserWhereInput>;
	};

	export type OAuthAccountOrderByWithRelationInput = {
		provider?: SortOrder;
		providerUserId?: SortOrder;
		userId?: SortOrder;
		accessToken?: SortOrderInput | SortOrder;
		refreshToken?: SortOrderInput | SortOrder;
		expiresAt?: SortOrderInput | SortOrder;
		scope?: SortOrderInput | SortOrder;
		tokenType?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		User?: UserOrderByWithRelationInput;
	};

	export type OAuthAccountWhereUniqueInput = Prisma.AtLeast<
		{
			provider_providerUserId?: OAuthAccountProviderProviderUserIdCompoundUniqueInput;
			AND?: OAuthAccountWhereInput | OAuthAccountWhereInput[];
			OR?: OAuthAccountWhereInput[];
			NOT?: OAuthAccountWhereInput | OAuthAccountWhereInput[];
			provider?: StringFilter<"OAuthAccount"> | string;
			providerUserId?: StringFilter<"OAuthAccount"> | string;
			userId?: StringFilter<"OAuthAccount"> | string;
			accessToken?: StringNullableFilter<"OAuthAccount"> | string | null;
			refreshToken?: StringNullableFilter<"OAuthAccount"> | string | null;
			expiresAt?: DateTimeNullableFilter<"OAuthAccount"> | Date | string | null;
			scope?: StringNullableFilter<"OAuthAccount"> | string | null;
			tokenType?: StringNullableFilter<"OAuthAccount"> | string | null;
			createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string;
			updatedAt?: DateTimeFilter<"OAuthAccount"> | Date | string;
			User?: XOR<UserScalarRelationFilter, UserWhereInput>;
		},
		"provider_providerUserId"
	>;

	export type OAuthAccountOrderByWithAggregationInput = {
		provider?: SortOrder;
		providerUserId?: SortOrder;
		userId?: SortOrder;
		accessToken?: SortOrderInput | SortOrder;
		refreshToken?: SortOrderInput | SortOrder;
		expiresAt?: SortOrderInput | SortOrder;
		scope?: SortOrderInput | SortOrder;
		tokenType?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: OAuthAccountCountOrderByAggregateInput;
		_max?: OAuthAccountMaxOrderByAggregateInput;
		_min?: OAuthAccountMinOrderByAggregateInput;
	};

	export type OAuthAccountScalarWhereWithAggregatesInput = {
		AND?: OAuthAccountScalarWhereWithAggregatesInput | OAuthAccountScalarWhereWithAggregatesInput[];
		OR?: OAuthAccountScalarWhereWithAggregatesInput[];
		NOT?: OAuthAccountScalarWhereWithAggregatesInput | OAuthAccountScalarWhereWithAggregatesInput[];
		provider?: StringWithAggregatesFilter<"OAuthAccount"> | string;
		providerUserId?: StringWithAggregatesFilter<"OAuthAccount"> | string;
		userId?: StringWithAggregatesFilter<"OAuthAccount"> | string;
		accessToken?: StringNullableWithAggregatesFilter<"OAuthAccount"> | string | null;
		refreshToken?: StringNullableWithAggregatesFilter<"OAuthAccount"> | string | null;
		expiresAt?: DateTimeNullableWithAggregatesFilter<"OAuthAccount"> | Date | string | null;
		scope?: StringNullableWithAggregatesFilter<"OAuthAccount"> | string | null;
		tokenType?: StringNullableWithAggregatesFilter<"OAuthAccount"> | string | null;
		createdAt?: DateTimeWithAggregatesFilter<"OAuthAccount"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"OAuthAccount"> | Date | string;
	};

	export type SessionWhereInput = {
		AND?: SessionWhereInput | SessionWhereInput[];
		OR?: SessionWhereInput[];
		NOT?: SessionWhereInput | SessionWhereInput[];
		id?: StringFilter<"Session"> | string;
		userId?: StringFilter<"Session"> | string;
		expiresAt?: DateTimeFilter<"Session"> | Date | string;
		createdAt?: DateTimeFilter<"Session"> | Date | string;
		User?: XOR<UserScalarRelationFilter, UserWhereInput>;
	};

	export type SessionOrderByWithRelationInput = {
		id?: SortOrder;
		userId?: SortOrder;
		expiresAt?: SortOrder;
		createdAt?: SortOrder;
		User?: UserOrderByWithRelationInput;
	};

	export type SessionWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: SessionWhereInput | SessionWhereInput[];
			OR?: SessionWhereInput[];
			NOT?: SessionWhereInput | SessionWhereInput[];
			userId?: StringFilter<"Session"> | string;
			expiresAt?: DateTimeFilter<"Session"> | Date | string;
			createdAt?: DateTimeFilter<"Session"> | Date | string;
			User?: XOR<UserScalarRelationFilter, UserWhereInput>;
		},
		"id"
	>;

	export type SessionOrderByWithAggregationInput = {
		id?: SortOrder;
		userId?: SortOrder;
		expiresAt?: SortOrder;
		createdAt?: SortOrder;
		_count?: SessionCountOrderByAggregateInput;
		_max?: SessionMaxOrderByAggregateInput;
		_min?: SessionMinOrderByAggregateInput;
	};

	export type SessionScalarWhereWithAggregatesInput = {
		AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[];
		OR?: SessionScalarWhereWithAggregatesInput[];
		NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"Session"> | string;
		userId?: StringWithAggregatesFilter<"Session"> | string;
		expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string;
		createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string;
	};

	export type StationWhereInput = {
		AND?: StationWhereInput | StationWhereInput[];
		OR?: StationWhereInput[];
		NOT?: StationWhereInput | StationWhereInput[];
		id?: StringFilter<"Station"> | string;
		name?: StringFilter<"Station"> | string;
		description?: StringNullableFilter<"Station"> | string | null;
		capacity?: IntNullableFilter<"Station"> | number | null;
		isActive?: BoolFilter<"Station"> | boolean;
		zone?: StringNullableFilter<"Station"> | string | null;
		createdAt?: DateTimeFilter<"Station"> | Date | string;
		updatedAt?: DateTimeFilter<"Station"> | Date | string;
		TimeLog?: TimeLogListRelationFilter;
		TaskType?: TaskTypeListRelationFilter;
		employeesAtLastStation?: EmployeeListRelationFilter;
		employeesWithDefault?: EmployeeListRelationFilter;
	};

	export type StationOrderByWithRelationInput = {
		id?: SortOrder;
		name?: SortOrder;
		description?: SortOrderInput | SortOrder;
		capacity?: SortOrderInput | SortOrder;
		isActive?: SortOrder;
		zone?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		TimeLog?: TimeLogOrderByRelationAggregateInput;
		TaskType?: TaskTypeOrderByRelationAggregateInput;
		employeesAtLastStation?: EmployeeOrderByRelationAggregateInput;
		employeesWithDefault?: EmployeeOrderByRelationAggregateInput;
	};

	export type StationWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			name?: string;
			AND?: StationWhereInput | StationWhereInput[];
			OR?: StationWhereInput[];
			NOT?: StationWhereInput | StationWhereInput[];
			description?: StringNullableFilter<"Station"> | string | null;
			capacity?: IntNullableFilter<"Station"> | number | null;
			isActive?: BoolFilter<"Station"> | boolean;
			zone?: StringNullableFilter<"Station"> | string | null;
			createdAt?: DateTimeFilter<"Station"> | Date | string;
			updatedAt?: DateTimeFilter<"Station"> | Date | string;
			TimeLog?: TimeLogListRelationFilter;
			TaskType?: TaskTypeListRelationFilter;
			employeesAtLastStation?: EmployeeListRelationFilter;
			employeesWithDefault?: EmployeeListRelationFilter;
		},
		"id" | "name"
	>;

	export type StationOrderByWithAggregationInput = {
		id?: SortOrder;
		name?: SortOrder;
		description?: SortOrderInput | SortOrder;
		capacity?: SortOrderInput | SortOrder;
		isActive?: SortOrder;
		zone?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: StationCountOrderByAggregateInput;
		_avg?: StationAvgOrderByAggregateInput;
		_max?: StationMaxOrderByAggregateInput;
		_min?: StationMinOrderByAggregateInput;
		_sum?: StationSumOrderByAggregateInput;
	};

	export type StationScalarWhereWithAggregatesInput = {
		AND?: StationScalarWhereWithAggregatesInput | StationScalarWhereWithAggregatesInput[];
		OR?: StationScalarWhereWithAggregatesInput[];
		NOT?: StationScalarWhereWithAggregatesInput | StationScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"Station"> | string;
		name?: StringWithAggregatesFilter<"Station"> | string;
		description?: StringNullableWithAggregatesFilter<"Station"> | string | null;
		capacity?: IntNullableWithAggregatesFilter<"Station"> | number | null;
		isActive?: BoolWithAggregatesFilter<"Station"> | boolean;
		zone?: StringNullableWithAggregatesFilter<"Station"> | string | null;
		createdAt?: DateTimeWithAggregatesFilter<"Station"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"Station"> | Date | string;
	};

	export type TimeLogWhereInput = {
		AND?: TimeLogWhereInput | TimeLogWhereInput[];
		OR?: TimeLogWhereInput[];
		NOT?: TimeLogWhereInput | TimeLogWhereInput[];
		id?: StringFilter<"TimeLog"> | string;
		employeeId?: StringFilter<"TimeLog"> | string;
		stationId?: StringNullableFilter<"TimeLog"> | string | null;
		type?: EnumTimeLog_typeFilter<"TimeLog"> | $Enums.TimeLog_type;
		startTime?: DateTimeFilter<"TimeLog"> | Date | string;
		endTime?: DateTimeNullableFilter<"TimeLog"> | Date | string | null;
		note?: StringNullableFilter<"TimeLog"> | string | null;
		deletedAt?: DateTimeNullableFilter<"TimeLog"> | Date | string | null;
		correctedBy?: StringNullableFilter<"TimeLog"> | string | null;
		taskId?: StringNullableFilter<"TimeLog"> | string | null;
		clockMethod?: EnumClockMethodFilter<"TimeLog"> | $Enums.ClockMethod;
		createdAt?: DateTimeFilter<"TimeLog"> | Date | string;
		updatedAt?: DateTimeFilter<"TimeLog"> | Date | string;
		Employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>;
		Station?: XOR<StationNullableScalarRelationFilter, StationWhereInput> | null;
		Task?: XOR<TaskAssignmentNullableScalarRelationFilter, TaskAssignmentWhereInput> | null;
	};

	export type TimeLogOrderByWithRelationInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		stationId?: SortOrderInput | SortOrder;
		type?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrderInput | SortOrder;
		note?: SortOrderInput | SortOrder;
		deletedAt?: SortOrderInput | SortOrder;
		correctedBy?: SortOrderInput | SortOrder;
		taskId?: SortOrderInput | SortOrder;
		clockMethod?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		Employee?: EmployeeOrderByWithRelationInput;
		Station?: StationOrderByWithRelationInput;
		Task?: TaskAssignmentOrderByWithRelationInput;
	};

	export type TimeLogWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: TimeLogWhereInput | TimeLogWhereInput[];
			OR?: TimeLogWhereInput[];
			NOT?: TimeLogWhereInput | TimeLogWhereInput[];
			employeeId?: StringFilter<"TimeLog"> | string;
			stationId?: StringNullableFilter<"TimeLog"> | string | null;
			type?: EnumTimeLog_typeFilter<"TimeLog"> | $Enums.TimeLog_type;
			startTime?: DateTimeFilter<"TimeLog"> | Date | string;
			endTime?: DateTimeNullableFilter<"TimeLog"> | Date | string | null;
			note?: StringNullableFilter<"TimeLog"> | string | null;
			deletedAt?: DateTimeNullableFilter<"TimeLog"> | Date | string | null;
			correctedBy?: StringNullableFilter<"TimeLog"> | string | null;
			taskId?: StringNullableFilter<"TimeLog"> | string | null;
			clockMethod?: EnumClockMethodFilter<"TimeLog"> | $Enums.ClockMethod;
			createdAt?: DateTimeFilter<"TimeLog"> | Date | string;
			updatedAt?: DateTimeFilter<"TimeLog"> | Date | string;
			Employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>;
			Station?: XOR<StationNullableScalarRelationFilter, StationWhereInput> | null;
			Task?: XOR<TaskAssignmentNullableScalarRelationFilter, TaskAssignmentWhereInput> | null;
		},
		"id"
	>;

	export type TimeLogOrderByWithAggregationInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		stationId?: SortOrderInput | SortOrder;
		type?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrderInput | SortOrder;
		note?: SortOrderInput | SortOrder;
		deletedAt?: SortOrderInput | SortOrder;
		correctedBy?: SortOrderInput | SortOrder;
		taskId?: SortOrderInput | SortOrder;
		clockMethod?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: TimeLogCountOrderByAggregateInput;
		_max?: TimeLogMaxOrderByAggregateInput;
		_min?: TimeLogMinOrderByAggregateInput;
	};

	export type TimeLogScalarWhereWithAggregatesInput = {
		AND?: TimeLogScalarWhereWithAggregatesInput | TimeLogScalarWhereWithAggregatesInput[];
		OR?: TimeLogScalarWhereWithAggregatesInput[];
		NOT?: TimeLogScalarWhereWithAggregatesInput | TimeLogScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"TimeLog"> | string;
		employeeId?: StringWithAggregatesFilter<"TimeLog"> | string;
		stationId?: StringNullableWithAggregatesFilter<"TimeLog"> | string | null;
		type?: EnumTimeLog_typeWithAggregatesFilter<"TimeLog"> | $Enums.TimeLog_type;
		startTime?: DateTimeWithAggregatesFilter<"TimeLog"> | Date | string;
		endTime?: DateTimeNullableWithAggregatesFilter<"TimeLog"> | Date | string | null;
		note?: StringNullableWithAggregatesFilter<"TimeLog"> | string | null;
		deletedAt?: DateTimeNullableWithAggregatesFilter<"TimeLog"> | Date | string | null;
		correctedBy?: StringNullableWithAggregatesFilter<"TimeLog"> | string | null;
		taskId?: StringNullableWithAggregatesFilter<"TimeLog"> | string | null;
		clockMethod?: EnumClockMethodWithAggregatesFilter<"TimeLog"> | $Enums.ClockMethod;
		createdAt?: DateTimeWithAggregatesFilter<"TimeLog"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"TimeLog"> | Date | string;
	};

	export type TaskTypeWhereInput = {
		AND?: TaskTypeWhereInput | TaskTypeWhereInput[];
		OR?: TaskTypeWhereInput[];
		NOT?: TaskTypeWhereInput | TaskTypeWhereInput[];
		id?: StringFilter<"TaskType"> | string;
		name?: StringFilter<"TaskType"> | string;
		stationId?: StringFilter<"TaskType"> | string;
		description?: StringNullableFilter<"TaskType"> | string | null;
		estimatedMinutesPerUnit?: FloatNullableFilter<"TaskType"> | number | null;
		isActive?: BoolFilter<"TaskType"> | boolean;
		createdAt?: DateTimeFilter<"TaskType"> | Date | string;
		updatedAt?: DateTimeFilter<"TaskType"> | Date | string;
		Station?: XOR<StationScalarRelationFilter, StationWhereInput>;
		TaskAssignment?: TaskAssignmentListRelationFilter;
	};

	export type TaskTypeOrderByWithRelationInput = {
		id?: SortOrder;
		name?: SortOrder;
		stationId?: SortOrder;
		description?: SortOrderInput | SortOrder;
		estimatedMinutesPerUnit?: SortOrderInput | SortOrder;
		isActive?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		Station?: StationOrderByWithRelationInput;
		TaskAssignment?: TaskAssignmentOrderByRelationAggregateInput;
	};

	export type TaskTypeWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: TaskTypeWhereInput | TaskTypeWhereInput[];
			OR?: TaskTypeWhereInput[];
			NOT?: TaskTypeWhereInput | TaskTypeWhereInput[];
			name?: StringFilter<"TaskType"> | string;
			stationId?: StringFilter<"TaskType"> | string;
			description?: StringNullableFilter<"TaskType"> | string | null;
			estimatedMinutesPerUnit?: FloatNullableFilter<"TaskType"> | number | null;
			isActive?: BoolFilter<"TaskType"> | boolean;
			createdAt?: DateTimeFilter<"TaskType"> | Date | string;
			updatedAt?: DateTimeFilter<"TaskType"> | Date | string;
			Station?: XOR<StationScalarRelationFilter, StationWhereInput>;
			TaskAssignment?: TaskAssignmentListRelationFilter;
		},
		"id"
	>;

	export type TaskTypeOrderByWithAggregationInput = {
		id?: SortOrder;
		name?: SortOrder;
		stationId?: SortOrder;
		description?: SortOrderInput | SortOrder;
		estimatedMinutesPerUnit?: SortOrderInput | SortOrder;
		isActive?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: TaskTypeCountOrderByAggregateInput;
		_avg?: TaskTypeAvgOrderByAggregateInput;
		_max?: TaskTypeMaxOrderByAggregateInput;
		_min?: TaskTypeMinOrderByAggregateInput;
		_sum?: TaskTypeSumOrderByAggregateInput;
	};

	export type TaskTypeScalarWhereWithAggregatesInput = {
		AND?: TaskTypeScalarWhereWithAggregatesInput | TaskTypeScalarWhereWithAggregatesInput[];
		OR?: TaskTypeScalarWhereWithAggregatesInput[];
		NOT?: TaskTypeScalarWhereWithAggregatesInput | TaskTypeScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"TaskType"> | string;
		name?: StringWithAggregatesFilter<"TaskType"> | string;
		stationId?: StringWithAggregatesFilter<"TaskType"> | string;
		description?: StringNullableWithAggregatesFilter<"TaskType"> | string | null;
		estimatedMinutesPerUnit?: FloatNullableWithAggregatesFilter<"TaskType"> | number | null;
		isActive?: BoolWithAggregatesFilter<"TaskType"> | boolean;
		createdAt?: DateTimeWithAggregatesFilter<"TaskType"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"TaskType"> | Date | string;
	};

	export type TaskAssignmentWhereInput = {
		AND?: TaskAssignmentWhereInput | TaskAssignmentWhereInput[];
		OR?: TaskAssignmentWhereInput[];
		NOT?: TaskAssignmentWhereInput | TaskAssignmentWhereInput[];
		id?: StringFilter<"TaskAssignment"> | string;
		employeeId?: StringFilter<"TaskAssignment"> | string;
		taskTypeId?: StringFilter<"TaskAssignment"> | string;
		startTime?: DateTimeFilter<"TaskAssignment"> | Date | string;
		endTime?: DateTimeNullableFilter<"TaskAssignment"> | Date | string | null;
		unitsCompleted?: IntNullableFilter<"TaskAssignment"> | number | null;
		notes?: StringNullableFilter<"TaskAssignment"> | string | null;
		createdAt?: DateTimeFilter<"TaskAssignment"> | Date | string;
		updatedAt?: DateTimeFilter<"TaskAssignment"> | Date | string;
		Employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>;
		TaskType?: XOR<TaskTypeScalarRelationFilter, TaskTypeWhereInput>;
		TimeLogs?: TimeLogListRelationFilter;
	};

	export type TaskAssignmentOrderByWithRelationInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		taskTypeId?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrderInput | SortOrder;
		unitsCompleted?: SortOrderInput | SortOrder;
		notes?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		Employee?: EmployeeOrderByWithRelationInput;
		TaskType?: TaskTypeOrderByWithRelationInput;
		TimeLogs?: TimeLogOrderByRelationAggregateInput;
	};

	export type TaskAssignmentWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: TaskAssignmentWhereInput | TaskAssignmentWhereInput[];
			OR?: TaskAssignmentWhereInput[];
			NOT?: TaskAssignmentWhereInput | TaskAssignmentWhereInput[];
			employeeId?: StringFilter<"TaskAssignment"> | string;
			taskTypeId?: StringFilter<"TaskAssignment"> | string;
			startTime?: DateTimeFilter<"TaskAssignment"> | Date | string;
			endTime?: DateTimeNullableFilter<"TaskAssignment"> | Date | string | null;
			unitsCompleted?: IntNullableFilter<"TaskAssignment"> | number | null;
			notes?: StringNullableFilter<"TaskAssignment"> | string | null;
			createdAt?: DateTimeFilter<"TaskAssignment"> | Date | string;
			updatedAt?: DateTimeFilter<"TaskAssignment"> | Date | string;
			Employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>;
			TaskType?: XOR<TaskTypeScalarRelationFilter, TaskTypeWhereInput>;
			TimeLogs?: TimeLogListRelationFilter;
		},
		"id"
	>;

	export type TaskAssignmentOrderByWithAggregationInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		taskTypeId?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrderInput | SortOrder;
		unitsCompleted?: SortOrderInput | SortOrder;
		notes?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: TaskAssignmentCountOrderByAggregateInput;
		_avg?: TaskAssignmentAvgOrderByAggregateInput;
		_max?: TaskAssignmentMaxOrderByAggregateInput;
		_min?: TaskAssignmentMinOrderByAggregateInput;
		_sum?: TaskAssignmentSumOrderByAggregateInput;
	};

	export type TaskAssignmentScalarWhereWithAggregatesInput = {
		AND?:
			| TaskAssignmentScalarWhereWithAggregatesInput
			| TaskAssignmentScalarWhereWithAggregatesInput[];
		OR?: TaskAssignmentScalarWhereWithAggregatesInput[];
		NOT?:
			| TaskAssignmentScalarWhereWithAggregatesInput
			| TaskAssignmentScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"TaskAssignment"> | string;
		employeeId?: StringWithAggregatesFilter<"TaskAssignment"> | string;
		taskTypeId?: StringWithAggregatesFilter<"TaskAssignment"> | string;
		startTime?: DateTimeWithAggregatesFilter<"TaskAssignment"> | Date | string;
		endTime?: DateTimeNullableWithAggregatesFilter<"TaskAssignment"> | Date | string | null;
		unitsCompleted?: IntNullableWithAggregatesFilter<"TaskAssignment"> | number | null;
		notes?: StringNullableWithAggregatesFilter<"TaskAssignment"> | string | null;
		createdAt?: DateTimeWithAggregatesFilter<"TaskAssignment"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"TaskAssignment"> | Date | string;
	};

	export type PerformanceMetricWhereInput = {
		AND?: PerformanceMetricWhereInput | PerformanceMetricWhereInput[];
		OR?: PerformanceMetricWhereInput[];
		NOT?: PerformanceMetricWhereInput | PerformanceMetricWhereInput[];
		id?: StringFilter<"PerformanceMetric"> | string;
		employeeId?: StringFilter<"PerformanceMetric"> | string;
		date?: DateTimeFilter<"PerformanceMetric"> | Date | string;
		stationId?: StringNullableFilter<"PerformanceMetric"> | string | null;
		hoursWorked?: FloatFilter<"PerformanceMetric"> | number;
		unitsProcessed?: IntNullableFilter<"PerformanceMetric"> | number | null;
		efficiency?: FloatNullableFilter<"PerformanceMetric"> | number | null;
		qualityScore?: FloatNullableFilter<"PerformanceMetric"> | number | null;
		overtimeHours?: FloatNullableFilter<"PerformanceMetric"> | number | null;
		createdAt?: DateTimeFilter<"PerformanceMetric"> | Date | string;
		updatedAt?: DateTimeFilter<"PerformanceMetric"> | Date | string;
		Employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>;
	};

	export type PerformanceMetricOrderByWithRelationInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		date?: SortOrder;
		stationId?: SortOrderInput | SortOrder;
		hoursWorked?: SortOrder;
		unitsProcessed?: SortOrderInput | SortOrder;
		efficiency?: SortOrderInput | SortOrder;
		qualityScore?: SortOrderInput | SortOrder;
		overtimeHours?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		Employee?: EmployeeOrderByWithRelationInput;
	};

	export type PerformanceMetricWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			employeeId_date_stationId?: PerformanceMetricEmployeeIdDateStationIdCompoundUniqueInput;
			AND?: PerformanceMetricWhereInput | PerformanceMetricWhereInput[];
			OR?: PerformanceMetricWhereInput[];
			NOT?: PerformanceMetricWhereInput | PerformanceMetricWhereInput[];
			employeeId?: StringFilter<"PerformanceMetric"> | string;
			date?: DateTimeFilter<"PerformanceMetric"> | Date | string;
			stationId?: StringNullableFilter<"PerformanceMetric"> | string | null;
			hoursWorked?: FloatFilter<"PerformanceMetric"> | number;
			unitsProcessed?: IntNullableFilter<"PerformanceMetric"> | number | null;
			efficiency?: FloatNullableFilter<"PerformanceMetric"> | number | null;
			qualityScore?: FloatNullableFilter<"PerformanceMetric"> | number | null;
			overtimeHours?: FloatNullableFilter<"PerformanceMetric"> | number | null;
			createdAt?: DateTimeFilter<"PerformanceMetric"> | Date | string;
			updatedAt?: DateTimeFilter<"PerformanceMetric"> | Date | string;
			Employee?: XOR<EmployeeScalarRelationFilter, EmployeeWhereInput>;
		},
		"id" | "employeeId_date_stationId"
	>;

	export type PerformanceMetricOrderByWithAggregationInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		date?: SortOrder;
		stationId?: SortOrderInput | SortOrder;
		hoursWorked?: SortOrder;
		unitsProcessed?: SortOrderInput | SortOrder;
		efficiency?: SortOrderInput | SortOrder;
		qualityScore?: SortOrderInput | SortOrder;
		overtimeHours?: SortOrderInput | SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: PerformanceMetricCountOrderByAggregateInput;
		_avg?: PerformanceMetricAvgOrderByAggregateInput;
		_max?: PerformanceMetricMaxOrderByAggregateInput;
		_min?: PerformanceMetricMinOrderByAggregateInput;
		_sum?: PerformanceMetricSumOrderByAggregateInput;
	};

	export type PerformanceMetricScalarWhereWithAggregatesInput = {
		AND?:
			| PerformanceMetricScalarWhereWithAggregatesInput
			| PerformanceMetricScalarWhereWithAggregatesInput[];
		OR?: PerformanceMetricScalarWhereWithAggregatesInput[];
		NOT?:
			| PerformanceMetricScalarWhereWithAggregatesInput
			| PerformanceMetricScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"PerformanceMetric"> | string;
		employeeId?: StringWithAggregatesFilter<"PerformanceMetric"> | string;
		date?: DateTimeWithAggregatesFilter<"PerformanceMetric"> | Date | string;
		stationId?: StringNullableWithAggregatesFilter<"PerformanceMetric"> | string | null;
		hoursWorked?: FloatWithAggregatesFilter<"PerformanceMetric"> | number;
		unitsProcessed?: IntNullableWithAggregatesFilter<"PerformanceMetric"> | number | null;
		efficiency?: FloatNullableWithAggregatesFilter<"PerformanceMetric"> | number | null;
		qualityScore?: FloatNullableWithAggregatesFilter<"PerformanceMetric"> | number | null;
		overtimeHours?: FloatNullableWithAggregatesFilter<"PerformanceMetric"> | number | null;
		createdAt?: DateTimeWithAggregatesFilter<"PerformanceMetric"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"PerformanceMetric"> | Date | string;
	};

	export type TodoWhereInput = {
		AND?: TodoWhereInput | TodoWhereInput[];
		OR?: TodoWhereInput[];
		NOT?: TodoWhereInput | TodoWhereInput[];
		id?: StringFilter<"Todo"> | string;
		title?: StringFilter<"Todo"> | string;
		completed?: BoolFilter<"Todo"> | boolean;
		createdAt?: DateTimeFilter<"Todo"> | Date | string;
		updatedAt?: DateTimeFilter<"Todo"> | Date | string;
	};

	export type TodoOrderByWithRelationInput = {
		id?: SortOrder;
		title?: SortOrder;
		completed?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TodoWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			AND?: TodoWhereInput | TodoWhereInput[];
			OR?: TodoWhereInput[];
			NOT?: TodoWhereInput | TodoWhereInput[];
			title?: StringFilter<"Todo"> | string;
			completed?: BoolFilter<"Todo"> | boolean;
			createdAt?: DateTimeFilter<"Todo"> | Date | string;
			updatedAt?: DateTimeFilter<"Todo"> | Date | string;
		},
		"id"
	>;

	export type TodoOrderByWithAggregationInput = {
		id?: SortOrder;
		title?: SortOrder;
		completed?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		_count?: TodoCountOrderByAggregateInput;
		_max?: TodoMaxOrderByAggregateInput;
		_min?: TodoMinOrderByAggregateInput;
	};

	export type TodoScalarWhereWithAggregatesInput = {
		AND?: TodoScalarWhereWithAggregatesInput | TodoScalarWhereWithAggregatesInput[];
		OR?: TodoScalarWhereWithAggregatesInput[];
		NOT?: TodoScalarWhereWithAggregatesInput | TodoScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"Todo"> | string;
		title?: StringWithAggregatesFilter<"Todo"> | string;
		completed?: BoolWithAggregatesFilter<"Todo"> | boolean;
		createdAt?: DateTimeWithAggregatesFilter<"Todo"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"Todo"> | Date | string;
	};

	export type UserWhereInput = {
		AND?: UserWhereInput | UserWhereInput[];
		OR?: UserWhereInput[];
		NOT?: UserWhereInput | UserWhereInput[];
		id?: StringFilter<"User"> | string;
		email?: StringFilter<"User"> | string;
		name?: StringNullableFilter<"User"> | string | null;
		image?: StringNullableFilter<"User"> | string | null;
		role?: EnumUser_roleFilter<"User"> | $Enums.User_role;
		createdAt?: DateTimeFilter<"User"> | Date | string;
		updatedAt?: DateTimeFilter<"User"> | Date | string;
		employeeId?: StringNullableFilter<"User"> | string | null;
		OAuthAccount?: OAuthAccountListRelationFilter;
		Session?: SessionListRelationFilter;
		Employee?: XOR<EmployeeNullableScalarRelationFilter, EmployeeWhereInput> | null;
		ApiKey?: ApiKeyListRelationFilter;
	};

	export type UserOrderByWithRelationInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrderInput | SortOrder;
		image?: SortOrderInput | SortOrder;
		role?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		employeeId?: SortOrderInput | SortOrder;
		OAuthAccount?: OAuthAccountOrderByRelationAggregateInput;
		Session?: SessionOrderByRelationAggregateInput;
		Employee?: EmployeeOrderByWithRelationInput;
		ApiKey?: ApiKeyOrderByRelationAggregateInput;
	};

	export type UserWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			email?: string;
			employeeId?: string;
			AND?: UserWhereInput | UserWhereInput[];
			OR?: UserWhereInput[];
			NOT?: UserWhereInput | UserWhereInput[];
			name?: StringNullableFilter<"User"> | string | null;
			image?: StringNullableFilter<"User"> | string | null;
			role?: EnumUser_roleFilter<"User"> | $Enums.User_role;
			createdAt?: DateTimeFilter<"User"> | Date | string;
			updatedAt?: DateTimeFilter<"User"> | Date | string;
			OAuthAccount?: OAuthAccountListRelationFilter;
			Session?: SessionListRelationFilter;
			Employee?: XOR<EmployeeNullableScalarRelationFilter, EmployeeWhereInput> | null;
			ApiKey?: ApiKeyListRelationFilter;
		},
		"id" | "email" | "employeeId"
	>;

	export type UserOrderByWithAggregationInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrderInput | SortOrder;
		image?: SortOrderInput | SortOrder;
		role?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		employeeId?: SortOrderInput | SortOrder;
		_count?: UserCountOrderByAggregateInput;
		_max?: UserMaxOrderByAggregateInput;
		_min?: UserMinOrderByAggregateInput;
	};

	export type UserScalarWhereWithAggregatesInput = {
		AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
		OR?: UserScalarWhereWithAggregatesInput[];
		NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"User"> | string;
		email?: StringWithAggregatesFilter<"User"> | string;
		name?: StringNullableWithAggregatesFilter<"User"> | string | null;
		image?: StringNullableWithAggregatesFilter<"User"> | string | null;
		role?: EnumUser_roleWithAggregatesFilter<"User"> | $Enums.User_role;
		createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string;
		updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string;
		employeeId?: StringNullableWithAggregatesFilter<"User"> | string | null;
	};

	export type ApiKeyWhereInput = {
		AND?: ApiKeyWhereInput | ApiKeyWhereInput[];
		OR?: ApiKeyWhereInput[];
		NOT?: ApiKeyWhereInput | ApiKeyWhereInput[];
		id?: StringFilter<"ApiKey"> | string;
		name?: StringFilter<"ApiKey"> | string;
		key?: StringFilter<"ApiKey"> | string;
		userId?: StringFilter<"ApiKey"> | string;
		createdAt?: DateTimeFilter<"ApiKey"> | Date | string;
		expiresAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null;
		lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null;
		User?: XOR<UserScalarRelationFilter, UserWhereInput>;
	};

	export type ApiKeyOrderByWithRelationInput = {
		id?: SortOrder;
		name?: SortOrder;
		key?: SortOrder;
		userId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrderInput | SortOrder;
		lastUsedAt?: SortOrderInput | SortOrder;
		User?: UserOrderByWithRelationInput;
	};

	export type ApiKeyWhereUniqueInput = Prisma.AtLeast<
		{
			id?: string;
			key?: string;
			AND?: ApiKeyWhereInput | ApiKeyWhereInput[];
			OR?: ApiKeyWhereInput[];
			NOT?: ApiKeyWhereInput | ApiKeyWhereInput[];
			name?: StringFilter<"ApiKey"> | string;
			userId?: StringFilter<"ApiKey"> | string;
			createdAt?: DateTimeFilter<"ApiKey"> | Date | string;
			expiresAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null;
			lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null;
			User?: XOR<UserScalarRelationFilter, UserWhereInput>;
		},
		"id" | "key"
	>;

	export type ApiKeyOrderByWithAggregationInput = {
		id?: SortOrder;
		name?: SortOrder;
		key?: SortOrder;
		userId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrderInput | SortOrder;
		lastUsedAt?: SortOrderInput | SortOrder;
		_count?: ApiKeyCountOrderByAggregateInput;
		_max?: ApiKeyMaxOrderByAggregateInput;
		_min?: ApiKeyMinOrderByAggregateInput;
	};

	export type ApiKeyScalarWhereWithAggregatesInput = {
		AND?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[];
		OR?: ApiKeyScalarWhereWithAggregatesInput[];
		NOT?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[];
		id?: StringWithAggregatesFilter<"ApiKey"> | string;
		name?: StringWithAggregatesFilter<"ApiKey"> | string;
		key?: StringWithAggregatesFilter<"ApiKey"> | string;
		userId?: StringWithAggregatesFilter<"ApiKey"> | string;
		createdAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string;
		expiresAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null;
		lastUsedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null;
	};

	export type EmployeeCreateInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutEmployeeInput;
		User?: UserCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricCreateNestedManyWithoutEmployeeInput;
		defaultStation?: StationCreateNestedOneWithoutEmployeesWithDefaultInput;
		lastStation?: StationCreateNestedOneWithoutEmployeesAtLastStationInput;
	};

	export type EmployeeUncheckedCreateInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		lastStationId?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		defaultStationId?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutEmployeeInput;
		User?: UserUncheckedCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentUncheckedCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricUncheckedCreateNestedManyWithoutEmployeeInput;
	};

	export type EmployeeUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutEmployeeNestedInput;
		User?: UserUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUpdateManyWithoutEmployeeNestedInput;
		defaultStation?: StationUpdateOneWithoutEmployeesWithDefaultNestedInput;
		lastStation?: StationUpdateOneWithoutEmployeesAtLastStationNestedInput;
	};

	export type EmployeeUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		lastStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		defaultStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutEmployeeNestedInput;
		User?: UserUncheckedUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUncheckedUpdateManyWithoutEmployeeNestedInput;
	};

	export type EmployeeCreateManyInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		lastStationId?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		defaultStationId?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type EmployeeUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type EmployeeUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		lastStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		defaultStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type OAuthAccountCreateInput = {
		provider: string;
		providerUserId: string;
		accessToken?: string | null;
		refreshToken?: string | null;
		expiresAt?: Date | string | null;
		scope?: string | null;
		tokenType?: string | null;
		createdAt?: Date | string;
		updatedAt: Date | string;
		User: UserCreateNestedOneWithoutOAuthAccountInput;
	};

	export type OAuthAccountUncheckedCreateInput = {
		provider: string;
		providerUserId: string;
		userId: string;
		accessToken?: string | null;
		refreshToken?: string | null;
		expiresAt?: Date | string | null;
		scope?: string | null;
		tokenType?: string | null;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type OAuthAccountUpdateInput = {
		provider?: StringFieldUpdateOperationsInput | string;
		providerUserId?: StringFieldUpdateOperationsInput | string;
		accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
		refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		scope?: NullableStringFieldUpdateOperationsInput | string | null;
		tokenType?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		User?: UserUpdateOneRequiredWithoutOAuthAccountNestedInput;
	};

	export type OAuthAccountUncheckedUpdateInput = {
		provider?: StringFieldUpdateOperationsInput | string;
		providerUserId?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
		refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		scope?: NullableStringFieldUpdateOperationsInput | string | null;
		tokenType?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type OAuthAccountCreateManyInput = {
		provider: string;
		providerUserId: string;
		userId: string;
		accessToken?: string | null;
		refreshToken?: string | null;
		expiresAt?: Date | string | null;
		scope?: string | null;
		tokenType?: string | null;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type OAuthAccountUpdateManyMutationInput = {
		provider?: StringFieldUpdateOperationsInput | string;
		providerUserId?: StringFieldUpdateOperationsInput | string;
		accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
		refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		scope?: NullableStringFieldUpdateOperationsInput | string | null;
		tokenType?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type OAuthAccountUncheckedUpdateManyInput = {
		provider?: StringFieldUpdateOperationsInput | string;
		providerUserId?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
		refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		scope?: NullableStringFieldUpdateOperationsInput | string | null;
		tokenType?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type SessionCreateInput = {
		id?: string;
		expiresAt: Date | string;
		createdAt?: Date | string;
		User: UserCreateNestedOneWithoutSessionInput;
	};

	export type SessionUncheckedCreateInput = {
		id?: string;
		userId: string;
		expiresAt: Date | string;
		createdAt?: Date | string;
	};

	export type SessionUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		User?: UserUpdateOneRequiredWithoutSessionNestedInput;
	};

	export type SessionUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type SessionCreateManyInput = {
		id?: string;
		userId: string;
		expiresAt: Date | string;
		createdAt?: Date | string;
	};

	export type SessionUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type SessionUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type StationCreateInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutStationInput;
		TaskType?: TaskTypeCreateNestedManyWithoutStationInput;
		employeesAtLastStation?: EmployeeCreateNestedManyWithoutLastStationInput;
		employeesWithDefault?: EmployeeCreateNestedManyWithoutDefaultStationInput;
	};

	export type StationUncheckedCreateInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutStationInput;
		TaskType?: TaskTypeUncheckedCreateNestedManyWithoutStationInput;
		employeesAtLastStation?: EmployeeUncheckedCreateNestedManyWithoutLastStationInput;
		employeesWithDefault?: EmployeeUncheckedCreateNestedManyWithoutDefaultStationInput;
	};

	export type StationUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutStationNestedInput;
		TaskType?: TaskTypeUpdateManyWithoutStationNestedInput;
		employeesAtLastStation?: EmployeeUpdateManyWithoutLastStationNestedInput;
		employeesWithDefault?: EmployeeUpdateManyWithoutDefaultStationNestedInput;
	};

	export type StationUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutStationNestedInput;
		TaskType?: TaskTypeUncheckedUpdateManyWithoutStationNestedInput;
		employeesAtLastStation?: EmployeeUncheckedUpdateManyWithoutLastStationNestedInput;
		employeesWithDefault?: EmployeeUncheckedUpdateManyWithoutDefaultStationNestedInput;
	};

	export type StationCreateManyInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type StationUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type StationUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogCreateInput = {
		id?: string;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
		Employee: EmployeeCreateNestedOneWithoutTimeLogInput;
		Station?: StationCreateNestedOneWithoutTimeLogInput;
		Task?: TaskAssignmentCreateNestedOneWithoutTimeLogsInput;
	};

	export type TimeLogUncheckedCreateInput = {
		id?: string;
		employeeId: string;
		stationId?: string | null;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		taskId?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TimeLogUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Employee?: EmployeeUpdateOneRequiredWithoutTimeLogNestedInput;
		Station?: StationUpdateOneWithoutTimeLogNestedInput;
		Task?: TaskAssignmentUpdateOneWithoutTimeLogsNestedInput;
	};

	export type TimeLogUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		taskId?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogCreateManyInput = {
		id?: string;
		employeeId: string;
		stationId?: string | null;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		taskId?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TimeLogUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		taskId?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TaskTypeCreateInput = {
		id?: string;
		name: string;
		description?: string | null;
		estimatedMinutesPerUnit?: number | null;
		isActive?: boolean;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		Station: StationCreateNestedOneWithoutTaskTypeInput;
		TaskAssignment?: TaskAssignmentCreateNestedManyWithoutTaskTypeInput;
	};

	export type TaskTypeUncheckedCreateInput = {
		id?: string;
		name: string;
		stationId: string;
		description?: string | null;
		estimatedMinutesPerUnit?: number | null;
		isActive?: boolean;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TaskAssignment?: TaskAssignmentUncheckedCreateNestedManyWithoutTaskTypeInput;
	};

	export type TaskTypeUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Station?: StationUpdateOneRequiredWithoutTaskTypeNestedInput;
		TaskAssignment?: TaskAssignmentUpdateManyWithoutTaskTypeNestedInput;
	};

	export type TaskTypeUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		stationId?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TaskAssignment?: TaskAssignmentUncheckedUpdateManyWithoutTaskTypeNestedInput;
	};

	export type TaskTypeCreateManyInput = {
		id?: string;
		name: string;
		stationId: string;
		description?: string | null;
		estimatedMinutesPerUnit?: number | null;
		isActive?: boolean;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type TaskTypeUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TaskTypeUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		stationId?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TaskAssignmentCreateInput = {
		id?: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		Employee: EmployeeCreateNestedOneWithoutTaskAssignmentInput;
		TaskType: TaskTypeCreateNestedOneWithoutTaskAssignmentInput;
		TimeLogs?: TimeLogCreateNestedManyWithoutTaskInput;
	};

	export type TaskAssignmentUncheckedCreateInput = {
		id?: string;
		employeeId: string;
		taskTypeId: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLogs?: TimeLogUncheckedCreateNestedManyWithoutTaskInput;
	};

	export type TaskAssignmentUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Employee?: EmployeeUpdateOneRequiredWithoutTaskAssignmentNestedInput;
		TaskType?: TaskTypeUpdateOneRequiredWithoutTaskAssignmentNestedInput;
		TimeLogs?: TimeLogUpdateManyWithoutTaskNestedInput;
	};

	export type TaskAssignmentUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		taskTypeId?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLogs?: TimeLogUncheckedUpdateManyWithoutTaskNestedInput;
	};

	export type TaskAssignmentCreateManyInput = {
		id?: string;
		employeeId: string;
		taskTypeId: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type TaskAssignmentUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TaskAssignmentUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		taskTypeId?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type PerformanceMetricCreateInput = {
		id?: string;
		date: Date | string;
		stationId?: string | null;
		hoursWorked: number;
		unitsProcessed?: number | null;
		efficiency?: number | null;
		qualityScore?: number | null;
		overtimeHours?: number | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		Employee: EmployeeCreateNestedOneWithoutPerformanceMetricInput;
	};

	export type PerformanceMetricUncheckedCreateInput = {
		id?: string;
		employeeId: string;
		date: Date | string;
		stationId?: string | null;
		hoursWorked: number;
		unitsProcessed?: number | null;
		efficiency?: number | null;
		qualityScore?: number | null;
		overtimeHours?: number | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type PerformanceMetricUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		date?: DateTimeFieldUpdateOperationsInput | Date | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		hoursWorked?: FloatFieldUpdateOperationsInput | number;
		unitsProcessed?: NullableIntFieldUpdateOperationsInput | number | null;
		efficiency?: NullableFloatFieldUpdateOperationsInput | number | null;
		qualityScore?: NullableFloatFieldUpdateOperationsInput | number | null;
		overtimeHours?: NullableFloatFieldUpdateOperationsInput | number | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Employee?: EmployeeUpdateOneRequiredWithoutPerformanceMetricNestedInput;
	};

	export type PerformanceMetricUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		date?: DateTimeFieldUpdateOperationsInput | Date | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		hoursWorked?: FloatFieldUpdateOperationsInput | number;
		unitsProcessed?: NullableIntFieldUpdateOperationsInput | number | null;
		efficiency?: NullableFloatFieldUpdateOperationsInput | number | null;
		qualityScore?: NullableFloatFieldUpdateOperationsInput | number | null;
		overtimeHours?: NullableFloatFieldUpdateOperationsInput | number | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type PerformanceMetricCreateManyInput = {
		id?: string;
		employeeId: string;
		date: Date | string;
		stationId?: string | null;
		hoursWorked: number;
		unitsProcessed?: number | null;
		efficiency?: number | null;
		qualityScore?: number | null;
		overtimeHours?: number | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type PerformanceMetricUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		date?: DateTimeFieldUpdateOperationsInput | Date | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		hoursWorked?: FloatFieldUpdateOperationsInput | number;
		unitsProcessed?: NullableIntFieldUpdateOperationsInput | number | null;
		efficiency?: NullableFloatFieldUpdateOperationsInput | number | null;
		qualityScore?: NullableFloatFieldUpdateOperationsInput | number | null;
		overtimeHours?: NullableFloatFieldUpdateOperationsInput | number | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type PerformanceMetricUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		date?: DateTimeFieldUpdateOperationsInput | Date | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		hoursWorked?: FloatFieldUpdateOperationsInput | number;
		unitsProcessed?: NullableIntFieldUpdateOperationsInput | number | null;
		efficiency?: NullableFloatFieldUpdateOperationsInput | number | null;
		qualityScore?: NullableFloatFieldUpdateOperationsInput | number | null;
		overtimeHours?: NullableFloatFieldUpdateOperationsInput | number | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TodoCreateInput = {
		id?: string;
		title: string;
		completed?: boolean;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TodoUncheckedCreateInput = {
		id?: string;
		title: string;
		completed?: boolean;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TodoUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		completed?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TodoUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		completed?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TodoCreateManyInput = {
		id?: string;
		title: string;
		completed?: boolean;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TodoUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		completed?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TodoUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		title?: StringFieldUpdateOperationsInput | string;
		completed?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type UserCreateInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		OAuthAccount?: OAuthAccountCreateNestedManyWithoutUserInput;
		Session?: SessionCreateNestedManyWithoutUserInput;
		Employee?: EmployeeCreateNestedOneWithoutUserInput;
		ApiKey?: ApiKeyCreateNestedManyWithoutUserInput;
	};

	export type UserUncheckedCreateInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		employeeId?: string | null;
		OAuthAccount?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput;
		Session?: SessionUncheckedCreateNestedManyWithoutUserInput;
		ApiKey?: ApiKeyUncheckedCreateNestedManyWithoutUserInput;
	};

	export type UserUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		OAuthAccount?: OAuthAccountUpdateManyWithoutUserNestedInput;
		Session?: SessionUpdateManyWithoutUserNestedInput;
		Employee?: EmployeeUpdateOneWithoutUserNestedInput;
		ApiKey?: ApiKeyUpdateManyWithoutUserNestedInput;
	};

	export type UserUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		employeeId?: NullableStringFieldUpdateOperationsInput | string | null;
		OAuthAccount?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput;
		Session?: SessionUncheckedUpdateManyWithoutUserNestedInput;
		ApiKey?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput;
	};

	export type UserCreateManyInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		employeeId?: string | null;
	};

	export type UserUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type UserUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		employeeId?: NullableStringFieldUpdateOperationsInput | string | null;
	};

	export type ApiKeyCreateInput = {
		id?: string;
		name: string;
		key: string;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		lastUsedAt?: Date | string | null;
		User: UserCreateNestedOneWithoutApiKeyInput;
	};

	export type ApiKeyUncheckedCreateInput = {
		id?: string;
		name: string;
		key: string;
		userId: string;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		lastUsedAt?: Date | string | null;
	};

	export type ApiKeyUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		key?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		User?: UserUpdateOneRequiredWithoutApiKeyNestedInput;
	};

	export type ApiKeyUncheckedUpdateInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		key?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
	};

	export type ApiKeyCreateManyInput = {
		id?: string;
		name: string;
		key: string;
		userId: string;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		lastUsedAt?: Date | string | null;
	};

	export type ApiKeyUpdateManyMutationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		key?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
	};

	export type ApiKeyUncheckedUpdateManyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		key?: StringFieldUpdateOperationsInput | string;
		userId?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
	};

	export type StringFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringFilter<$PrismaModel> | string;
	};

	export type StringNullableFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringNullableFilter<$PrismaModel> | string | null;
	};

	export type FloatNullableFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
	};

	export type DateTimeNullableFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
	};

	export type EnumEmployeeStatusFilter<$PrismaModel = never> = {
		equals?: $Enums.EmployeeStatus | EnumEmployeeStatusFieldRefInput<$PrismaModel>;
		in?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>;
		notIn?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumEmployeeStatusFilter<$PrismaModel> | $Enums.EmployeeStatus;
	};

	export type DateTimeFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
	};

	export type TimeLogListRelationFilter = {
		every?: TimeLogWhereInput;
		some?: TimeLogWhereInput;
		none?: TimeLogWhereInput;
	};

	export type UserNullableScalarRelationFilter = {
		is?: UserWhereInput | null;
		isNot?: UserWhereInput | null;
	};

	export type TaskAssignmentListRelationFilter = {
		every?: TaskAssignmentWhereInput;
		some?: TaskAssignmentWhereInput;
		none?: TaskAssignmentWhereInput;
	};

	export type PerformanceMetricListRelationFilter = {
		every?: PerformanceMetricWhereInput;
		some?: PerformanceMetricWhereInput;
		none?: PerformanceMetricWhereInput;
	};

	export type StationNullableScalarRelationFilter = {
		is?: StationWhereInput | null;
		isNot?: StationWhereInput | null;
	};

	export type SortOrderInput = {
		sort: SortOrder;
		nulls?: NullsOrder;
	};

	export type TimeLogOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type TaskAssignmentOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type PerformanceMetricOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type EmployeeCountOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		email?: SortOrder;
		pinHash?: SortOrder;
		lastStationId?: SortOrder;
		dailyHoursLimit?: SortOrder;
		weeklyHoursLimit?: SortOrder;
		employeeCode?: SortOrder;
		phoneNumber?: SortOrder;
		hireDate?: SortOrder;
		status?: SortOrder;
		defaultStationId?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type EmployeeAvgOrderByAggregateInput = {
		dailyHoursLimit?: SortOrder;
		weeklyHoursLimit?: SortOrder;
	};

	export type EmployeeMaxOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		email?: SortOrder;
		pinHash?: SortOrder;
		lastStationId?: SortOrder;
		dailyHoursLimit?: SortOrder;
		weeklyHoursLimit?: SortOrder;
		employeeCode?: SortOrder;
		phoneNumber?: SortOrder;
		hireDate?: SortOrder;
		status?: SortOrder;
		defaultStationId?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type EmployeeMinOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		email?: SortOrder;
		pinHash?: SortOrder;
		lastStationId?: SortOrder;
		dailyHoursLimit?: SortOrder;
		weeklyHoursLimit?: SortOrder;
		employeeCode?: SortOrder;
		phoneNumber?: SortOrder;
		hireDate?: SortOrder;
		status?: SortOrder;
		defaultStationId?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type EmployeeSumOrderByAggregateInput = {
		dailyHoursLimit?: SortOrder;
		weeklyHoursLimit?: SortOrder;
	};

	export type StringWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedStringFilter<$PrismaModel>;
		_max?: NestedStringFilter<$PrismaModel>;
	};

	export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		mode?: QueryMode;
		not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedStringNullableFilter<$PrismaModel>;
		_max?: NestedStringNullableFilter<$PrismaModel>;
	};

	export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_avg?: NestedFloatNullableFilter<$PrismaModel>;
		_sum?: NestedFloatNullableFilter<$PrismaModel>;
		_min?: NestedFloatNullableFilter<$PrismaModel>;
		_max?: NestedFloatNullableFilter<$PrismaModel>;
	};

	export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedDateTimeNullableFilter<$PrismaModel>;
		_max?: NestedDateTimeNullableFilter<$PrismaModel>;
	};

	export type EnumEmployeeStatusWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.EmployeeStatus | EnumEmployeeStatusFieldRefInput<$PrismaModel>;
		in?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>;
		notIn?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumEmployeeStatusWithAggregatesFilter<$PrismaModel> | $Enums.EmployeeStatus;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumEmployeeStatusFilter<$PrismaModel>;
		_max?: NestedEnumEmployeeStatusFilter<$PrismaModel>;
	};

	export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedDateTimeFilter<$PrismaModel>;
		_max?: NestedDateTimeFilter<$PrismaModel>;
	};

	export type UserScalarRelationFilter = {
		is?: UserWhereInput;
		isNot?: UserWhereInput;
	};

	export type OAuthAccountProviderProviderUserIdCompoundUniqueInput = {
		provider: string;
		providerUserId: string;
	};

	export type OAuthAccountCountOrderByAggregateInput = {
		provider?: SortOrder;
		providerUserId?: SortOrder;
		userId?: SortOrder;
		accessToken?: SortOrder;
		refreshToken?: SortOrder;
		expiresAt?: SortOrder;
		scope?: SortOrder;
		tokenType?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type OAuthAccountMaxOrderByAggregateInput = {
		provider?: SortOrder;
		providerUserId?: SortOrder;
		userId?: SortOrder;
		accessToken?: SortOrder;
		refreshToken?: SortOrder;
		expiresAt?: SortOrder;
		scope?: SortOrder;
		tokenType?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type OAuthAccountMinOrderByAggregateInput = {
		provider?: SortOrder;
		providerUserId?: SortOrder;
		userId?: SortOrder;
		accessToken?: SortOrder;
		refreshToken?: SortOrder;
		expiresAt?: SortOrder;
		scope?: SortOrder;
		tokenType?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type SessionCountOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		expiresAt?: SortOrder;
		createdAt?: SortOrder;
	};

	export type SessionMaxOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		expiresAt?: SortOrder;
		createdAt?: SortOrder;
	};

	export type SessionMinOrderByAggregateInput = {
		id?: SortOrder;
		userId?: SortOrder;
		expiresAt?: SortOrder;
		createdAt?: SortOrder;
	};

	export type IntNullableFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntNullableFilter<$PrismaModel> | number | null;
	};

	export type BoolFilter<$PrismaModel = never> = {
		equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
		not?: NestedBoolFilter<$PrismaModel> | boolean;
	};

	export type TaskTypeListRelationFilter = {
		every?: TaskTypeWhereInput;
		some?: TaskTypeWhereInput;
		none?: TaskTypeWhereInput;
	};

	export type EmployeeListRelationFilter = {
		every?: EmployeeWhereInput;
		some?: EmployeeWhereInput;
		none?: EmployeeWhereInput;
	};

	export type TaskTypeOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type EmployeeOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type StationCountOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		description?: SortOrder;
		capacity?: SortOrder;
		isActive?: SortOrder;
		zone?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type StationAvgOrderByAggregateInput = {
		capacity?: SortOrder;
	};

	export type StationMaxOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		description?: SortOrder;
		capacity?: SortOrder;
		isActive?: SortOrder;
		zone?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type StationMinOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		description?: SortOrder;
		capacity?: SortOrder;
		isActive?: SortOrder;
		zone?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type StationSumOrderByAggregateInput = {
		capacity?: SortOrder;
	};

	export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_avg?: NestedFloatNullableFilter<$PrismaModel>;
		_sum?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedIntNullableFilter<$PrismaModel>;
		_max?: NestedIntNullableFilter<$PrismaModel>;
	};

	export type BoolWithAggregatesFilter<$PrismaModel = never> = {
		equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
		not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedBoolFilter<$PrismaModel>;
		_max?: NestedBoolFilter<$PrismaModel>;
	};

	export type EnumTimeLog_typeFilter<$PrismaModel = never> = {
		equals?: $Enums.TimeLog_type | EnumTimeLog_typeFieldRefInput<$PrismaModel>;
		in?: $Enums.TimeLog_type[] | ListEnumTimeLog_typeFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TimeLog_type[] | ListEnumTimeLog_typeFieldRefInput<$PrismaModel>;
		not?: NestedEnumTimeLog_typeFilter<$PrismaModel> | $Enums.TimeLog_type;
	};

	export type EnumClockMethodFilter<$PrismaModel = never> = {
		equals?: $Enums.ClockMethod | EnumClockMethodFieldRefInput<$PrismaModel>;
		in?: $Enums.ClockMethod[] | ListEnumClockMethodFieldRefInput<$PrismaModel>;
		notIn?: $Enums.ClockMethod[] | ListEnumClockMethodFieldRefInput<$PrismaModel>;
		not?: NestedEnumClockMethodFilter<$PrismaModel> | $Enums.ClockMethod;
	};

	export type EmployeeScalarRelationFilter = {
		is?: EmployeeWhereInput;
		isNot?: EmployeeWhereInput;
	};

	export type TaskAssignmentNullableScalarRelationFilter = {
		is?: TaskAssignmentWhereInput | null;
		isNot?: TaskAssignmentWhereInput | null;
	};

	export type TimeLogCountOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		stationId?: SortOrder;
		type?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrder;
		note?: SortOrder;
		deletedAt?: SortOrder;
		correctedBy?: SortOrder;
		taskId?: SortOrder;
		clockMethod?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TimeLogMaxOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		stationId?: SortOrder;
		type?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrder;
		note?: SortOrder;
		deletedAt?: SortOrder;
		correctedBy?: SortOrder;
		taskId?: SortOrder;
		clockMethod?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TimeLogMinOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		stationId?: SortOrder;
		type?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrder;
		note?: SortOrder;
		deletedAt?: SortOrder;
		correctedBy?: SortOrder;
		taskId?: SortOrder;
		clockMethod?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type EnumTimeLog_typeWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.TimeLog_type | EnumTimeLog_typeFieldRefInput<$PrismaModel>;
		in?: $Enums.TimeLog_type[] | ListEnumTimeLog_typeFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TimeLog_type[] | ListEnumTimeLog_typeFieldRefInput<$PrismaModel>;
		not?: NestedEnumTimeLog_typeWithAggregatesFilter<$PrismaModel> | $Enums.TimeLog_type;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumTimeLog_typeFilter<$PrismaModel>;
		_max?: NestedEnumTimeLog_typeFilter<$PrismaModel>;
	};

	export type EnumClockMethodWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.ClockMethod | EnumClockMethodFieldRefInput<$PrismaModel>;
		in?: $Enums.ClockMethod[] | ListEnumClockMethodFieldRefInput<$PrismaModel>;
		notIn?: $Enums.ClockMethod[] | ListEnumClockMethodFieldRefInput<$PrismaModel>;
		not?: NestedEnumClockMethodWithAggregatesFilter<$PrismaModel> | $Enums.ClockMethod;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumClockMethodFilter<$PrismaModel>;
		_max?: NestedEnumClockMethodFilter<$PrismaModel>;
	};

	export type StationScalarRelationFilter = {
		is?: StationWhereInput;
		isNot?: StationWhereInput;
	};

	export type TaskTypeCountOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		stationId?: SortOrder;
		description?: SortOrder;
		estimatedMinutesPerUnit?: SortOrder;
		isActive?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TaskTypeAvgOrderByAggregateInput = {
		estimatedMinutesPerUnit?: SortOrder;
	};

	export type TaskTypeMaxOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		stationId?: SortOrder;
		description?: SortOrder;
		estimatedMinutesPerUnit?: SortOrder;
		isActive?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TaskTypeMinOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		stationId?: SortOrder;
		description?: SortOrder;
		estimatedMinutesPerUnit?: SortOrder;
		isActive?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TaskTypeSumOrderByAggregateInput = {
		estimatedMinutesPerUnit?: SortOrder;
	};

	export type TaskTypeScalarRelationFilter = {
		is?: TaskTypeWhereInput;
		isNot?: TaskTypeWhereInput;
	};

	export type TaskAssignmentCountOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		taskTypeId?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrder;
		unitsCompleted?: SortOrder;
		notes?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TaskAssignmentAvgOrderByAggregateInput = {
		unitsCompleted?: SortOrder;
	};

	export type TaskAssignmentMaxOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		taskTypeId?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrder;
		unitsCompleted?: SortOrder;
		notes?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TaskAssignmentMinOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		taskTypeId?: SortOrder;
		startTime?: SortOrder;
		endTime?: SortOrder;
		unitsCompleted?: SortOrder;
		notes?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TaskAssignmentSumOrderByAggregateInput = {
		unitsCompleted?: SortOrder;
	};

	export type FloatFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatFilter<$PrismaModel> | number;
	};

	export type PerformanceMetricEmployeeIdDateStationIdCompoundUniqueInput = {
		employeeId: string;
		date: Date | string;
		stationId: string;
	};

	export type PerformanceMetricCountOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		date?: SortOrder;
		stationId?: SortOrder;
		hoursWorked?: SortOrder;
		unitsProcessed?: SortOrder;
		efficiency?: SortOrder;
		qualityScore?: SortOrder;
		overtimeHours?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type PerformanceMetricAvgOrderByAggregateInput = {
		hoursWorked?: SortOrder;
		unitsProcessed?: SortOrder;
		efficiency?: SortOrder;
		qualityScore?: SortOrder;
		overtimeHours?: SortOrder;
	};

	export type PerformanceMetricMaxOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		date?: SortOrder;
		stationId?: SortOrder;
		hoursWorked?: SortOrder;
		unitsProcessed?: SortOrder;
		efficiency?: SortOrder;
		qualityScore?: SortOrder;
		overtimeHours?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type PerformanceMetricMinOrderByAggregateInput = {
		id?: SortOrder;
		employeeId?: SortOrder;
		date?: SortOrder;
		stationId?: SortOrder;
		hoursWorked?: SortOrder;
		unitsProcessed?: SortOrder;
		efficiency?: SortOrder;
		qualityScore?: SortOrder;
		overtimeHours?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type PerformanceMetricSumOrderByAggregateInput = {
		hoursWorked?: SortOrder;
		unitsProcessed?: SortOrder;
		efficiency?: SortOrder;
		qualityScore?: SortOrder;
		overtimeHours?: SortOrder;
	};

	export type FloatWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
		_count?: NestedIntFilter<$PrismaModel>;
		_avg?: NestedFloatFilter<$PrismaModel>;
		_sum?: NestedFloatFilter<$PrismaModel>;
		_min?: NestedFloatFilter<$PrismaModel>;
		_max?: NestedFloatFilter<$PrismaModel>;
	};

	export type TodoCountOrderByAggregateInput = {
		id?: SortOrder;
		title?: SortOrder;
		completed?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TodoMaxOrderByAggregateInput = {
		id?: SortOrder;
		title?: SortOrder;
		completed?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type TodoMinOrderByAggregateInput = {
		id?: SortOrder;
		title?: SortOrder;
		completed?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
	};

	export type EnumUser_roleFilter<$PrismaModel = never> = {
		equals?: $Enums.User_role | EnumUser_roleFieldRefInput<$PrismaModel>;
		in?: $Enums.User_role[] | ListEnumUser_roleFieldRefInput<$PrismaModel>;
		notIn?: $Enums.User_role[] | ListEnumUser_roleFieldRefInput<$PrismaModel>;
		not?: NestedEnumUser_roleFilter<$PrismaModel> | $Enums.User_role;
	};

	export type OAuthAccountListRelationFilter = {
		every?: OAuthAccountWhereInput;
		some?: OAuthAccountWhereInput;
		none?: OAuthAccountWhereInput;
	};

	export type SessionListRelationFilter = {
		every?: SessionWhereInput;
		some?: SessionWhereInput;
		none?: SessionWhereInput;
	};

	export type EmployeeNullableScalarRelationFilter = {
		is?: EmployeeWhereInput | null;
		isNot?: EmployeeWhereInput | null;
	};

	export type ApiKeyListRelationFilter = {
		every?: ApiKeyWhereInput;
		some?: ApiKeyWhereInput;
		none?: ApiKeyWhereInput;
	};

	export type OAuthAccountOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type SessionOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type ApiKeyOrderByRelationAggregateInput = {
		_count?: SortOrder;
	};

	export type UserCountOrderByAggregateInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrder;
		image?: SortOrder;
		role?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		employeeId?: SortOrder;
	};

	export type UserMaxOrderByAggregateInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrder;
		image?: SortOrder;
		role?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		employeeId?: SortOrder;
	};

	export type UserMinOrderByAggregateInput = {
		id?: SortOrder;
		email?: SortOrder;
		name?: SortOrder;
		image?: SortOrder;
		role?: SortOrder;
		createdAt?: SortOrder;
		updatedAt?: SortOrder;
		employeeId?: SortOrder;
	};

	export type EnumUser_roleWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.User_role | EnumUser_roleFieldRefInput<$PrismaModel>;
		in?: $Enums.User_role[] | ListEnumUser_roleFieldRefInput<$PrismaModel>;
		notIn?: $Enums.User_role[] | ListEnumUser_roleFieldRefInput<$PrismaModel>;
		not?: NestedEnumUser_roleWithAggregatesFilter<$PrismaModel> | $Enums.User_role;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumUser_roleFilter<$PrismaModel>;
		_max?: NestedEnumUser_roleFilter<$PrismaModel>;
	};

	export type ApiKeyCountOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		key?: SortOrder;
		userId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		lastUsedAt?: SortOrder;
	};

	export type ApiKeyMaxOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		key?: SortOrder;
		userId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		lastUsedAt?: SortOrder;
	};

	export type ApiKeyMinOrderByAggregateInput = {
		id?: SortOrder;
		name?: SortOrder;
		key?: SortOrder;
		userId?: SortOrder;
		createdAt?: SortOrder;
		expiresAt?: SortOrder;
		lastUsedAt?: SortOrder;
	};

	export type TimeLogCreateNestedManyWithoutEmployeeInput = {
		create?:
			| XOR<TimeLogCreateWithoutEmployeeInput, TimeLogUncheckedCreateWithoutEmployeeInput>
			| TimeLogCreateWithoutEmployeeInput[]
			| TimeLogUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutEmployeeInput
			| TimeLogCreateOrConnectWithoutEmployeeInput[];
		createMany?: TimeLogCreateManyEmployeeInputEnvelope;
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
	};

	export type UserCreateNestedOneWithoutEmployeeInput = {
		create?: XOR<UserCreateWithoutEmployeeInput, UserUncheckedCreateWithoutEmployeeInput>;
		connectOrCreate?: UserCreateOrConnectWithoutEmployeeInput;
		connect?: UserWhereUniqueInput;
	};

	export type TaskAssignmentCreateNestedManyWithoutEmployeeInput = {
		create?:
			| XOR<
					TaskAssignmentCreateWithoutEmployeeInput,
					TaskAssignmentUncheckedCreateWithoutEmployeeInput
			  >
			| TaskAssignmentCreateWithoutEmployeeInput[]
			| TaskAssignmentUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| TaskAssignmentCreateOrConnectWithoutEmployeeInput
			| TaskAssignmentCreateOrConnectWithoutEmployeeInput[];
		createMany?: TaskAssignmentCreateManyEmployeeInputEnvelope;
		connect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
	};

	export type PerformanceMetricCreateNestedManyWithoutEmployeeInput = {
		create?:
			| XOR<
					PerformanceMetricCreateWithoutEmployeeInput,
					PerformanceMetricUncheckedCreateWithoutEmployeeInput
			  >
			| PerformanceMetricCreateWithoutEmployeeInput[]
			| PerformanceMetricUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| PerformanceMetricCreateOrConnectWithoutEmployeeInput
			| PerformanceMetricCreateOrConnectWithoutEmployeeInput[];
		createMany?: PerformanceMetricCreateManyEmployeeInputEnvelope;
		connect?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
	};

	export type StationCreateNestedOneWithoutEmployeesWithDefaultInput = {
		create?: XOR<
			StationCreateWithoutEmployeesWithDefaultInput,
			StationUncheckedCreateWithoutEmployeesWithDefaultInput
		>;
		connectOrCreate?: StationCreateOrConnectWithoutEmployeesWithDefaultInput;
		connect?: StationWhereUniqueInput;
	};

	export type StationCreateNestedOneWithoutEmployeesAtLastStationInput = {
		create?: XOR<
			StationCreateWithoutEmployeesAtLastStationInput,
			StationUncheckedCreateWithoutEmployeesAtLastStationInput
		>;
		connectOrCreate?: StationCreateOrConnectWithoutEmployeesAtLastStationInput;
		connect?: StationWhereUniqueInput;
	};

	export type TimeLogUncheckedCreateNestedManyWithoutEmployeeInput = {
		create?:
			| XOR<TimeLogCreateWithoutEmployeeInput, TimeLogUncheckedCreateWithoutEmployeeInput>
			| TimeLogCreateWithoutEmployeeInput[]
			| TimeLogUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutEmployeeInput
			| TimeLogCreateOrConnectWithoutEmployeeInput[];
		createMany?: TimeLogCreateManyEmployeeInputEnvelope;
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
	};

	export type UserUncheckedCreateNestedOneWithoutEmployeeInput = {
		create?: XOR<UserCreateWithoutEmployeeInput, UserUncheckedCreateWithoutEmployeeInput>;
		connectOrCreate?: UserCreateOrConnectWithoutEmployeeInput;
		connect?: UserWhereUniqueInput;
	};

	export type TaskAssignmentUncheckedCreateNestedManyWithoutEmployeeInput = {
		create?:
			| XOR<
					TaskAssignmentCreateWithoutEmployeeInput,
					TaskAssignmentUncheckedCreateWithoutEmployeeInput
			  >
			| TaskAssignmentCreateWithoutEmployeeInput[]
			| TaskAssignmentUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| TaskAssignmentCreateOrConnectWithoutEmployeeInput
			| TaskAssignmentCreateOrConnectWithoutEmployeeInput[];
		createMany?: TaskAssignmentCreateManyEmployeeInputEnvelope;
		connect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
	};

	export type PerformanceMetricUncheckedCreateNestedManyWithoutEmployeeInput = {
		create?:
			| XOR<
					PerformanceMetricCreateWithoutEmployeeInput,
					PerformanceMetricUncheckedCreateWithoutEmployeeInput
			  >
			| PerformanceMetricCreateWithoutEmployeeInput[]
			| PerformanceMetricUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| PerformanceMetricCreateOrConnectWithoutEmployeeInput
			| PerformanceMetricCreateOrConnectWithoutEmployeeInput[];
		createMany?: PerformanceMetricCreateManyEmployeeInputEnvelope;
		connect?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
	};

	export type StringFieldUpdateOperationsInput = {
		set?: string;
	};

	export type NullableStringFieldUpdateOperationsInput = {
		set?: string | null;
	};

	export type NullableFloatFieldUpdateOperationsInput = {
		set?: number | null;
		increment?: number;
		decrement?: number;
		multiply?: number;
		divide?: number;
	};

	export type NullableDateTimeFieldUpdateOperationsInput = {
		set?: Date | string | null;
	};

	export type EnumEmployeeStatusFieldUpdateOperationsInput = {
		set?: $Enums.EmployeeStatus;
	};

	export type DateTimeFieldUpdateOperationsInput = {
		set?: Date | string;
	};

	export type TimeLogUpdateManyWithoutEmployeeNestedInput = {
		create?:
			| XOR<TimeLogCreateWithoutEmployeeInput, TimeLogUncheckedCreateWithoutEmployeeInput>
			| TimeLogCreateWithoutEmployeeInput[]
			| TimeLogUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutEmployeeInput
			| TimeLogCreateOrConnectWithoutEmployeeInput[];
		upsert?:
			| TimeLogUpsertWithWhereUniqueWithoutEmployeeInput
			| TimeLogUpsertWithWhereUniqueWithoutEmployeeInput[];
		createMany?: TimeLogCreateManyEmployeeInputEnvelope;
		set?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		disconnect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		delete?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		update?:
			| TimeLogUpdateWithWhereUniqueWithoutEmployeeInput
			| TimeLogUpdateWithWhereUniqueWithoutEmployeeInput[];
		updateMany?:
			| TimeLogUpdateManyWithWhereWithoutEmployeeInput
			| TimeLogUpdateManyWithWhereWithoutEmployeeInput[];
		deleteMany?: TimeLogScalarWhereInput | TimeLogScalarWhereInput[];
	};

	export type UserUpdateOneWithoutEmployeeNestedInput = {
		create?: XOR<UserCreateWithoutEmployeeInput, UserUncheckedCreateWithoutEmployeeInput>;
		connectOrCreate?: UserCreateOrConnectWithoutEmployeeInput;
		upsert?: UserUpsertWithoutEmployeeInput;
		disconnect?: UserWhereInput | boolean;
		delete?: UserWhereInput | boolean;
		connect?: UserWhereUniqueInput;
		update?: XOR<
			XOR<UserUpdateToOneWithWhereWithoutEmployeeInput, UserUpdateWithoutEmployeeInput>,
			UserUncheckedUpdateWithoutEmployeeInput
		>;
	};

	export type TaskAssignmentUpdateManyWithoutEmployeeNestedInput = {
		create?:
			| XOR<
					TaskAssignmentCreateWithoutEmployeeInput,
					TaskAssignmentUncheckedCreateWithoutEmployeeInput
			  >
			| TaskAssignmentCreateWithoutEmployeeInput[]
			| TaskAssignmentUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| TaskAssignmentCreateOrConnectWithoutEmployeeInput
			| TaskAssignmentCreateOrConnectWithoutEmployeeInput[];
		upsert?:
			| TaskAssignmentUpsertWithWhereUniqueWithoutEmployeeInput
			| TaskAssignmentUpsertWithWhereUniqueWithoutEmployeeInput[];
		createMany?: TaskAssignmentCreateManyEmployeeInputEnvelope;
		set?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		disconnect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		delete?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		connect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		update?:
			| TaskAssignmentUpdateWithWhereUniqueWithoutEmployeeInput
			| TaskAssignmentUpdateWithWhereUniqueWithoutEmployeeInput[];
		updateMany?:
			| TaskAssignmentUpdateManyWithWhereWithoutEmployeeInput
			| TaskAssignmentUpdateManyWithWhereWithoutEmployeeInput[];
		deleteMany?: TaskAssignmentScalarWhereInput | TaskAssignmentScalarWhereInput[];
	};

	export type PerformanceMetricUpdateManyWithoutEmployeeNestedInput = {
		create?:
			| XOR<
					PerformanceMetricCreateWithoutEmployeeInput,
					PerformanceMetricUncheckedCreateWithoutEmployeeInput
			  >
			| PerformanceMetricCreateWithoutEmployeeInput[]
			| PerformanceMetricUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| PerformanceMetricCreateOrConnectWithoutEmployeeInput
			| PerformanceMetricCreateOrConnectWithoutEmployeeInput[];
		upsert?:
			| PerformanceMetricUpsertWithWhereUniqueWithoutEmployeeInput
			| PerformanceMetricUpsertWithWhereUniqueWithoutEmployeeInput[];
		createMany?: PerformanceMetricCreateManyEmployeeInputEnvelope;
		set?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
		disconnect?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
		delete?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
		connect?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
		update?:
			| PerformanceMetricUpdateWithWhereUniqueWithoutEmployeeInput
			| PerformanceMetricUpdateWithWhereUniqueWithoutEmployeeInput[];
		updateMany?:
			| PerformanceMetricUpdateManyWithWhereWithoutEmployeeInput
			| PerformanceMetricUpdateManyWithWhereWithoutEmployeeInput[];
		deleteMany?: PerformanceMetricScalarWhereInput | PerformanceMetricScalarWhereInput[];
	};

	export type StationUpdateOneWithoutEmployeesWithDefaultNestedInput = {
		create?: XOR<
			StationCreateWithoutEmployeesWithDefaultInput,
			StationUncheckedCreateWithoutEmployeesWithDefaultInput
		>;
		connectOrCreate?: StationCreateOrConnectWithoutEmployeesWithDefaultInput;
		upsert?: StationUpsertWithoutEmployeesWithDefaultInput;
		disconnect?: StationWhereInput | boolean;
		delete?: StationWhereInput | boolean;
		connect?: StationWhereUniqueInput;
		update?: XOR<
			XOR<
				StationUpdateToOneWithWhereWithoutEmployeesWithDefaultInput,
				StationUpdateWithoutEmployeesWithDefaultInput
			>,
			StationUncheckedUpdateWithoutEmployeesWithDefaultInput
		>;
	};

	export type StationUpdateOneWithoutEmployeesAtLastStationNestedInput = {
		create?: XOR<
			StationCreateWithoutEmployeesAtLastStationInput,
			StationUncheckedCreateWithoutEmployeesAtLastStationInput
		>;
		connectOrCreate?: StationCreateOrConnectWithoutEmployeesAtLastStationInput;
		upsert?: StationUpsertWithoutEmployeesAtLastStationInput;
		disconnect?: StationWhereInput | boolean;
		delete?: StationWhereInput | boolean;
		connect?: StationWhereUniqueInput;
		update?: XOR<
			XOR<
				StationUpdateToOneWithWhereWithoutEmployeesAtLastStationInput,
				StationUpdateWithoutEmployeesAtLastStationInput
			>,
			StationUncheckedUpdateWithoutEmployeesAtLastStationInput
		>;
	};

	export type TimeLogUncheckedUpdateManyWithoutEmployeeNestedInput = {
		create?:
			| XOR<TimeLogCreateWithoutEmployeeInput, TimeLogUncheckedCreateWithoutEmployeeInput>
			| TimeLogCreateWithoutEmployeeInput[]
			| TimeLogUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutEmployeeInput
			| TimeLogCreateOrConnectWithoutEmployeeInput[];
		upsert?:
			| TimeLogUpsertWithWhereUniqueWithoutEmployeeInput
			| TimeLogUpsertWithWhereUniqueWithoutEmployeeInput[];
		createMany?: TimeLogCreateManyEmployeeInputEnvelope;
		set?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		disconnect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		delete?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		update?:
			| TimeLogUpdateWithWhereUniqueWithoutEmployeeInput
			| TimeLogUpdateWithWhereUniqueWithoutEmployeeInput[];
		updateMany?:
			| TimeLogUpdateManyWithWhereWithoutEmployeeInput
			| TimeLogUpdateManyWithWhereWithoutEmployeeInput[];
		deleteMany?: TimeLogScalarWhereInput | TimeLogScalarWhereInput[];
	};

	export type UserUncheckedUpdateOneWithoutEmployeeNestedInput = {
		create?: XOR<UserCreateWithoutEmployeeInput, UserUncheckedCreateWithoutEmployeeInput>;
		connectOrCreate?: UserCreateOrConnectWithoutEmployeeInput;
		upsert?: UserUpsertWithoutEmployeeInput;
		disconnect?: UserWhereInput | boolean;
		delete?: UserWhereInput | boolean;
		connect?: UserWhereUniqueInput;
		update?: XOR<
			XOR<UserUpdateToOneWithWhereWithoutEmployeeInput, UserUpdateWithoutEmployeeInput>,
			UserUncheckedUpdateWithoutEmployeeInput
		>;
	};

	export type TaskAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput = {
		create?:
			| XOR<
					TaskAssignmentCreateWithoutEmployeeInput,
					TaskAssignmentUncheckedCreateWithoutEmployeeInput
			  >
			| TaskAssignmentCreateWithoutEmployeeInput[]
			| TaskAssignmentUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| TaskAssignmentCreateOrConnectWithoutEmployeeInput
			| TaskAssignmentCreateOrConnectWithoutEmployeeInput[];
		upsert?:
			| TaskAssignmentUpsertWithWhereUniqueWithoutEmployeeInput
			| TaskAssignmentUpsertWithWhereUniqueWithoutEmployeeInput[];
		createMany?: TaskAssignmentCreateManyEmployeeInputEnvelope;
		set?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		disconnect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		delete?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		connect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		update?:
			| TaskAssignmentUpdateWithWhereUniqueWithoutEmployeeInput
			| TaskAssignmentUpdateWithWhereUniqueWithoutEmployeeInput[];
		updateMany?:
			| TaskAssignmentUpdateManyWithWhereWithoutEmployeeInput
			| TaskAssignmentUpdateManyWithWhereWithoutEmployeeInput[];
		deleteMany?: TaskAssignmentScalarWhereInput | TaskAssignmentScalarWhereInput[];
	};

	export type PerformanceMetricUncheckedUpdateManyWithoutEmployeeNestedInput = {
		create?:
			| XOR<
					PerformanceMetricCreateWithoutEmployeeInput,
					PerformanceMetricUncheckedCreateWithoutEmployeeInput
			  >
			| PerformanceMetricCreateWithoutEmployeeInput[]
			| PerformanceMetricUncheckedCreateWithoutEmployeeInput[];
		connectOrCreate?:
			| PerformanceMetricCreateOrConnectWithoutEmployeeInput
			| PerformanceMetricCreateOrConnectWithoutEmployeeInput[];
		upsert?:
			| PerformanceMetricUpsertWithWhereUniqueWithoutEmployeeInput
			| PerformanceMetricUpsertWithWhereUniqueWithoutEmployeeInput[];
		createMany?: PerformanceMetricCreateManyEmployeeInputEnvelope;
		set?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
		disconnect?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
		delete?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
		connect?: PerformanceMetricWhereUniqueInput | PerformanceMetricWhereUniqueInput[];
		update?:
			| PerformanceMetricUpdateWithWhereUniqueWithoutEmployeeInput
			| PerformanceMetricUpdateWithWhereUniqueWithoutEmployeeInput[];
		updateMany?:
			| PerformanceMetricUpdateManyWithWhereWithoutEmployeeInput
			| PerformanceMetricUpdateManyWithWhereWithoutEmployeeInput[];
		deleteMany?: PerformanceMetricScalarWhereInput | PerformanceMetricScalarWhereInput[];
	};

	export type UserCreateNestedOneWithoutOAuthAccountInput = {
		create?: XOR<UserCreateWithoutOAuthAccountInput, UserUncheckedCreateWithoutOAuthAccountInput>;
		connectOrCreate?: UserCreateOrConnectWithoutOAuthAccountInput;
		connect?: UserWhereUniqueInput;
	};

	export type UserUpdateOneRequiredWithoutOAuthAccountNestedInput = {
		create?: XOR<UserCreateWithoutOAuthAccountInput, UserUncheckedCreateWithoutOAuthAccountInput>;
		connectOrCreate?: UserCreateOrConnectWithoutOAuthAccountInput;
		upsert?: UserUpsertWithoutOAuthAccountInput;
		connect?: UserWhereUniqueInput;
		update?: XOR<
			XOR<UserUpdateToOneWithWhereWithoutOAuthAccountInput, UserUpdateWithoutOAuthAccountInput>,
			UserUncheckedUpdateWithoutOAuthAccountInput
		>;
	};

	export type UserCreateNestedOneWithoutSessionInput = {
		create?: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput>;
		connectOrCreate?: UserCreateOrConnectWithoutSessionInput;
		connect?: UserWhereUniqueInput;
	};

	export type UserUpdateOneRequiredWithoutSessionNestedInput = {
		create?: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput>;
		connectOrCreate?: UserCreateOrConnectWithoutSessionInput;
		upsert?: UserUpsertWithoutSessionInput;
		connect?: UserWhereUniqueInput;
		update?: XOR<
			XOR<UserUpdateToOneWithWhereWithoutSessionInput, UserUpdateWithoutSessionInput>,
			UserUncheckedUpdateWithoutSessionInput
		>;
	};

	export type TimeLogCreateNestedManyWithoutStationInput = {
		create?:
			| XOR<TimeLogCreateWithoutStationInput, TimeLogUncheckedCreateWithoutStationInput>
			| TimeLogCreateWithoutStationInput[]
			| TimeLogUncheckedCreateWithoutStationInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutStationInput
			| TimeLogCreateOrConnectWithoutStationInput[];
		createMany?: TimeLogCreateManyStationInputEnvelope;
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
	};

	export type TaskTypeCreateNestedManyWithoutStationInput = {
		create?:
			| XOR<TaskTypeCreateWithoutStationInput, TaskTypeUncheckedCreateWithoutStationInput>
			| TaskTypeCreateWithoutStationInput[]
			| TaskTypeUncheckedCreateWithoutStationInput[];
		connectOrCreate?:
			| TaskTypeCreateOrConnectWithoutStationInput
			| TaskTypeCreateOrConnectWithoutStationInput[];
		createMany?: TaskTypeCreateManyStationInputEnvelope;
		connect?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
	};

	export type EmployeeCreateNestedManyWithoutLastStationInput = {
		create?:
			| XOR<EmployeeCreateWithoutLastStationInput, EmployeeUncheckedCreateWithoutLastStationInput>
			| EmployeeCreateWithoutLastStationInput[]
			| EmployeeUncheckedCreateWithoutLastStationInput[];
		connectOrCreate?:
			| EmployeeCreateOrConnectWithoutLastStationInput
			| EmployeeCreateOrConnectWithoutLastStationInput[];
		createMany?: EmployeeCreateManyLastStationInputEnvelope;
		connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
	};

	export type EmployeeCreateNestedManyWithoutDefaultStationInput = {
		create?:
			| XOR<
					EmployeeCreateWithoutDefaultStationInput,
					EmployeeUncheckedCreateWithoutDefaultStationInput
			  >
			| EmployeeCreateWithoutDefaultStationInput[]
			| EmployeeUncheckedCreateWithoutDefaultStationInput[];
		connectOrCreate?:
			| EmployeeCreateOrConnectWithoutDefaultStationInput
			| EmployeeCreateOrConnectWithoutDefaultStationInput[];
		createMany?: EmployeeCreateManyDefaultStationInputEnvelope;
		connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
	};

	export type TimeLogUncheckedCreateNestedManyWithoutStationInput = {
		create?:
			| XOR<TimeLogCreateWithoutStationInput, TimeLogUncheckedCreateWithoutStationInput>
			| TimeLogCreateWithoutStationInput[]
			| TimeLogUncheckedCreateWithoutStationInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutStationInput
			| TimeLogCreateOrConnectWithoutStationInput[];
		createMany?: TimeLogCreateManyStationInputEnvelope;
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
	};

	export type TaskTypeUncheckedCreateNestedManyWithoutStationInput = {
		create?:
			| XOR<TaskTypeCreateWithoutStationInput, TaskTypeUncheckedCreateWithoutStationInput>
			| TaskTypeCreateWithoutStationInput[]
			| TaskTypeUncheckedCreateWithoutStationInput[];
		connectOrCreate?:
			| TaskTypeCreateOrConnectWithoutStationInput
			| TaskTypeCreateOrConnectWithoutStationInput[];
		createMany?: TaskTypeCreateManyStationInputEnvelope;
		connect?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
	};

	export type EmployeeUncheckedCreateNestedManyWithoutLastStationInput = {
		create?:
			| XOR<EmployeeCreateWithoutLastStationInput, EmployeeUncheckedCreateWithoutLastStationInput>
			| EmployeeCreateWithoutLastStationInput[]
			| EmployeeUncheckedCreateWithoutLastStationInput[];
		connectOrCreate?:
			| EmployeeCreateOrConnectWithoutLastStationInput
			| EmployeeCreateOrConnectWithoutLastStationInput[];
		createMany?: EmployeeCreateManyLastStationInputEnvelope;
		connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
	};

	export type EmployeeUncheckedCreateNestedManyWithoutDefaultStationInput = {
		create?:
			| XOR<
					EmployeeCreateWithoutDefaultStationInput,
					EmployeeUncheckedCreateWithoutDefaultStationInput
			  >
			| EmployeeCreateWithoutDefaultStationInput[]
			| EmployeeUncheckedCreateWithoutDefaultStationInput[];
		connectOrCreate?:
			| EmployeeCreateOrConnectWithoutDefaultStationInput
			| EmployeeCreateOrConnectWithoutDefaultStationInput[];
		createMany?: EmployeeCreateManyDefaultStationInputEnvelope;
		connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
	};

	export type NullableIntFieldUpdateOperationsInput = {
		set?: number | null;
		increment?: number;
		decrement?: number;
		multiply?: number;
		divide?: number;
	};

	export type BoolFieldUpdateOperationsInput = {
		set?: boolean;
	};

	export type TimeLogUpdateManyWithoutStationNestedInput = {
		create?:
			| XOR<TimeLogCreateWithoutStationInput, TimeLogUncheckedCreateWithoutStationInput>
			| TimeLogCreateWithoutStationInput[]
			| TimeLogUncheckedCreateWithoutStationInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutStationInput
			| TimeLogCreateOrConnectWithoutStationInput[];
		upsert?:
			| TimeLogUpsertWithWhereUniqueWithoutStationInput
			| TimeLogUpsertWithWhereUniqueWithoutStationInput[];
		createMany?: TimeLogCreateManyStationInputEnvelope;
		set?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		disconnect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		delete?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		update?:
			| TimeLogUpdateWithWhereUniqueWithoutStationInput
			| TimeLogUpdateWithWhereUniqueWithoutStationInput[];
		updateMany?:
			| TimeLogUpdateManyWithWhereWithoutStationInput
			| TimeLogUpdateManyWithWhereWithoutStationInput[];
		deleteMany?: TimeLogScalarWhereInput | TimeLogScalarWhereInput[];
	};

	export type TaskTypeUpdateManyWithoutStationNestedInput = {
		create?:
			| XOR<TaskTypeCreateWithoutStationInput, TaskTypeUncheckedCreateWithoutStationInput>
			| TaskTypeCreateWithoutStationInput[]
			| TaskTypeUncheckedCreateWithoutStationInput[];
		connectOrCreate?:
			| TaskTypeCreateOrConnectWithoutStationInput
			| TaskTypeCreateOrConnectWithoutStationInput[];
		upsert?:
			| TaskTypeUpsertWithWhereUniqueWithoutStationInput
			| TaskTypeUpsertWithWhereUniqueWithoutStationInput[];
		createMany?: TaskTypeCreateManyStationInputEnvelope;
		set?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
		disconnect?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
		delete?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
		connect?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
		update?:
			| TaskTypeUpdateWithWhereUniqueWithoutStationInput
			| TaskTypeUpdateWithWhereUniqueWithoutStationInput[];
		updateMany?:
			| TaskTypeUpdateManyWithWhereWithoutStationInput
			| TaskTypeUpdateManyWithWhereWithoutStationInput[];
		deleteMany?: TaskTypeScalarWhereInput | TaskTypeScalarWhereInput[];
	};

	export type EmployeeUpdateManyWithoutLastStationNestedInput = {
		create?:
			| XOR<EmployeeCreateWithoutLastStationInput, EmployeeUncheckedCreateWithoutLastStationInput>
			| EmployeeCreateWithoutLastStationInput[]
			| EmployeeUncheckedCreateWithoutLastStationInput[];
		connectOrCreate?:
			| EmployeeCreateOrConnectWithoutLastStationInput
			| EmployeeCreateOrConnectWithoutLastStationInput[];
		upsert?:
			| EmployeeUpsertWithWhereUniqueWithoutLastStationInput
			| EmployeeUpsertWithWhereUniqueWithoutLastStationInput[];
		createMany?: EmployeeCreateManyLastStationInputEnvelope;
		set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		update?:
			| EmployeeUpdateWithWhereUniqueWithoutLastStationInput
			| EmployeeUpdateWithWhereUniqueWithoutLastStationInput[];
		updateMany?:
			| EmployeeUpdateManyWithWhereWithoutLastStationInput
			| EmployeeUpdateManyWithWhereWithoutLastStationInput[];
		deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[];
	};

	export type EmployeeUpdateManyWithoutDefaultStationNestedInput = {
		create?:
			| XOR<
					EmployeeCreateWithoutDefaultStationInput,
					EmployeeUncheckedCreateWithoutDefaultStationInput
			  >
			| EmployeeCreateWithoutDefaultStationInput[]
			| EmployeeUncheckedCreateWithoutDefaultStationInput[];
		connectOrCreate?:
			| EmployeeCreateOrConnectWithoutDefaultStationInput
			| EmployeeCreateOrConnectWithoutDefaultStationInput[];
		upsert?:
			| EmployeeUpsertWithWhereUniqueWithoutDefaultStationInput
			| EmployeeUpsertWithWhereUniqueWithoutDefaultStationInput[];
		createMany?: EmployeeCreateManyDefaultStationInputEnvelope;
		set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		update?:
			| EmployeeUpdateWithWhereUniqueWithoutDefaultStationInput
			| EmployeeUpdateWithWhereUniqueWithoutDefaultStationInput[];
		updateMany?:
			| EmployeeUpdateManyWithWhereWithoutDefaultStationInput
			| EmployeeUpdateManyWithWhereWithoutDefaultStationInput[];
		deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[];
	};

	export type TimeLogUncheckedUpdateManyWithoutStationNestedInput = {
		create?:
			| XOR<TimeLogCreateWithoutStationInput, TimeLogUncheckedCreateWithoutStationInput>
			| TimeLogCreateWithoutStationInput[]
			| TimeLogUncheckedCreateWithoutStationInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutStationInput
			| TimeLogCreateOrConnectWithoutStationInput[];
		upsert?:
			| TimeLogUpsertWithWhereUniqueWithoutStationInput
			| TimeLogUpsertWithWhereUniqueWithoutStationInput[];
		createMany?: TimeLogCreateManyStationInputEnvelope;
		set?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		disconnect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		delete?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		update?:
			| TimeLogUpdateWithWhereUniqueWithoutStationInput
			| TimeLogUpdateWithWhereUniqueWithoutStationInput[];
		updateMany?:
			| TimeLogUpdateManyWithWhereWithoutStationInput
			| TimeLogUpdateManyWithWhereWithoutStationInput[];
		deleteMany?: TimeLogScalarWhereInput | TimeLogScalarWhereInput[];
	};

	export type TaskTypeUncheckedUpdateManyWithoutStationNestedInput = {
		create?:
			| XOR<TaskTypeCreateWithoutStationInput, TaskTypeUncheckedCreateWithoutStationInput>
			| TaskTypeCreateWithoutStationInput[]
			| TaskTypeUncheckedCreateWithoutStationInput[];
		connectOrCreate?:
			| TaskTypeCreateOrConnectWithoutStationInput
			| TaskTypeCreateOrConnectWithoutStationInput[];
		upsert?:
			| TaskTypeUpsertWithWhereUniqueWithoutStationInput
			| TaskTypeUpsertWithWhereUniqueWithoutStationInput[];
		createMany?: TaskTypeCreateManyStationInputEnvelope;
		set?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
		disconnect?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
		delete?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
		connect?: TaskTypeWhereUniqueInput | TaskTypeWhereUniqueInput[];
		update?:
			| TaskTypeUpdateWithWhereUniqueWithoutStationInput
			| TaskTypeUpdateWithWhereUniqueWithoutStationInput[];
		updateMany?:
			| TaskTypeUpdateManyWithWhereWithoutStationInput
			| TaskTypeUpdateManyWithWhereWithoutStationInput[];
		deleteMany?: TaskTypeScalarWhereInput | TaskTypeScalarWhereInput[];
	};

	export type EmployeeUncheckedUpdateManyWithoutLastStationNestedInput = {
		create?:
			| XOR<EmployeeCreateWithoutLastStationInput, EmployeeUncheckedCreateWithoutLastStationInput>
			| EmployeeCreateWithoutLastStationInput[]
			| EmployeeUncheckedCreateWithoutLastStationInput[];
		connectOrCreate?:
			| EmployeeCreateOrConnectWithoutLastStationInput
			| EmployeeCreateOrConnectWithoutLastStationInput[];
		upsert?:
			| EmployeeUpsertWithWhereUniqueWithoutLastStationInput
			| EmployeeUpsertWithWhereUniqueWithoutLastStationInput[];
		createMany?: EmployeeCreateManyLastStationInputEnvelope;
		set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		update?:
			| EmployeeUpdateWithWhereUniqueWithoutLastStationInput
			| EmployeeUpdateWithWhereUniqueWithoutLastStationInput[];
		updateMany?:
			| EmployeeUpdateManyWithWhereWithoutLastStationInput
			| EmployeeUpdateManyWithWhereWithoutLastStationInput[];
		deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[];
	};

	export type EmployeeUncheckedUpdateManyWithoutDefaultStationNestedInput = {
		create?:
			| XOR<
					EmployeeCreateWithoutDefaultStationInput,
					EmployeeUncheckedCreateWithoutDefaultStationInput
			  >
			| EmployeeCreateWithoutDefaultStationInput[]
			| EmployeeUncheckedCreateWithoutDefaultStationInput[];
		connectOrCreate?:
			| EmployeeCreateOrConnectWithoutDefaultStationInput
			| EmployeeCreateOrConnectWithoutDefaultStationInput[];
		upsert?:
			| EmployeeUpsertWithWhereUniqueWithoutDefaultStationInput
			| EmployeeUpsertWithWhereUniqueWithoutDefaultStationInput[];
		createMany?: EmployeeCreateManyDefaultStationInputEnvelope;
		set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[];
		update?:
			| EmployeeUpdateWithWhereUniqueWithoutDefaultStationInput
			| EmployeeUpdateWithWhereUniqueWithoutDefaultStationInput[];
		updateMany?:
			| EmployeeUpdateManyWithWhereWithoutDefaultStationInput
			| EmployeeUpdateManyWithWhereWithoutDefaultStationInput[];
		deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[];
	};

	export type EmployeeCreateNestedOneWithoutTimeLogInput = {
		create?: XOR<EmployeeCreateWithoutTimeLogInput, EmployeeUncheckedCreateWithoutTimeLogInput>;
		connectOrCreate?: EmployeeCreateOrConnectWithoutTimeLogInput;
		connect?: EmployeeWhereUniqueInput;
	};

	export type StationCreateNestedOneWithoutTimeLogInput = {
		create?: XOR<StationCreateWithoutTimeLogInput, StationUncheckedCreateWithoutTimeLogInput>;
		connectOrCreate?: StationCreateOrConnectWithoutTimeLogInput;
		connect?: StationWhereUniqueInput;
	};

	export type TaskAssignmentCreateNestedOneWithoutTimeLogsInput = {
		create?: XOR<
			TaskAssignmentCreateWithoutTimeLogsInput,
			TaskAssignmentUncheckedCreateWithoutTimeLogsInput
		>;
		connectOrCreate?: TaskAssignmentCreateOrConnectWithoutTimeLogsInput;
		connect?: TaskAssignmentWhereUniqueInput;
	};

	export type EnumTimeLog_typeFieldUpdateOperationsInput = {
		set?: $Enums.TimeLog_type;
	};

	export type EnumClockMethodFieldUpdateOperationsInput = {
		set?: $Enums.ClockMethod;
	};

	export type EmployeeUpdateOneRequiredWithoutTimeLogNestedInput = {
		create?: XOR<EmployeeCreateWithoutTimeLogInput, EmployeeUncheckedCreateWithoutTimeLogInput>;
		connectOrCreate?: EmployeeCreateOrConnectWithoutTimeLogInput;
		upsert?: EmployeeUpsertWithoutTimeLogInput;
		connect?: EmployeeWhereUniqueInput;
		update?: XOR<
			XOR<EmployeeUpdateToOneWithWhereWithoutTimeLogInput, EmployeeUpdateWithoutTimeLogInput>,
			EmployeeUncheckedUpdateWithoutTimeLogInput
		>;
	};

	export type StationUpdateOneWithoutTimeLogNestedInput = {
		create?: XOR<StationCreateWithoutTimeLogInput, StationUncheckedCreateWithoutTimeLogInput>;
		connectOrCreate?: StationCreateOrConnectWithoutTimeLogInput;
		upsert?: StationUpsertWithoutTimeLogInput;
		disconnect?: StationWhereInput | boolean;
		delete?: StationWhereInput | boolean;
		connect?: StationWhereUniqueInput;
		update?: XOR<
			XOR<StationUpdateToOneWithWhereWithoutTimeLogInput, StationUpdateWithoutTimeLogInput>,
			StationUncheckedUpdateWithoutTimeLogInput
		>;
	};

	export type TaskAssignmentUpdateOneWithoutTimeLogsNestedInput = {
		create?: XOR<
			TaskAssignmentCreateWithoutTimeLogsInput,
			TaskAssignmentUncheckedCreateWithoutTimeLogsInput
		>;
		connectOrCreate?: TaskAssignmentCreateOrConnectWithoutTimeLogsInput;
		upsert?: TaskAssignmentUpsertWithoutTimeLogsInput;
		disconnect?: TaskAssignmentWhereInput | boolean;
		delete?: TaskAssignmentWhereInput | boolean;
		connect?: TaskAssignmentWhereUniqueInput;
		update?: XOR<
			XOR<
				TaskAssignmentUpdateToOneWithWhereWithoutTimeLogsInput,
				TaskAssignmentUpdateWithoutTimeLogsInput
			>,
			TaskAssignmentUncheckedUpdateWithoutTimeLogsInput
		>;
	};

	export type StationCreateNestedOneWithoutTaskTypeInput = {
		create?: XOR<StationCreateWithoutTaskTypeInput, StationUncheckedCreateWithoutTaskTypeInput>;
		connectOrCreate?: StationCreateOrConnectWithoutTaskTypeInput;
		connect?: StationWhereUniqueInput;
	};

	export type TaskAssignmentCreateNestedManyWithoutTaskTypeInput = {
		create?:
			| XOR<
					TaskAssignmentCreateWithoutTaskTypeInput,
					TaskAssignmentUncheckedCreateWithoutTaskTypeInput
			  >
			| TaskAssignmentCreateWithoutTaskTypeInput[]
			| TaskAssignmentUncheckedCreateWithoutTaskTypeInput[];
		connectOrCreate?:
			| TaskAssignmentCreateOrConnectWithoutTaskTypeInput
			| TaskAssignmentCreateOrConnectWithoutTaskTypeInput[];
		createMany?: TaskAssignmentCreateManyTaskTypeInputEnvelope;
		connect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
	};

	export type TaskAssignmentUncheckedCreateNestedManyWithoutTaskTypeInput = {
		create?:
			| XOR<
					TaskAssignmentCreateWithoutTaskTypeInput,
					TaskAssignmentUncheckedCreateWithoutTaskTypeInput
			  >
			| TaskAssignmentCreateWithoutTaskTypeInput[]
			| TaskAssignmentUncheckedCreateWithoutTaskTypeInput[];
		connectOrCreate?:
			| TaskAssignmentCreateOrConnectWithoutTaskTypeInput
			| TaskAssignmentCreateOrConnectWithoutTaskTypeInput[];
		createMany?: TaskAssignmentCreateManyTaskTypeInputEnvelope;
		connect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
	};

	export type StationUpdateOneRequiredWithoutTaskTypeNestedInput = {
		create?: XOR<StationCreateWithoutTaskTypeInput, StationUncheckedCreateWithoutTaskTypeInput>;
		connectOrCreate?: StationCreateOrConnectWithoutTaskTypeInput;
		upsert?: StationUpsertWithoutTaskTypeInput;
		connect?: StationWhereUniqueInput;
		update?: XOR<
			XOR<StationUpdateToOneWithWhereWithoutTaskTypeInput, StationUpdateWithoutTaskTypeInput>,
			StationUncheckedUpdateWithoutTaskTypeInput
		>;
	};

	export type TaskAssignmentUpdateManyWithoutTaskTypeNestedInput = {
		create?:
			| XOR<
					TaskAssignmentCreateWithoutTaskTypeInput,
					TaskAssignmentUncheckedCreateWithoutTaskTypeInput
			  >
			| TaskAssignmentCreateWithoutTaskTypeInput[]
			| TaskAssignmentUncheckedCreateWithoutTaskTypeInput[];
		connectOrCreate?:
			| TaskAssignmentCreateOrConnectWithoutTaskTypeInput
			| TaskAssignmentCreateOrConnectWithoutTaskTypeInput[];
		upsert?:
			| TaskAssignmentUpsertWithWhereUniqueWithoutTaskTypeInput
			| TaskAssignmentUpsertWithWhereUniqueWithoutTaskTypeInput[];
		createMany?: TaskAssignmentCreateManyTaskTypeInputEnvelope;
		set?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		disconnect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		delete?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		connect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		update?:
			| TaskAssignmentUpdateWithWhereUniqueWithoutTaskTypeInput
			| TaskAssignmentUpdateWithWhereUniqueWithoutTaskTypeInput[];
		updateMany?:
			| TaskAssignmentUpdateManyWithWhereWithoutTaskTypeInput
			| TaskAssignmentUpdateManyWithWhereWithoutTaskTypeInput[];
		deleteMany?: TaskAssignmentScalarWhereInput | TaskAssignmentScalarWhereInput[];
	};

	export type TaskAssignmentUncheckedUpdateManyWithoutTaskTypeNestedInput = {
		create?:
			| XOR<
					TaskAssignmentCreateWithoutTaskTypeInput,
					TaskAssignmentUncheckedCreateWithoutTaskTypeInput
			  >
			| TaskAssignmentCreateWithoutTaskTypeInput[]
			| TaskAssignmentUncheckedCreateWithoutTaskTypeInput[];
		connectOrCreate?:
			| TaskAssignmentCreateOrConnectWithoutTaskTypeInput
			| TaskAssignmentCreateOrConnectWithoutTaskTypeInput[];
		upsert?:
			| TaskAssignmentUpsertWithWhereUniqueWithoutTaskTypeInput
			| TaskAssignmentUpsertWithWhereUniqueWithoutTaskTypeInput[];
		createMany?: TaskAssignmentCreateManyTaskTypeInputEnvelope;
		set?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		disconnect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		delete?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		connect?: TaskAssignmentWhereUniqueInput | TaskAssignmentWhereUniqueInput[];
		update?:
			| TaskAssignmentUpdateWithWhereUniqueWithoutTaskTypeInput
			| TaskAssignmentUpdateWithWhereUniqueWithoutTaskTypeInput[];
		updateMany?:
			| TaskAssignmentUpdateManyWithWhereWithoutTaskTypeInput
			| TaskAssignmentUpdateManyWithWhereWithoutTaskTypeInput[];
		deleteMany?: TaskAssignmentScalarWhereInput | TaskAssignmentScalarWhereInput[];
	};

	export type EmployeeCreateNestedOneWithoutTaskAssignmentInput = {
		create?: XOR<
			EmployeeCreateWithoutTaskAssignmentInput,
			EmployeeUncheckedCreateWithoutTaskAssignmentInput
		>;
		connectOrCreate?: EmployeeCreateOrConnectWithoutTaskAssignmentInput;
		connect?: EmployeeWhereUniqueInput;
	};

	export type TaskTypeCreateNestedOneWithoutTaskAssignmentInput = {
		create?: XOR<
			TaskTypeCreateWithoutTaskAssignmentInput,
			TaskTypeUncheckedCreateWithoutTaskAssignmentInput
		>;
		connectOrCreate?: TaskTypeCreateOrConnectWithoutTaskAssignmentInput;
		connect?: TaskTypeWhereUniqueInput;
	};

	export type TimeLogCreateNestedManyWithoutTaskInput = {
		create?:
			| XOR<TimeLogCreateWithoutTaskInput, TimeLogUncheckedCreateWithoutTaskInput>
			| TimeLogCreateWithoutTaskInput[]
			| TimeLogUncheckedCreateWithoutTaskInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutTaskInput
			| TimeLogCreateOrConnectWithoutTaskInput[];
		createMany?: TimeLogCreateManyTaskInputEnvelope;
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
	};

	export type TimeLogUncheckedCreateNestedManyWithoutTaskInput = {
		create?:
			| XOR<TimeLogCreateWithoutTaskInput, TimeLogUncheckedCreateWithoutTaskInput>
			| TimeLogCreateWithoutTaskInput[]
			| TimeLogUncheckedCreateWithoutTaskInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutTaskInput
			| TimeLogCreateOrConnectWithoutTaskInput[];
		createMany?: TimeLogCreateManyTaskInputEnvelope;
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
	};

	export type EmployeeUpdateOneRequiredWithoutTaskAssignmentNestedInput = {
		create?: XOR<
			EmployeeCreateWithoutTaskAssignmentInput,
			EmployeeUncheckedCreateWithoutTaskAssignmentInput
		>;
		connectOrCreate?: EmployeeCreateOrConnectWithoutTaskAssignmentInput;
		upsert?: EmployeeUpsertWithoutTaskAssignmentInput;
		connect?: EmployeeWhereUniqueInput;
		update?: XOR<
			XOR<
				EmployeeUpdateToOneWithWhereWithoutTaskAssignmentInput,
				EmployeeUpdateWithoutTaskAssignmentInput
			>,
			EmployeeUncheckedUpdateWithoutTaskAssignmentInput
		>;
	};

	export type TaskTypeUpdateOneRequiredWithoutTaskAssignmentNestedInput = {
		create?: XOR<
			TaskTypeCreateWithoutTaskAssignmentInput,
			TaskTypeUncheckedCreateWithoutTaskAssignmentInput
		>;
		connectOrCreate?: TaskTypeCreateOrConnectWithoutTaskAssignmentInput;
		upsert?: TaskTypeUpsertWithoutTaskAssignmentInput;
		connect?: TaskTypeWhereUniqueInput;
		update?: XOR<
			XOR<
				TaskTypeUpdateToOneWithWhereWithoutTaskAssignmentInput,
				TaskTypeUpdateWithoutTaskAssignmentInput
			>,
			TaskTypeUncheckedUpdateWithoutTaskAssignmentInput
		>;
	};

	export type TimeLogUpdateManyWithoutTaskNestedInput = {
		create?:
			| XOR<TimeLogCreateWithoutTaskInput, TimeLogUncheckedCreateWithoutTaskInput>
			| TimeLogCreateWithoutTaskInput[]
			| TimeLogUncheckedCreateWithoutTaskInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutTaskInput
			| TimeLogCreateOrConnectWithoutTaskInput[];
		upsert?:
			| TimeLogUpsertWithWhereUniqueWithoutTaskInput
			| TimeLogUpsertWithWhereUniqueWithoutTaskInput[];
		createMany?: TimeLogCreateManyTaskInputEnvelope;
		set?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		disconnect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		delete?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		update?:
			| TimeLogUpdateWithWhereUniqueWithoutTaskInput
			| TimeLogUpdateWithWhereUniqueWithoutTaskInput[];
		updateMany?:
			| TimeLogUpdateManyWithWhereWithoutTaskInput
			| TimeLogUpdateManyWithWhereWithoutTaskInput[];
		deleteMany?: TimeLogScalarWhereInput | TimeLogScalarWhereInput[];
	};

	export type TimeLogUncheckedUpdateManyWithoutTaskNestedInput = {
		create?:
			| XOR<TimeLogCreateWithoutTaskInput, TimeLogUncheckedCreateWithoutTaskInput>
			| TimeLogCreateWithoutTaskInput[]
			| TimeLogUncheckedCreateWithoutTaskInput[];
		connectOrCreate?:
			| TimeLogCreateOrConnectWithoutTaskInput
			| TimeLogCreateOrConnectWithoutTaskInput[];
		upsert?:
			| TimeLogUpsertWithWhereUniqueWithoutTaskInput
			| TimeLogUpsertWithWhereUniqueWithoutTaskInput[];
		createMany?: TimeLogCreateManyTaskInputEnvelope;
		set?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		disconnect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		delete?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		connect?: TimeLogWhereUniqueInput | TimeLogWhereUniqueInput[];
		update?:
			| TimeLogUpdateWithWhereUniqueWithoutTaskInput
			| TimeLogUpdateWithWhereUniqueWithoutTaskInput[];
		updateMany?:
			| TimeLogUpdateManyWithWhereWithoutTaskInput
			| TimeLogUpdateManyWithWhereWithoutTaskInput[];
		deleteMany?: TimeLogScalarWhereInput | TimeLogScalarWhereInput[];
	};

	export type EmployeeCreateNestedOneWithoutPerformanceMetricInput = {
		create?: XOR<
			EmployeeCreateWithoutPerformanceMetricInput,
			EmployeeUncheckedCreateWithoutPerformanceMetricInput
		>;
		connectOrCreate?: EmployeeCreateOrConnectWithoutPerformanceMetricInput;
		connect?: EmployeeWhereUniqueInput;
	};

	export type FloatFieldUpdateOperationsInput = {
		set?: number;
		increment?: number;
		decrement?: number;
		multiply?: number;
		divide?: number;
	};

	export type EmployeeUpdateOneRequiredWithoutPerformanceMetricNestedInput = {
		create?: XOR<
			EmployeeCreateWithoutPerformanceMetricInput,
			EmployeeUncheckedCreateWithoutPerformanceMetricInput
		>;
		connectOrCreate?: EmployeeCreateOrConnectWithoutPerformanceMetricInput;
		upsert?: EmployeeUpsertWithoutPerformanceMetricInput;
		connect?: EmployeeWhereUniqueInput;
		update?: XOR<
			XOR<
				EmployeeUpdateToOneWithWhereWithoutPerformanceMetricInput,
				EmployeeUpdateWithoutPerformanceMetricInput
			>,
			EmployeeUncheckedUpdateWithoutPerformanceMetricInput
		>;
	};

	export type OAuthAccountCreateNestedManyWithoutUserInput = {
		create?:
			| XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>
			| OAuthAccountCreateWithoutUserInput[]
			| OAuthAccountUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| OAuthAccountCreateOrConnectWithoutUserInput
			| OAuthAccountCreateOrConnectWithoutUserInput[];
		createMany?: OAuthAccountCreateManyUserInputEnvelope;
		connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
	};

	export type SessionCreateNestedManyWithoutUserInput = {
		create?:
			| XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
			| SessionCreateWithoutUserInput[]
			| SessionUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| SessionCreateOrConnectWithoutUserInput
			| SessionCreateOrConnectWithoutUserInput[];
		createMany?: SessionCreateManyUserInputEnvelope;
		connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
	};

	export type EmployeeCreateNestedOneWithoutUserInput = {
		create?: XOR<EmployeeCreateWithoutUserInput, EmployeeUncheckedCreateWithoutUserInput>;
		connectOrCreate?: EmployeeCreateOrConnectWithoutUserInput;
		connect?: EmployeeWhereUniqueInput;
	};

	export type ApiKeyCreateNestedManyWithoutUserInput = {
		create?:
			| XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
			| ApiKeyCreateWithoutUserInput[]
			| ApiKeyUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| ApiKeyCreateOrConnectWithoutUserInput
			| ApiKeyCreateOrConnectWithoutUserInput[];
		createMany?: ApiKeyCreateManyUserInputEnvelope;
		connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
	};

	export type OAuthAccountUncheckedCreateNestedManyWithoutUserInput = {
		create?:
			| XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>
			| OAuthAccountCreateWithoutUserInput[]
			| OAuthAccountUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| OAuthAccountCreateOrConnectWithoutUserInput
			| OAuthAccountCreateOrConnectWithoutUserInput[];
		createMany?: OAuthAccountCreateManyUserInputEnvelope;
		connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
	};

	export type SessionUncheckedCreateNestedManyWithoutUserInput = {
		create?:
			| XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
			| SessionCreateWithoutUserInput[]
			| SessionUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| SessionCreateOrConnectWithoutUserInput
			| SessionCreateOrConnectWithoutUserInput[];
		createMany?: SessionCreateManyUserInputEnvelope;
		connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
	};

	export type ApiKeyUncheckedCreateNestedManyWithoutUserInput = {
		create?:
			| XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
			| ApiKeyCreateWithoutUserInput[]
			| ApiKeyUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| ApiKeyCreateOrConnectWithoutUserInput
			| ApiKeyCreateOrConnectWithoutUserInput[];
		createMany?: ApiKeyCreateManyUserInputEnvelope;
		connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
	};

	export type EnumUser_roleFieldUpdateOperationsInput = {
		set?: $Enums.User_role;
	};

	export type OAuthAccountUpdateManyWithoutUserNestedInput = {
		create?:
			| XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>
			| OAuthAccountCreateWithoutUserInput[]
			| OAuthAccountUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| OAuthAccountCreateOrConnectWithoutUserInput
			| OAuthAccountCreateOrConnectWithoutUserInput[];
		upsert?:
			| OAuthAccountUpsertWithWhereUniqueWithoutUserInput
			| OAuthAccountUpsertWithWhereUniqueWithoutUserInput[];
		createMany?: OAuthAccountCreateManyUserInputEnvelope;
		set?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
		disconnect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
		delete?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
		connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
		update?:
			| OAuthAccountUpdateWithWhereUniqueWithoutUserInput
			| OAuthAccountUpdateWithWhereUniqueWithoutUserInput[];
		updateMany?:
			| OAuthAccountUpdateManyWithWhereWithoutUserInput
			| OAuthAccountUpdateManyWithWhereWithoutUserInput[];
		deleteMany?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[];
	};

	export type SessionUpdateManyWithoutUserNestedInput = {
		create?:
			| XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
			| SessionCreateWithoutUserInput[]
			| SessionUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| SessionCreateOrConnectWithoutUserInput
			| SessionCreateOrConnectWithoutUserInput[];
		upsert?:
			| SessionUpsertWithWhereUniqueWithoutUserInput
			| SessionUpsertWithWhereUniqueWithoutUserInput[];
		createMany?: SessionCreateManyUserInputEnvelope;
		set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
		disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
		delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
		connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
		update?:
			| SessionUpdateWithWhereUniqueWithoutUserInput
			| SessionUpdateWithWhereUniqueWithoutUserInput[];
		updateMany?:
			| SessionUpdateManyWithWhereWithoutUserInput
			| SessionUpdateManyWithWhereWithoutUserInput[];
		deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
	};

	export type EmployeeUpdateOneWithoutUserNestedInput = {
		create?: XOR<EmployeeCreateWithoutUserInput, EmployeeUncheckedCreateWithoutUserInput>;
		connectOrCreate?: EmployeeCreateOrConnectWithoutUserInput;
		upsert?: EmployeeUpsertWithoutUserInput;
		disconnect?: EmployeeWhereInput | boolean;
		delete?: EmployeeWhereInput | boolean;
		connect?: EmployeeWhereUniqueInput;
		update?: XOR<
			XOR<EmployeeUpdateToOneWithWhereWithoutUserInput, EmployeeUpdateWithoutUserInput>,
			EmployeeUncheckedUpdateWithoutUserInput
		>;
	};

	export type ApiKeyUpdateManyWithoutUserNestedInput = {
		create?:
			| XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
			| ApiKeyCreateWithoutUserInput[]
			| ApiKeyUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| ApiKeyCreateOrConnectWithoutUserInput
			| ApiKeyCreateOrConnectWithoutUserInput[];
		upsert?:
			| ApiKeyUpsertWithWhereUniqueWithoutUserInput
			| ApiKeyUpsertWithWhereUniqueWithoutUserInput[];
		createMany?: ApiKeyCreateManyUserInputEnvelope;
		set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
		disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
		delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
		connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
		update?:
			| ApiKeyUpdateWithWhereUniqueWithoutUserInput
			| ApiKeyUpdateWithWhereUniqueWithoutUserInput[];
		updateMany?:
			| ApiKeyUpdateManyWithWhereWithoutUserInput
			| ApiKeyUpdateManyWithWhereWithoutUserInput[];
		deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[];
	};

	export type OAuthAccountUncheckedUpdateManyWithoutUserNestedInput = {
		create?:
			| XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>
			| OAuthAccountCreateWithoutUserInput[]
			| OAuthAccountUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| OAuthAccountCreateOrConnectWithoutUserInput
			| OAuthAccountCreateOrConnectWithoutUserInput[];
		upsert?:
			| OAuthAccountUpsertWithWhereUniqueWithoutUserInput
			| OAuthAccountUpsertWithWhereUniqueWithoutUserInput[];
		createMany?: OAuthAccountCreateManyUserInputEnvelope;
		set?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
		disconnect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
		delete?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
		connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[];
		update?:
			| OAuthAccountUpdateWithWhereUniqueWithoutUserInput
			| OAuthAccountUpdateWithWhereUniqueWithoutUserInput[];
		updateMany?:
			| OAuthAccountUpdateManyWithWhereWithoutUserInput
			| OAuthAccountUpdateManyWithWhereWithoutUserInput[];
		deleteMany?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[];
	};

	export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
		create?:
			| XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
			| SessionCreateWithoutUserInput[]
			| SessionUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| SessionCreateOrConnectWithoutUserInput
			| SessionCreateOrConnectWithoutUserInput[];
		upsert?:
			| SessionUpsertWithWhereUniqueWithoutUserInput
			| SessionUpsertWithWhereUniqueWithoutUserInput[];
		createMany?: SessionCreateManyUserInputEnvelope;
		set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
		disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
		delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
		connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
		update?:
			| SessionUpdateWithWhereUniqueWithoutUserInput
			| SessionUpdateWithWhereUniqueWithoutUserInput[];
		updateMany?:
			| SessionUpdateManyWithWhereWithoutUserInput
			| SessionUpdateManyWithWhereWithoutUserInput[];
		deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
	};

	export type ApiKeyUncheckedUpdateManyWithoutUserNestedInput = {
		create?:
			| XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
			| ApiKeyCreateWithoutUserInput[]
			| ApiKeyUncheckedCreateWithoutUserInput[];
		connectOrCreate?:
			| ApiKeyCreateOrConnectWithoutUserInput
			| ApiKeyCreateOrConnectWithoutUserInput[];
		upsert?:
			| ApiKeyUpsertWithWhereUniqueWithoutUserInput
			| ApiKeyUpsertWithWhereUniqueWithoutUserInput[];
		createMany?: ApiKeyCreateManyUserInputEnvelope;
		set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
		disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
		delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
		connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[];
		update?:
			| ApiKeyUpdateWithWhereUniqueWithoutUserInput
			| ApiKeyUpdateWithWhereUniqueWithoutUserInput[];
		updateMany?:
			| ApiKeyUpdateManyWithWhereWithoutUserInput
			| ApiKeyUpdateManyWithWhereWithoutUserInput[];
		deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[];
	};

	export type UserCreateNestedOneWithoutApiKeyInput = {
		create?: XOR<UserCreateWithoutApiKeyInput, UserUncheckedCreateWithoutApiKeyInput>;
		connectOrCreate?: UserCreateOrConnectWithoutApiKeyInput;
		connect?: UserWhereUniqueInput;
	};

	export type UserUpdateOneRequiredWithoutApiKeyNestedInput = {
		create?: XOR<UserCreateWithoutApiKeyInput, UserUncheckedCreateWithoutApiKeyInput>;
		connectOrCreate?: UserCreateOrConnectWithoutApiKeyInput;
		upsert?: UserUpsertWithoutApiKeyInput;
		connect?: UserWhereUniqueInput;
		update?: XOR<
			XOR<UserUpdateToOneWithWhereWithoutApiKeyInput, UserUpdateWithoutApiKeyInput>,
			UserUncheckedUpdateWithoutApiKeyInput
		>;
	};

	export type NestedStringFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringFilter<$PrismaModel> | string;
	};

	export type NestedStringNullableFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringNullableFilter<$PrismaModel> | string | null;
	};

	export type NestedFloatNullableFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
	};

	export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
	};

	export type NestedEnumEmployeeStatusFilter<$PrismaModel = never> = {
		equals?: $Enums.EmployeeStatus | EnumEmployeeStatusFieldRefInput<$PrismaModel>;
		in?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>;
		notIn?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumEmployeeStatusFilter<$PrismaModel> | $Enums.EmployeeStatus;
	};

	export type NestedDateTimeFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
	};

	export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel>;
		in?: string[] | ListStringFieldRefInput<$PrismaModel>;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedStringFilter<$PrismaModel>;
		_max?: NestedStringFilter<$PrismaModel>;
	};

	export type NestedIntFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel>;
		in?: number[] | ListIntFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntFilter<$PrismaModel> | number;
	};

	export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: string | StringFieldRefInput<$PrismaModel> | null;
		in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
		lt?: string | StringFieldRefInput<$PrismaModel>;
		lte?: string | StringFieldRefInput<$PrismaModel>;
		gt?: string | StringFieldRefInput<$PrismaModel>;
		gte?: string | StringFieldRefInput<$PrismaModel>;
		contains?: string | StringFieldRefInput<$PrismaModel>;
		startsWith?: string | StringFieldRefInput<$PrismaModel>;
		endsWith?: string | StringFieldRefInput<$PrismaModel>;
		not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedStringNullableFilter<$PrismaModel>;
		_max?: NestedStringNullableFilter<$PrismaModel>;
	};

	export type NestedIntNullableFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntNullableFilter<$PrismaModel> | number | null;
	};

	export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_avg?: NestedFloatNullableFilter<$PrismaModel>;
		_sum?: NestedFloatNullableFilter<$PrismaModel>;
		_min?: NestedFloatNullableFilter<$PrismaModel>;
		_max?: NestedFloatNullableFilter<$PrismaModel>;
	};

	export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedDateTimeNullableFilter<$PrismaModel>;
		_max?: NestedDateTimeNullableFilter<$PrismaModel>;
	};

	export type NestedEnumEmployeeStatusWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.EmployeeStatus | EnumEmployeeStatusFieldRefInput<$PrismaModel>;
		in?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>;
		notIn?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>;
		not?: NestedEnumEmployeeStatusWithAggregatesFilter<$PrismaModel> | $Enums.EmployeeStatus;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumEmployeeStatusFilter<$PrismaModel>;
		_max?: NestedEnumEmployeeStatusFilter<$PrismaModel>;
	};

	export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
		equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
		lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
		not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedDateTimeFilter<$PrismaModel>;
		_max?: NestedDateTimeFilter<$PrismaModel>;
	};

	export type NestedBoolFilter<$PrismaModel = never> = {
		equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
		not?: NestedBoolFilter<$PrismaModel> | boolean;
	};

	export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | IntFieldRefInput<$PrismaModel> | null;
		in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
		lt?: number | IntFieldRefInput<$PrismaModel>;
		lte?: number | IntFieldRefInput<$PrismaModel>;
		gt?: number | IntFieldRefInput<$PrismaModel>;
		gte?: number | IntFieldRefInput<$PrismaModel>;
		not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
		_count?: NestedIntNullableFilter<$PrismaModel>;
		_avg?: NestedFloatNullableFilter<$PrismaModel>;
		_sum?: NestedIntNullableFilter<$PrismaModel>;
		_min?: NestedIntNullableFilter<$PrismaModel>;
		_max?: NestedIntNullableFilter<$PrismaModel>;
	};

	export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
		equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
		not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedBoolFilter<$PrismaModel>;
		_max?: NestedBoolFilter<$PrismaModel>;
	};

	export type NestedEnumTimeLog_typeFilter<$PrismaModel = never> = {
		equals?: $Enums.TimeLog_type | EnumTimeLog_typeFieldRefInput<$PrismaModel>;
		in?: $Enums.TimeLog_type[] | ListEnumTimeLog_typeFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TimeLog_type[] | ListEnumTimeLog_typeFieldRefInput<$PrismaModel>;
		not?: NestedEnumTimeLog_typeFilter<$PrismaModel> | $Enums.TimeLog_type;
	};

	export type NestedEnumClockMethodFilter<$PrismaModel = never> = {
		equals?: $Enums.ClockMethod | EnumClockMethodFieldRefInput<$PrismaModel>;
		in?: $Enums.ClockMethod[] | ListEnumClockMethodFieldRefInput<$PrismaModel>;
		notIn?: $Enums.ClockMethod[] | ListEnumClockMethodFieldRefInput<$PrismaModel>;
		not?: NestedEnumClockMethodFilter<$PrismaModel> | $Enums.ClockMethod;
	};

	export type NestedEnumTimeLog_typeWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.TimeLog_type | EnumTimeLog_typeFieldRefInput<$PrismaModel>;
		in?: $Enums.TimeLog_type[] | ListEnumTimeLog_typeFieldRefInput<$PrismaModel>;
		notIn?: $Enums.TimeLog_type[] | ListEnumTimeLog_typeFieldRefInput<$PrismaModel>;
		not?: NestedEnumTimeLog_typeWithAggregatesFilter<$PrismaModel> | $Enums.TimeLog_type;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumTimeLog_typeFilter<$PrismaModel>;
		_max?: NestedEnumTimeLog_typeFilter<$PrismaModel>;
	};

	export type NestedEnumClockMethodWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.ClockMethod | EnumClockMethodFieldRefInput<$PrismaModel>;
		in?: $Enums.ClockMethod[] | ListEnumClockMethodFieldRefInput<$PrismaModel>;
		notIn?: $Enums.ClockMethod[] | ListEnumClockMethodFieldRefInput<$PrismaModel>;
		not?: NestedEnumClockMethodWithAggregatesFilter<$PrismaModel> | $Enums.ClockMethod;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumClockMethodFilter<$PrismaModel>;
		_max?: NestedEnumClockMethodFilter<$PrismaModel>;
	};

	export type NestedFloatFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatFilter<$PrismaModel> | number;
	};

	export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
		equals?: number | FloatFieldRefInput<$PrismaModel>;
		in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
		lt?: number | FloatFieldRefInput<$PrismaModel>;
		lte?: number | FloatFieldRefInput<$PrismaModel>;
		gt?: number | FloatFieldRefInput<$PrismaModel>;
		gte?: number | FloatFieldRefInput<$PrismaModel>;
		not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
		_count?: NestedIntFilter<$PrismaModel>;
		_avg?: NestedFloatFilter<$PrismaModel>;
		_sum?: NestedFloatFilter<$PrismaModel>;
		_min?: NestedFloatFilter<$PrismaModel>;
		_max?: NestedFloatFilter<$PrismaModel>;
	};

	export type NestedEnumUser_roleFilter<$PrismaModel = never> = {
		equals?: $Enums.User_role | EnumUser_roleFieldRefInput<$PrismaModel>;
		in?: $Enums.User_role[] | ListEnumUser_roleFieldRefInput<$PrismaModel>;
		notIn?: $Enums.User_role[] | ListEnumUser_roleFieldRefInput<$PrismaModel>;
		not?: NestedEnumUser_roleFilter<$PrismaModel> | $Enums.User_role;
	};

	export type NestedEnumUser_roleWithAggregatesFilter<$PrismaModel = never> = {
		equals?: $Enums.User_role | EnumUser_roleFieldRefInput<$PrismaModel>;
		in?: $Enums.User_role[] | ListEnumUser_roleFieldRefInput<$PrismaModel>;
		notIn?: $Enums.User_role[] | ListEnumUser_roleFieldRefInput<$PrismaModel>;
		not?: NestedEnumUser_roleWithAggregatesFilter<$PrismaModel> | $Enums.User_role;
		_count?: NestedIntFilter<$PrismaModel>;
		_min?: NestedEnumUser_roleFilter<$PrismaModel>;
		_max?: NestedEnumUser_roleFilter<$PrismaModel>;
	};

	export type TimeLogCreateWithoutEmployeeInput = {
		id?: string;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
		Station?: StationCreateNestedOneWithoutTimeLogInput;
		Task?: TaskAssignmentCreateNestedOneWithoutTimeLogsInput;
	};

	export type TimeLogUncheckedCreateWithoutEmployeeInput = {
		id?: string;
		stationId?: string | null;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		taskId?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TimeLogCreateOrConnectWithoutEmployeeInput = {
		where: TimeLogWhereUniqueInput;
		create: XOR<TimeLogCreateWithoutEmployeeInput, TimeLogUncheckedCreateWithoutEmployeeInput>;
	};

	export type TimeLogCreateManyEmployeeInputEnvelope = {
		data: TimeLogCreateManyEmployeeInput | TimeLogCreateManyEmployeeInput[];
		skipDuplicates?: boolean;
	};

	export type UserCreateWithoutEmployeeInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		OAuthAccount?: OAuthAccountCreateNestedManyWithoutUserInput;
		Session?: SessionCreateNestedManyWithoutUserInput;
		ApiKey?: ApiKeyCreateNestedManyWithoutUserInput;
	};

	export type UserUncheckedCreateWithoutEmployeeInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		OAuthAccount?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput;
		Session?: SessionUncheckedCreateNestedManyWithoutUserInput;
		ApiKey?: ApiKeyUncheckedCreateNestedManyWithoutUserInput;
	};

	export type UserCreateOrConnectWithoutEmployeeInput = {
		where: UserWhereUniqueInput;
		create: XOR<UserCreateWithoutEmployeeInput, UserUncheckedCreateWithoutEmployeeInput>;
	};

	export type TaskAssignmentCreateWithoutEmployeeInput = {
		id?: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TaskType: TaskTypeCreateNestedOneWithoutTaskAssignmentInput;
		TimeLogs?: TimeLogCreateNestedManyWithoutTaskInput;
	};

	export type TaskAssignmentUncheckedCreateWithoutEmployeeInput = {
		id?: string;
		taskTypeId: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLogs?: TimeLogUncheckedCreateNestedManyWithoutTaskInput;
	};

	export type TaskAssignmentCreateOrConnectWithoutEmployeeInput = {
		where: TaskAssignmentWhereUniqueInput;
		create: XOR<
			TaskAssignmentCreateWithoutEmployeeInput,
			TaskAssignmentUncheckedCreateWithoutEmployeeInput
		>;
	};

	export type TaskAssignmentCreateManyEmployeeInputEnvelope = {
		data: TaskAssignmentCreateManyEmployeeInput | TaskAssignmentCreateManyEmployeeInput[];
		skipDuplicates?: boolean;
	};

	export type PerformanceMetricCreateWithoutEmployeeInput = {
		id?: string;
		date: Date | string;
		stationId?: string | null;
		hoursWorked: number;
		unitsProcessed?: number | null;
		efficiency?: number | null;
		qualityScore?: number | null;
		overtimeHours?: number | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type PerformanceMetricUncheckedCreateWithoutEmployeeInput = {
		id?: string;
		date: Date | string;
		stationId?: string | null;
		hoursWorked: number;
		unitsProcessed?: number | null;
		efficiency?: number | null;
		qualityScore?: number | null;
		overtimeHours?: number | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type PerformanceMetricCreateOrConnectWithoutEmployeeInput = {
		where: PerformanceMetricWhereUniqueInput;
		create: XOR<
			PerformanceMetricCreateWithoutEmployeeInput,
			PerformanceMetricUncheckedCreateWithoutEmployeeInput
		>;
	};

	export type PerformanceMetricCreateManyEmployeeInputEnvelope = {
		data: PerformanceMetricCreateManyEmployeeInput | PerformanceMetricCreateManyEmployeeInput[];
		skipDuplicates?: boolean;
	};

	export type StationCreateWithoutEmployeesWithDefaultInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutStationInput;
		TaskType?: TaskTypeCreateNestedManyWithoutStationInput;
		employeesAtLastStation?: EmployeeCreateNestedManyWithoutLastStationInput;
	};

	export type StationUncheckedCreateWithoutEmployeesWithDefaultInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutStationInput;
		TaskType?: TaskTypeUncheckedCreateNestedManyWithoutStationInput;
		employeesAtLastStation?: EmployeeUncheckedCreateNestedManyWithoutLastStationInput;
	};

	export type StationCreateOrConnectWithoutEmployeesWithDefaultInput = {
		where: StationWhereUniqueInput;
		create: XOR<
			StationCreateWithoutEmployeesWithDefaultInput,
			StationUncheckedCreateWithoutEmployeesWithDefaultInput
		>;
	};

	export type StationCreateWithoutEmployeesAtLastStationInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutStationInput;
		TaskType?: TaskTypeCreateNestedManyWithoutStationInput;
		employeesWithDefault?: EmployeeCreateNestedManyWithoutDefaultStationInput;
	};

	export type StationUncheckedCreateWithoutEmployeesAtLastStationInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutStationInput;
		TaskType?: TaskTypeUncheckedCreateNestedManyWithoutStationInput;
		employeesWithDefault?: EmployeeUncheckedCreateNestedManyWithoutDefaultStationInput;
	};

	export type StationCreateOrConnectWithoutEmployeesAtLastStationInput = {
		where: StationWhereUniqueInput;
		create: XOR<
			StationCreateWithoutEmployeesAtLastStationInput,
			StationUncheckedCreateWithoutEmployeesAtLastStationInput
		>;
	};

	export type TimeLogUpsertWithWhereUniqueWithoutEmployeeInput = {
		where: TimeLogWhereUniqueInput;
		update: XOR<TimeLogUpdateWithoutEmployeeInput, TimeLogUncheckedUpdateWithoutEmployeeInput>;
		create: XOR<TimeLogCreateWithoutEmployeeInput, TimeLogUncheckedCreateWithoutEmployeeInput>;
	};

	export type TimeLogUpdateWithWhereUniqueWithoutEmployeeInput = {
		where: TimeLogWhereUniqueInput;
		data: XOR<TimeLogUpdateWithoutEmployeeInput, TimeLogUncheckedUpdateWithoutEmployeeInput>;
	};

	export type TimeLogUpdateManyWithWhereWithoutEmployeeInput = {
		where: TimeLogScalarWhereInput;
		data: XOR<TimeLogUpdateManyMutationInput, TimeLogUncheckedUpdateManyWithoutEmployeeInput>;
	};

	export type TimeLogScalarWhereInput = {
		AND?: TimeLogScalarWhereInput | TimeLogScalarWhereInput[];
		OR?: TimeLogScalarWhereInput[];
		NOT?: TimeLogScalarWhereInput | TimeLogScalarWhereInput[];
		id?: StringFilter<"TimeLog"> | string;
		employeeId?: StringFilter<"TimeLog"> | string;
		stationId?: StringNullableFilter<"TimeLog"> | string | null;
		type?: EnumTimeLog_typeFilter<"TimeLog"> | $Enums.TimeLog_type;
		startTime?: DateTimeFilter<"TimeLog"> | Date | string;
		endTime?: DateTimeNullableFilter<"TimeLog"> | Date | string | null;
		note?: StringNullableFilter<"TimeLog"> | string | null;
		deletedAt?: DateTimeNullableFilter<"TimeLog"> | Date | string | null;
		correctedBy?: StringNullableFilter<"TimeLog"> | string | null;
		taskId?: StringNullableFilter<"TimeLog"> | string | null;
		clockMethod?: EnumClockMethodFilter<"TimeLog"> | $Enums.ClockMethod;
		createdAt?: DateTimeFilter<"TimeLog"> | Date | string;
		updatedAt?: DateTimeFilter<"TimeLog"> | Date | string;
	};

	export type UserUpsertWithoutEmployeeInput = {
		update: XOR<UserUpdateWithoutEmployeeInput, UserUncheckedUpdateWithoutEmployeeInput>;
		create: XOR<UserCreateWithoutEmployeeInput, UserUncheckedCreateWithoutEmployeeInput>;
		where?: UserWhereInput;
	};

	export type UserUpdateToOneWithWhereWithoutEmployeeInput = {
		where?: UserWhereInput;
		data: XOR<UserUpdateWithoutEmployeeInput, UserUncheckedUpdateWithoutEmployeeInput>;
	};

	export type UserUpdateWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		OAuthAccount?: OAuthAccountUpdateManyWithoutUserNestedInput;
		Session?: SessionUpdateManyWithoutUserNestedInput;
		ApiKey?: ApiKeyUpdateManyWithoutUserNestedInput;
	};

	export type UserUncheckedUpdateWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		OAuthAccount?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput;
		Session?: SessionUncheckedUpdateManyWithoutUserNestedInput;
		ApiKey?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput;
	};

	export type TaskAssignmentUpsertWithWhereUniqueWithoutEmployeeInput = {
		where: TaskAssignmentWhereUniqueInput;
		update: XOR<
			TaskAssignmentUpdateWithoutEmployeeInput,
			TaskAssignmentUncheckedUpdateWithoutEmployeeInput
		>;
		create: XOR<
			TaskAssignmentCreateWithoutEmployeeInput,
			TaskAssignmentUncheckedCreateWithoutEmployeeInput
		>;
	};

	export type TaskAssignmentUpdateWithWhereUniqueWithoutEmployeeInput = {
		where: TaskAssignmentWhereUniqueInput;
		data: XOR<
			TaskAssignmentUpdateWithoutEmployeeInput,
			TaskAssignmentUncheckedUpdateWithoutEmployeeInput
		>;
	};

	export type TaskAssignmentUpdateManyWithWhereWithoutEmployeeInput = {
		where: TaskAssignmentScalarWhereInput;
		data: XOR<
			TaskAssignmentUpdateManyMutationInput,
			TaskAssignmentUncheckedUpdateManyWithoutEmployeeInput
		>;
	};

	export type TaskAssignmentScalarWhereInput = {
		AND?: TaskAssignmentScalarWhereInput | TaskAssignmentScalarWhereInput[];
		OR?: TaskAssignmentScalarWhereInput[];
		NOT?: TaskAssignmentScalarWhereInput | TaskAssignmentScalarWhereInput[];
		id?: StringFilter<"TaskAssignment"> | string;
		employeeId?: StringFilter<"TaskAssignment"> | string;
		taskTypeId?: StringFilter<"TaskAssignment"> | string;
		startTime?: DateTimeFilter<"TaskAssignment"> | Date | string;
		endTime?: DateTimeNullableFilter<"TaskAssignment"> | Date | string | null;
		unitsCompleted?: IntNullableFilter<"TaskAssignment"> | number | null;
		notes?: StringNullableFilter<"TaskAssignment"> | string | null;
		createdAt?: DateTimeFilter<"TaskAssignment"> | Date | string;
		updatedAt?: DateTimeFilter<"TaskAssignment"> | Date | string;
	};

	export type PerformanceMetricUpsertWithWhereUniqueWithoutEmployeeInput = {
		where: PerformanceMetricWhereUniqueInput;
		update: XOR<
			PerformanceMetricUpdateWithoutEmployeeInput,
			PerformanceMetricUncheckedUpdateWithoutEmployeeInput
		>;
		create: XOR<
			PerformanceMetricCreateWithoutEmployeeInput,
			PerformanceMetricUncheckedCreateWithoutEmployeeInput
		>;
	};

	export type PerformanceMetricUpdateWithWhereUniqueWithoutEmployeeInput = {
		where: PerformanceMetricWhereUniqueInput;
		data: XOR<
			PerformanceMetricUpdateWithoutEmployeeInput,
			PerformanceMetricUncheckedUpdateWithoutEmployeeInput
		>;
	};

	export type PerformanceMetricUpdateManyWithWhereWithoutEmployeeInput = {
		where: PerformanceMetricScalarWhereInput;
		data: XOR<
			PerformanceMetricUpdateManyMutationInput,
			PerformanceMetricUncheckedUpdateManyWithoutEmployeeInput
		>;
	};

	export type PerformanceMetricScalarWhereInput = {
		AND?: PerformanceMetricScalarWhereInput | PerformanceMetricScalarWhereInput[];
		OR?: PerformanceMetricScalarWhereInput[];
		NOT?: PerformanceMetricScalarWhereInput | PerformanceMetricScalarWhereInput[];
		id?: StringFilter<"PerformanceMetric"> | string;
		employeeId?: StringFilter<"PerformanceMetric"> | string;
		date?: DateTimeFilter<"PerformanceMetric"> | Date | string;
		stationId?: StringNullableFilter<"PerformanceMetric"> | string | null;
		hoursWorked?: FloatFilter<"PerformanceMetric"> | number;
		unitsProcessed?: IntNullableFilter<"PerformanceMetric"> | number | null;
		efficiency?: FloatNullableFilter<"PerformanceMetric"> | number | null;
		qualityScore?: FloatNullableFilter<"PerformanceMetric"> | number | null;
		overtimeHours?: FloatNullableFilter<"PerformanceMetric"> | number | null;
		createdAt?: DateTimeFilter<"PerformanceMetric"> | Date | string;
		updatedAt?: DateTimeFilter<"PerformanceMetric"> | Date | string;
	};

	export type StationUpsertWithoutEmployeesWithDefaultInput = {
		update: XOR<
			StationUpdateWithoutEmployeesWithDefaultInput,
			StationUncheckedUpdateWithoutEmployeesWithDefaultInput
		>;
		create: XOR<
			StationCreateWithoutEmployeesWithDefaultInput,
			StationUncheckedCreateWithoutEmployeesWithDefaultInput
		>;
		where?: StationWhereInput;
	};

	export type StationUpdateToOneWithWhereWithoutEmployeesWithDefaultInput = {
		where?: StationWhereInput;
		data: XOR<
			StationUpdateWithoutEmployeesWithDefaultInput,
			StationUncheckedUpdateWithoutEmployeesWithDefaultInput
		>;
	};

	export type StationUpdateWithoutEmployeesWithDefaultInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutStationNestedInput;
		TaskType?: TaskTypeUpdateManyWithoutStationNestedInput;
		employeesAtLastStation?: EmployeeUpdateManyWithoutLastStationNestedInput;
	};

	export type StationUncheckedUpdateWithoutEmployeesWithDefaultInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutStationNestedInput;
		TaskType?: TaskTypeUncheckedUpdateManyWithoutStationNestedInput;
		employeesAtLastStation?: EmployeeUncheckedUpdateManyWithoutLastStationNestedInput;
	};

	export type StationUpsertWithoutEmployeesAtLastStationInput = {
		update: XOR<
			StationUpdateWithoutEmployeesAtLastStationInput,
			StationUncheckedUpdateWithoutEmployeesAtLastStationInput
		>;
		create: XOR<
			StationCreateWithoutEmployeesAtLastStationInput,
			StationUncheckedCreateWithoutEmployeesAtLastStationInput
		>;
		where?: StationWhereInput;
	};

	export type StationUpdateToOneWithWhereWithoutEmployeesAtLastStationInput = {
		where?: StationWhereInput;
		data: XOR<
			StationUpdateWithoutEmployeesAtLastStationInput,
			StationUncheckedUpdateWithoutEmployeesAtLastStationInput
		>;
	};

	export type StationUpdateWithoutEmployeesAtLastStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutStationNestedInput;
		TaskType?: TaskTypeUpdateManyWithoutStationNestedInput;
		employeesWithDefault?: EmployeeUpdateManyWithoutDefaultStationNestedInput;
	};

	export type StationUncheckedUpdateWithoutEmployeesAtLastStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutStationNestedInput;
		TaskType?: TaskTypeUncheckedUpdateManyWithoutStationNestedInput;
		employeesWithDefault?: EmployeeUncheckedUpdateManyWithoutDefaultStationNestedInput;
	};

	export type UserCreateWithoutOAuthAccountInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		Session?: SessionCreateNestedManyWithoutUserInput;
		Employee?: EmployeeCreateNestedOneWithoutUserInput;
		ApiKey?: ApiKeyCreateNestedManyWithoutUserInput;
	};

	export type UserUncheckedCreateWithoutOAuthAccountInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		employeeId?: string | null;
		Session?: SessionUncheckedCreateNestedManyWithoutUserInput;
		ApiKey?: ApiKeyUncheckedCreateNestedManyWithoutUserInput;
	};

	export type UserCreateOrConnectWithoutOAuthAccountInput = {
		where: UserWhereUniqueInput;
		create: XOR<UserCreateWithoutOAuthAccountInput, UserUncheckedCreateWithoutOAuthAccountInput>;
	};

	export type UserUpsertWithoutOAuthAccountInput = {
		update: XOR<UserUpdateWithoutOAuthAccountInput, UserUncheckedUpdateWithoutOAuthAccountInput>;
		create: XOR<UserCreateWithoutOAuthAccountInput, UserUncheckedCreateWithoutOAuthAccountInput>;
		where?: UserWhereInput;
	};

	export type UserUpdateToOneWithWhereWithoutOAuthAccountInput = {
		where?: UserWhereInput;
		data: XOR<UserUpdateWithoutOAuthAccountInput, UserUncheckedUpdateWithoutOAuthAccountInput>;
	};

	export type UserUpdateWithoutOAuthAccountInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Session?: SessionUpdateManyWithoutUserNestedInput;
		Employee?: EmployeeUpdateOneWithoutUserNestedInput;
		ApiKey?: ApiKeyUpdateManyWithoutUserNestedInput;
	};

	export type UserUncheckedUpdateWithoutOAuthAccountInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		employeeId?: NullableStringFieldUpdateOperationsInput | string | null;
		Session?: SessionUncheckedUpdateManyWithoutUserNestedInput;
		ApiKey?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput;
	};

	export type UserCreateWithoutSessionInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		OAuthAccount?: OAuthAccountCreateNestedManyWithoutUserInput;
		Employee?: EmployeeCreateNestedOneWithoutUserInput;
		ApiKey?: ApiKeyCreateNestedManyWithoutUserInput;
	};

	export type UserUncheckedCreateWithoutSessionInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		employeeId?: string | null;
		OAuthAccount?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput;
		ApiKey?: ApiKeyUncheckedCreateNestedManyWithoutUserInput;
	};

	export type UserCreateOrConnectWithoutSessionInput = {
		where: UserWhereUniqueInput;
		create: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput>;
	};

	export type UserUpsertWithoutSessionInput = {
		update: XOR<UserUpdateWithoutSessionInput, UserUncheckedUpdateWithoutSessionInput>;
		create: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput>;
		where?: UserWhereInput;
	};

	export type UserUpdateToOneWithWhereWithoutSessionInput = {
		where?: UserWhereInput;
		data: XOR<UserUpdateWithoutSessionInput, UserUncheckedUpdateWithoutSessionInput>;
	};

	export type UserUpdateWithoutSessionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		OAuthAccount?: OAuthAccountUpdateManyWithoutUserNestedInput;
		Employee?: EmployeeUpdateOneWithoutUserNestedInput;
		ApiKey?: ApiKeyUpdateManyWithoutUserNestedInput;
	};

	export type UserUncheckedUpdateWithoutSessionInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		employeeId?: NullableStringFieldUpdateOperationsInput | string | null;
		OAuthAccount?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput;
		ApiKey?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput;
	};

	export type TimeLogCreateWithoutStationInput = {
		id?: string;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
		Employee: EmployeeCreateNestedOneWithoutTimeLogInput;
		Task?: TaskAssignmentCreateNestedOneWithoutTimeLogsInput;
	};

	export type TimeLogUncheckedCreateWithoutStationInput = {
		id?: string;
		employeeId: string;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		taskId?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TimeLogCreateOrConnectWithoutStationInput = {
		where: TimeLogWhereUniqueInput;
		create: XOR<TimeLogCreateWithoutStationInput, TimeLogUncheckedCreateWithoutStationInput>;
	};

	export type TimeLogCreateManyStationInputEnvelope = {
		data: TimeLogCreateManyStationInput | TimeLogCreateManyStationInput[];
		skipDuplicates?: boolean;
	};

	export type TaskTypeCreateWithoutStationInput = {
		id?: string;
		name: string;
		description?: string | null;
		estimatedMinutesPerUnit?: number | null;
		isActive?: boolean;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TaskAssignment?: TaskAssignmentCreateNestedManyWithoutTaskTypeInput;
	};

	export type TaskTypeUncheckedCreateWithoutStationInput = {
		id?: string;
		name: string;
		description?: string | null;
		estimatedMinutesPerUnit?: number | null;
		isActive?: boolean;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TaskAssignment?: TaskAssignmentUncheckedCreateNestedManyWithoutTaskTypeInput;
	};

	export type TaskTypeCreateOrConnectWithoutStationInput = {
		where: TaskTypeWhereUniqueInput;
		create: XOR<TaskTypeCreateWithoutStationInput, TaskTypeUncheckedCreateWithoutStationInput>;
	};

	export type TaskTypeCreateManyStationInputEnvelope = {
		data: TaskTypeCreateManyStationInput | TaskTypeCreateManyStationInput[];
		skipDuplicates?: boolean;
	};

	export type EmployeeCreateWithoutLastStationInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutEmployeeInput;
		User?: UserCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricCreateNestedManyWithoutEmployeeInput;
		defaultStation?: StationCreateNestedOneWithoutEmployeesWithDefaultInput;
	};

	export type EmployeeUncheckedCreateWithoutLastStationInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		defaultStationId?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutEmployeeInput;
		User?: UserUncheckedCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentUncheckedCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricUncheckedCreateNestedManyWithoutEmployeeInput;
	};

	export type EmployeeCreateOrConnectWithoutLastStationInput = {
		where: EmployeeWhereUniqueInput;
		create: XOR<
			EmployeeCreateWithoutLastStationInput,
			EmployeeUncheckedCreateWithoutLastStationInput
		>;
	};

	export type EmployeeCreateManyLastStationInputEnvelope = {
		data: EmployeeCreateManyLastStationInput | EmployeeCreateManyLastStationInput[];
		skipDuplicates?: boolean;
	};

	export type EmployeeCreateWithoutDefaultStationInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutEmployeeInput;
		User?: UserCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricCreateNestedManyWithoutEmployeeInput;
		lastStation?: StationCreateNestedOneWithoutEmployeesAtLastStationInput;
	};

	export type EmployeeUncheckedCreateWithoutDefaultStationInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		lastStationId?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutEmployeeInput;
		User?: UserUncheckedCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentUncheckedCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricUncheckedCreateNestedManyWithoutEmployeeInput;
	};

	export type EmployeeCreateOrConnectWithoutDefaultStationInput = {
		where: EmployeeWhereUniqueInput;
		create: XOR<
			EmployeeCreateWithoutDefaultStationInput,
			EmployeeUncheckedCreateWithoutDefaultStationInput
		>;
	};

	export type EmployeeCreateManyDefaultStationInputEnvelope = {
		data: EmployeeCreateManyDefaultStationInput | EmployeeCreateManyDefaultStationInput[];
		skipDuplicates?: boolean;
	};

	export type TimeLogUpsertWithWhereUniqueWithoutStationInput = {
		where: TimeLogWhereUniqueInput;
		update: XOR<TimeLogUpdateWithoutStationInput, TimeLogUncheckedUpdateWithoutStationInput>;
		create: XOR<TimeLogCreateWithoutStationInput, TimeLogUncheckedCreateWithoutStationInput>;
	};

	export type TimeLogUpdateWithWhereUniqueWithoutStationInput = {
		where: TimeLogWhereUniqueInput;
		data: XOR<TimeLogUpdateWithoutStationInput, TimeLogUncheckedUpdateWithoutStationInput>;
	};

	export type TimeLogUpdateManyWithWhereWithoutStationInput = {
		where: TimeLogScalarWhereInput;
		data: XOR<TimeLogUpdateManyMutationInput, TimeLogUncheckedUpdateManyWithoutStationInput>;
	};

	export type TaskTypeUpsertWithWhereUniqueWithoutStationInput = {
		where: TaskTypeWhereUniqueInput;
		update: XOR<TaskTypeUpdateWithoutStationInput, TaskTypeUncheckedUpdateWithoutStationInput>;
		create: XOR<TaskTypeCreateWithoutStationInput, TaskTypeUncheckedCreateWithoutStationInput>;
	};

	export type TaskTypeUpdateWithWhereUniqueWithoutStationInput = {
		where: TaskTypeWhereUniqueInput;
		data: XOR<TaskTypeUpdateWithoutStationInput, TaskTypeUncheckedUpdateWithoutStationInput>;
	};

	export type TaskTypeUpdateManyWithWhereWithoutStationInput = {
		where: TaskTypeScalarWhereInput;
		data: XOR<TaskTypeUpdateManyMutationInput, TaskTypeUncheckedUpdateManyWithoutStationInput>;
	};

	export type TaskTypeScalarWhereInput = {
		AND?: TaskTypeScalarWhereInput | TaskTypeScalarWhereInput[];
		OR?: TaskTypeScalarWhereInput[];
		NOT?: TaskTypeScalarWhereInput | TaskTypeScalarWhereInput[];
		id?: StringFilter<"TaskType"> | string;
		name?: StringFilter<"TaskType"> | string;
		stationId?: StringFilter<"TaskType"> | string;
		description?: StringNullableFilter<"TaskType"> | string | null;
		estimatedMinutesPerUnit?: FloatNullableFilter<"TaskType"> | number | null;
		isActive?: BoolFilter<"TaskType"> | boolean;
		createdAt?: DateTimeFilter<"TaskType"> | Date | string;
		updatedAt?: DateTimeFilter<"TaskType"> | Date | string;
	};

	export type EmployeeUpsertWithWhereUniqueWithoutLastStationInput = {
		where: EmployeeWhereUniqueInput;
		update: XOR<
			EmployeeUpdateWithoutLastStationInput,
			EmployeeUncheckedUpdateWithoutLastStationInput
		>;
		create: XOR<
			EmployeeCreateWithoutLastStationInput,
			EmployeeUncheckedCreateWithoutLastStationInput
		>;
	};

	export type EmployeeUpdateWithWhereUniqueWithoutLastStationInput = {
		where: EmployeeWhereUniqueInput;
		data: XOR<
			EmployeeUpdateWithoutLastStationInput,
			EmployeeUncheckedUpdateWithoutLastStationInput
		>;
	};

	export type EmployeeUpdateManyWithWhereWithoutLastStationInput = {
		where: EmployeeScalarWhereInput;
		data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyWithoutLastStationInput>;
	};

	export type EmployeeScalarWhereInput = {
		AND?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[];
		OR?: EmployeeScalarWhereInput[];
		NOT?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[];
		id?: StringFilter<"Employee"> | string;
		name?: StringFilter<"Employee"> | string;
		email?: StringFilter<"Employee"> | string;
		pinHash?: StringNullableFilter<"Employee"> | string | null;
		lastStationId?: StringNullableFilter<"Employee"> | string | null;
		dailyHoursLimit?: FloatNullableFilter<"Employee"> | number | null;
		weeklyHoursLimit?: FloatNullableFilter<"Employee"> | number | null;
		employeeCode?: StringNullableFilter<"Employee"> | string | null;
		phoneNumber?: StringNullableFilter<"Employee"> | string | null;
		hireDate?: DateTimeNullableFilter<"Employee"> | Date | string | null;
		status?: EnumEmployeeStatusFilter<"Employee"> | $Enums.EmployeeStatus;
		defaultStationId?: StringNullableFilter<"Employee"> | string | null;
		createdAt?: DateTimeFilter<"Employee"> | Date | string;
		updatedAt?: DateTimeFilter<"Employee"> | Date | string;
	};

	export type EmployeeUpsertWithWhereUniqueWithoutDefaultStationInput = {
		where: EmployeeWhereUniqueInput;
		update: XOR<
			EmployeeUpdateWithoutDefaultStationInput,
			EmployeeUncheckedUpdateWithoutDefaultStationInput
		>;
		create: XOR<
			EmployeeCreateWithoutDefaultStationInput,
			EmployeeUncheckedCreateWithoutDefaultStationInput
		>;
	};

	export type EmployeeUpdateWithWhereUniqueWithoutDefaultStationInput = {
		where: EmployeeWhereUniqueInput;
		data: XOR<
			EmployeeUpdateWithoutDefaultStationInput,
			EmployeeUncheckedUpdateWithoutDefaultStationInput
		>;
	};

	export type EmployeeUpdateManyWithWhereWithoutDefaultStationInput = {
		where: EmployeeScalarWhereInput;
		data: XOR<
			EmployeeUpdateManyMutationInput,
			EmployeeUncheckedUpdateManyWithoutDefaultStationInput
		>;
	};

	export type EmployeeCreateWithoutTimeLogInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		User?: UserCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricCreateNestedManyWithoutEmployeeInput;
		defaultStation?: StationCreateNestedOneWithoutEmployeesWithDefaultInput;
		lastStation?: StationCreateNestedOneWithoutEmployeesAtLastStationInput;
	};

	export type EmployeeUncheckedCreateWithoutTimeLogInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		lastStationId?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		defaultStationId?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		User?: UserUncheckedCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentUncheckedCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricUncheckedCreateNestedManyWithoutEmployeeInput;
	};

	export type EmployeeCreateOrConnectWithoutTimeLogInput = {
		where: EmployeeWhereUniqueInput;
		create: XOR<EmployeeCreateWithoutTimeLogInput, EmployeeUncheckedCreateWithoutTimeLogInput>;
	};

	export type StationCreateWithoutTimeLogInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TaskType?: TaskTypeCreateNestedManyWithoutStationInput;
		employeesAtLastStation?: EmployeeCreateNestedManyWithoutLastStationInput;
		employeesWithDefault?: EmployeeCreateNestedManyWithoutDefaultStationInput;
	};

	export type StationUncheckedCreateWithoutTimeLogInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TaskType?: TaskTypeUncheckedCreateNestedManyWithoutStationInput;
		employeesAtLastStation?: EmployeeUncheckedCreateNestedManyWithoutLastStationInput;
		employeesWithDefault?: EmployeeUncheckedCreateNestedManyWithoutDefaultStationInput;
	};

	export type StationCreateOrConnectWithoutTimeLogInput = {
		where: StationWhereUniqueInput;
		create: XOR<StationCreateWithoutTimeLogInput, StationUncheckedCreateWithoutTimeLogInput>;
	};

	export type TaskAssignmentCreateWithoutTimeLogsInput = {
		id?: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		Employee: EmployeeCreateNestedOneWithoutTaskAssignmentInput;
		TaskType: TaskTypeCreateNestedOneWithoutTaskAssignmentInput;
	};

	export type TaskAssignmentUncheckedCreateWithoutTimeLogsInput = {
		id?: string;
		employeeId: string;
		taskTypeId: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type TaskAssignmentCreateOrConnectWithoutTimeLogsInput = {
		where: TaskAssignmentWhereUniqueInput;
		create: XOR<
			TaskAssignmentCreateWithoutTimeLogsInput,
			TaskAssignmentUncheckedCreateWithoutTimeLogsInput
		>;
	};

	export type EmployeeUpsertWithoutTimeLogInput = {
		update: XOR<EmployeeUpdateWithoutTimeLogInput, EmployeeUncheckedUpdateWithoutTimeLogInput>;
		create: XOR<EmployeeCreateWithoutTimeLogInput, EmployeeUncheckedCreateWithoutTimeLogInput>;
		where?: EmployeeWhereInput;
	};

	export type EmployeeUpdateToOneWithWhereWithoutTimeLogInput = {
		where?: EmployeeWhereInput;
		data: XOR<EmployeeUpdateWithoutTimeLogInput, EmployeeUncheckedUpdateWithoutTimeLogInput>;
	};

	export type EmployeeUpdateWithoutTimeLogInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		User?: UserUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUpdateManyWithoutEmployeeNestedInput;
		defaultStation?: StationUpdateOneWithoutEmployeesWithDefaultNestedInput;
		lastStation?: StationUpdateOneWithoutEmployeesAtLastStationNestedInput;
	};

	export type EmployeeUncheckedUpdateWithoutTimeLogInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		lastStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		defaultStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		User?: UserUncheckedUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUncheckedUpdateManyWithoutEmployeeNestedInput;
	};

	export type StationUpsertWithoutTimeLogInput = {
		update: XOR<StationUpdateWithoutTimeLogInput, StationUncheckedUpdateWithoutTimeLogInput>;
		create: XOR<StationCreateWithoutTimeLogInput, StationUncheckedCreateWithoutTimeLogInput>;
		where?: StationWhereInput;
	};

	export type StationUpdateToOneWithWhereWithoutTimeLogInput = {
		where?: StationWhereInput;
		data: XOR<StationUpdateWithoutTimeLogInput, StationUncheckedUpdateWithoutTimeLogInput>;
	};

	export type StationUpdateWithoutTimeLogInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TaskType?: TaskTypeUpdateManyWithoutStationNestedInput;
		employeesAtLastStation?: EmployeeUpdateManyWithoutLastStationNestedInput;
		employeesWithDefault?: EmployeeUpdateManyWithoutDefaultStationNestedInput;
	};

	export type StationUncheckedUpdateWithoutTimeLogInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TaskType?: TaskTypeUncheckedUpdateManyWithoutStationNestedInput;
		employeesAtLastStation?: EmployeeUncheckedUpdateManyWithoutLastStationNestedInput;
		employeesWithDefault?: EmployeeUncheckedUpdateManyWithoutDefaultStationNestedInput;
	};

	export type TaskAssignmentUpsertWithoutTimeLogsInput = {
		update: XOR<
			TaskAssignmentUpdateWithoutTimeLogsInput,
			TaskAssignmentUncheckedUpdateWithoutTimeLogsInput
		>;
		create: XOR<
			TaskAssignmentCreateWithoutTimeLogsInput,
			TaskAssignmentUncheckedCreateWithoutTimeLogsInput
		>;
		where?: TaskAssignmentWhereInput;
	};

	export type TaskAssignmentUpdateToOneWithWhereWithoutTimeLogsInput = {
		where?: TaskAssignmentWhereInput;
		data: XOR<
			TaskAssignmentUpdateWithoutTimeLogsInput,
			TaskAssignmentUncheckedUpdateWithoutTimeLogsInput
		>;
	};

	export type TaskAssignmentUpdateWithoutTimeLogsInput = {
		id?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Employee?: EmployeeUpdateOneRequiredWithoutTaskAssignmentNestedInput;
		TaskType?: TaskTypeUpdateOneRequiredWithoutTaskAssignmentNestedInput;
	};

	export type TaskAssignmentUncheckedUpdateWithoutTimeLogsInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		taskTypeId?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type StationCreateWithoutTaskTypeInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutStationInput;
		employeesAtLastStation?: EmployeeCreateNestedManyWithoutLastStationInput;
		employeesWithDefault?: EmployeeCreateNestedManyWithoutDefaultStationInput;
	};

	export type StationUncheckedCreateWithoutTaskTypeInput = {
		id?: string;
		name: string;
		description?: string | null;
		capacity?: number | null;
		isActive?: boolean;
		zone?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutStationInput;
		employeesAtLastStation?: EmployeeUncheckedCreateNestedManyWithoutLastStationInput;
		employeesWithDefault?: EmployeeUncheckedCreateNestedManyWithoutDefaultStationInput;
	};

	export type StationCreateOrConnectWithoutTaskTypeInput = {
		where: StationWhereUniqueInput;
		create: XOR<StationCreateWithoutTaskTypeInput, StationUncheckedCreateWithoutTaskTypeInput>;
	};

	export type TaskAssignmentCreateWithoutTaskTypeInput = {
		id?: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		Employee: EmployeeCreateNestedOneWithoutTaskAssignmentInput;
		TimeLogs?: TimeLogCreateNestedManyWithoutTaskInput;
	};

	export type TaskAssignmentUncheckedCreateWithoutTaskTypeInput = {
		id?: string;
		employeeId: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLogs?: TimeLogUncheckedCreateNestedManyWithoutTaskInput;
	};

	export type TaskAssignmentCreateOrConnectWithoutTaskTypeInput = {
		where: TaskAssignmentWhereUniqueInput;
		create: XOR<
			TaskAssignmentCreateWithoutTaskTypeInput,
			TaskAssignmentUncheckedCreateWithoutTaskTypeInput
		>;
	};

	export type TaskAssignmentCreateManyTaskTypeInputEnvelope = {
		data: TaskAssignmentCreateManyTaskTypeInput | TaskAssignmentCreateManyTaskTypeInput[];
		skipDuplicates?: boolean;
	};

	export type StationUpsertWithoutTaskTypeInput = {
		update: XOR<StationUpdateWithoutTaskTypeInput, StationUncheckedUpdateWithoutTaskTypeInput>;
		create: XOR<StationCreateWithoutTaskTypeInput, StationUncheckedCreateWithoutTaskTypeInput>;
		where?: StationWhereInput;
	};

	export type StationUpdateToOneWithWhereWithoutTaskTypeInput = {
		where?: StationWhereInput;
		data: XOR<StationUpdateWithoutTaskTypeInput, StationUncheckedUpdateWithoutTaskTypeInput>;
	};

	export type StationUpdateWithoutTaskTypeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutStationNestedInput;
		employeesAtLastStation?: EmployeeUpdateManyWithoutLastStationNestedInput;
		employeesWithDefault?: EmployeeUpdateManyWithoutDefaultStationNestedInput;
	};

	export type StationUncheckedUpdateWithoutTaskTypeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		capacity?: NullableIntFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		zone?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutStationNestedInput;
		employeesAtLastStation?: EmployeeUncheckedUpdateManyWithoutLastStationNestedInput;
		employeesWithDefault?: EmployeeUncheckedUpdateManyWithoutDefaultStationNestedInput;
	};

	export type TaskAssignmentUpsertWithWhereUniqueWithoutTaskTypeInput = {
		where: TaskAssignmentWhereUniqueInput;
		update: XOR<
			TaskAssignmentUpdateWithoutTaskTypeInput,
			TaskAssignmentUncheckedUpdateWithoutTaskTypeInput
		>;
		create: XOR<
			TaskAssignmentCreateWithoutTaskTypeInput,
			TaskAssignmentUncheckedCreateWithoutTaskTypeInput
		>;
	};

	export type TaskAssignmentUpdateWithWhereUniqueWithoutTaskTypeInput = {
		where: TaskAssignmentWhereUniqueInput;
		data: XOR<
			TaskAssignmentUpdateWithoutTaskTypeInput,
			TaskAssignmentUncheckedUpdateWithoutTaskTypeInput
		>;
	};

	export type TaskAssignmentUpdateManyWithWhereWithoutTaskTypeInput = {
		where: TaskAssignmentScalarWhereInput;
		data: XOR<
			TaskAssignmentUpdateManyMutationInput,
			TaskAssignmentUncheckedUpdateManyWithoutTaskTypeInput
		>;
	};

	export type EmployeeCreateWithoutTaskAssignmentInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutEmployeeInput;
		User?: UserCreateNestedOneWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricCreateNestedManyWithoutEmployeeInput;
		defaultStation?: StationCreateNestedOneWithoutEmployeesWithDefaultInput;
		lastStation?: StationCreateNestedOneWithoutEmployeesAtLastStationInput;
	};

	export type EmployeeUncheckedCreateWithoutTaskAssignmentInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		lastStationId?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		defaultStationId?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutEmployeeInput;
		User?: UserUncheckedCreateNestedOneWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricUncheckedCreateNestedManyWithoutEmployeeInput;
	};

	export type EmployeeCreateOrConnectWithoutTaskAssignmentInput = {
		where: EmployeeWhereUniqueInput;
		create: XOR<
			EmployeeCreateWithoutTaskAssignmentInput,
			EmployeeUncheckedCreateWithoutTaskAssignmentInput
		>;
	};

	export type TaskTypeCreateWithoutTaskAssignmentInput = {
		id?: string;
		name: string;
		description?: string | null;
		estimatedMinutesPerUnit?: number | null;
		isActive?: boolean;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		Station: StationCreateNestedOneWithoutTaskTypeInput;
	};

	export type TaskTypeUncheckedCreateWithoutTaskAssignmentInput = {
		id?: string;
		name: string;
		stationId: string;
		description?: string | null;
		estimatedMinutesPerUnit?: number | null;
		isActive?: boolean;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type TaskTypeCreateOrConnectWithoutTaskAssignmentInput = {
		where: TaskTypeWhereUniqueInput;
		create: XOR<
			TaskTypeCreateWithoutTaskAssignmentInput,
			TaskTypeUncheckedCreateWithoutTaskAssignmentInput
		>;
	};

	export type TimeLogCreateWithoutTaskInput = {
		id?: string;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
		Employee: EmployeeCreateNestedOneWithoutTimeLogInput;
		Station?: StationCreateNestedOneWithoutTimeLogInput;
	};

	export type TimeLogUncheckedCreateWithoutTaskInput = {
		id?: string;
		employeeId: string;
		stationId?: string | null;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TimeLogCreateOrConnectWithoutTaskInput = {
		where: TimeLogWhereUniqueInput;
		create: XOR<TimeLogCreateWithoutTaskInput, TimeLogUncheckedCreateWithoutTaskInput>;
	};

	export type TimeLogCreateManyTaskInputEnvelope = {
		data: TimeLogCreateManyTaskInput | TimeLogCreateManyTaskInput[];
		skipDuplicates?: boolean;
	};

	export type EmployeeUpsertWithoutTaskAssignmentInput = {
		update: XOR<
			EmployeeUpdateWithoutTaskAssignmentInput,
			EmployeeUncheckedUpdateWithoutTaskAssignmentInput
		>;
		create: XOR<
			EmployeeCreateWithoutTaskAssignmentInput,
			EmployeeUncheckedCreateWithoutTaskAssignmentInput
		>;
		where?: EmployeeWhereInput;
	};

	export type EmployeeUpdateToOneWithWhereWithoutTaskAssignmentInput = {
		where?: EmployeeWhereInput;
		data: XOR<
			EmployeeUpdateWithoutTaskAssignmentInput,
			EmployeeUncheckedUpdateWithoutTaskAssignmentInput
		>;
	};

	export type EmployeeUpdateWithoutTaskAssignmentInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutEmployeeNestedInput;
		User?: UserUpdateOneWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUpdateManyWithoutEmployeeNestedInput;
		defaultStation?: StationUpdateOneWithoutEmployeesWithDefaultNestedInput;
		lastStation?: StationUpdateOneWithoutEmployeesAtLastStationNestedInput;
	};

	export type EmployeeUncheckedUpdateWithoutTaskAssignmentInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		lastStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		defaultStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutEmployeeNestedInput;
		User?: UserUncheckedUpdateOneWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUncheckedUpdateManyWithoutEmployeeNestedInput;
	};

	export type TaskTypeUpsertWithoutTaskAssignmentInput = {
		update: XOR<
			TaskTypeUpdateWithoutTaskAssignmentInput,
			TaskTypeUncheckedUpdateWithoutTaskAssignmentInput
		>;
		create: XOR<
			TaskTypeCreateWithoutTaskAssignmentInput,
			TaskTypeUncheckedCreateWithoutTaskAssignmentInput
		>;
		where?: TaskTypeWhereInput;
	};

	export type TaskTypeUpdateToOneWithWhereWithoutTaskAssignmentInput = {
		where?: TaskTypeWhereInput;
		data: XOR<
			TaskTypeUpdateWithoutTaskAssignmentInput,
			TaskTypeUncheckedUpdateWithoutTaskAssignmentInput
		>;
	};

	export type TaskTypeUpdateWithoutTaskAssignmentInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Station?: StationUpdateOneRequiredWithoutTaskTypeNestedInput;
	};

	export type TaskTypeUncheckedUpdateWithoutTaskAssignmentInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		stationId?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogUpsertWithWhereUniqueWithoutTaskInput = {
		where: TimeLogWhereUniqueInput;
		update: XOR<TimeLogUpdateWithoutTaskInput, TimeLogUncheckedUpdateWithoutTaskInput>;
		create: XOR<TimeLogCreateWithoutTaskInput, TimeLogUncheckedCreateWithoutTaskInput>;
	};

	export type TimeLogUpdateWithWhereUniqueWithoutTaskInput = {
		where: TimeLogWhereUniqueInput;
		data: XOR<TimeLogUpdateWithoutTaskInput, TimeLogUncheckedUpdateWithoutTaskInput>;
	};

	export type TimeLogUpdateManyWithWhereWithoutTaskInput = {
		where: TimeLogScalarWhereInput;
		data: XOR<TimeLogUpdateManyMutationInput, TimeLogUncheckedUpdateManyWithoutTaskInput>;
	};

	export type EmployeeCreateWithoutPerformanceMetricInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutEmployeeInput;
		User?: UserCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentCreateNestedManyWithoutEmployeeInput;
		defaultStation?: StationCreateNestedOneWithoutEmployeesWithDefaultInput;
		lastStation?: StationCreateNestedOneWithoutEmployeesAtLastStationInput;
	};

	export type EmployeeUncheckedCreateWithoutPerformanceMetricInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		lastStationId?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		defaultStationId?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutEmployeeInput;
		User?: UserUncheckedCreateNestedOneWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentUncheckedCreateNestedManyWithoutEmployeeInput;
	};

	export type EmployeeCreateOrConnectWithoutPerformanceMetricInput = {
		where: EmployeeWhereUniqueInput;
		create: XOR<
			EmployeeCreateWithoutPerformanceMetricInput,
			EmployeeUncheckedCreateWithoutPerformanceMetricInput
		>;
	};

	export type EmployeeUpsertWithoutPerformanceMetricInput = {
		update: XOR<
			EmployeeUpdateWithoutPerformanceMetricInput,
			EmployeeUncheckedUpdateWithoutPerformanceMetricInput
		>;
		create: XOR<
			EmployeeCreateWithoutPerformanceMetricInput,
			EmployeeUncheckedCreateWithoutPerformanceMetricInput
		>;
		where?: EmployeeWhereInput;
	};

	export type EmployeeUpdateToOneWithWhereWithoutPerformanceMetricInput = {
		where?: EmployeeWhereInput;
		data: XOR<
			EmployeeUpdateWithoutPerformanceMetricInput,
			EmployeeUncheckedUpdateWithoutPerformanceMetricInput
		>;
	};

	export type EmployeeUpdateWithoutPerformanceMetricInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutEmployeeNestedInput;
		User?: UserUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUpdateManyWithoutEmployeeNestedInput;
		defaultStation?: StationUpdateOneWithoutEmployeesWithDefaultNestedInput;
		lastStation?: StationUpdateOneWithoutEmployeesAtLastStationNestedInput;
	};

	export type EmployeeUncheckedUpdateWithoutPerformanceMetricInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		lastStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		defaultStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutEmployeeNestedInput;
		User?: UserUncheckedUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput;
	};

	export type OAuthAccountCreateWithoutUserInput = {
		provider: string;
		providerUserId: string;
		accessToken?: string | null;
		refreshToken?: string | null;
		expiresAt?: Date | string | null;
		scope?: string | null;
		tokenType?: string | null;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type OAuthAccountUncheckedCreateWithoutUserInput = {
		provider: string;
		providerUserId: string;
		accessToken?: string | null;
		refreshToken?: string | null;
		expiresAt?: Date | string | null;
		scope?: string | null;
		tokenType?: string | null;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type OAuthAccountCreateOrConnectWithoutUserInput = {
		where: OAuthAccountWhereUniqueInput;
		create: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>;
	};

	export type OAuthAccountCreateManyUserInputEnvelope = {
		data: OAuthAccountCreateManyUserInput | OAuthAccountCreateManyUserInput[];
		skipDuplicates?: boolean;
	};

	export type SessionCreateWithoutUserInput = {
		id?: string;
		expiresAt: Date | string;
		createdAt?: Date | string;
	};

	export type SessionUncheckedCreateWithoutUserInput = {
		id?: string;
		expiresAt: Date | string;
		createdAt?: Date | string;
	};

	export type SessionCreateOrConnectWithoutUserInput = {
		where: SessionWhereUniqueInput;
		create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>;
	};

	export type SessionCreateManyUserInputEnvelope = {
		data: SessionCreateManyUserInput | SessionCreateManyUserInput[];
		skipDuplicates?: boolean;
	};

	export type EmployeeCreateWithoutUserInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogCreateNestedManyWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricCreateNestedManyWithoutEmployeeInput;
		defaultStation?: StationCreateNestedOneWithoutEmployeesWithDefaultInput;
		lastStation?: StationCreateNestedOneWithoutEmployeesAtLastStationInput;
	};

	export type EmployeeUncheckedCreateWithoutUserInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		lastStationId?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		defaultStationId?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
		TimeLog?: TimeLogUncheckedCreateNestedManyWithoutEmployeeInput;
		TaskAssignment?: TaskAssignmentUncheckedCreateNestedManyWithoutEmployeeInput;
		PerformanceMetric?: PerformanceMetricUncheckedCreateNestedManyWithoutEmployeeInput;
	};

	export type EmployeeCreateOrConnectWithoutUserInput = {
		where: EmployeeWhereUniqueInput;
		create: XOR<EmployeeCreateWithoutUserInput, EmployeeUncheckedCreateWithoutUserInput>;
	};

	export type ApiKeyCreateWithoutUserInput = {
		id?: string;
		name: string;
		key: string;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		lastUsedAt?: Date | string | null;
	};

	export type ApiKeyUncheckedCreateWithoutUserInput = {
		id?: string;
		name: string;
		key: string;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		lastUsedAt?: Date | string | null;
	};

	export type ApiKeyCreateOrConnectWithoutUserInput = {
		where: ApiKeyWhereUniqueInput;
		create: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>;
	};

	export type ApiKeyCreateManyUserInputEnvelope = {
		data: ApiKeyCreateManyUserInput | ApiKeyCreateManyUserInput[];
		skipDuplicates?: boolean;
	};

	export type OAuthAccountUpsertWithWhereUniqueWithoutUserInput = {
		where: OAuthAccountWhereUniqueInput;
		update: XOR<OAuthAccountUpdateWithoutUserInput, OAuthAccountUncheckedUpdateWithoutUserInput>;
		create: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>;
	};

	export type OAuthAccountUpdateWithWhereUniqueWithoutUserInput = {
		where: OAuthAccountWhereUniqueInput;
		data: XOR<OAuthAccountUpdateWithoutUserInput, OAuthAccountUncheckedUpdateWithoutUserInput>;
	};

	export type OAuthAccountUpdateManyWithWhereWithoutUserInput = {
		where: OAuthAccountScalarWhereInput;
		data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyWithoutUserInput>;
	};

	export type OAuthAccountScalarWhereInput = {
		AND?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[];
		OR?: OAuthAccountScalarWhereInput[];
		NOT?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[];
		provider?: StringFilter<"OAuthAccount"> | string;
		providerUserId?: StringFilter<"OAuthAccount"> | string;
		userId?: StringFilter<"OAuthAccount"> | string;
		accessToken?: StringNullableFilter<"OAuthAccount"> | string | null;
		refreshToken?: StringNullableFilter<"OAuthAccount"> | string | null;
		expiresAt?: DateTimeNullableFilter<"OAuthAccount"> | Date | string | null;
		scope?: StringNullableFilter<"OAuthAccount"> | string | null;
		tokenType?: StringNullableFilter<"OAuthAccount"> | string | null;
		createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string;
		updatedAt?: DateTimeFilter<"OAuthAccount"> | Date | string;
	};

	export type SessionUpsertWithWhereUniqueWithoutUserInput = {
		where: SessionWhereUniqueInput;
		update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>;
		create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>;
	};

	export type SessionUpdateWithWhereUniqueWithoutUserInput = {
		where: SessionWhereUniqueInput;
		data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>;
	};

	export type SessionUpdateManyWithWhereWithoutUserInput = {
		where: SessionScalarWhereInput;
		data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>;
	};

	export type SessionScalarWhereInput = {
		AND?: SessionScalarWhereInput | SessionScalarWhereInput[];
		OR?: SessionScalarWhereInput[];
		NOT?: SessionScalarWhereInput | SessionScalarWhereInput[];
		id?: StringFilter<"Session"> | string;
		userId?: StringFilter<"Session"> | string;
		expiresAt?: DateTimeFilter<"Session"> | Date | string;
		createdAt?: DateTimeFilter<"Session"> | Date | string;
	};

	export type EmployeeUpsertWithoutUserInput = {
		update: XOR<EmployeeUpdateWithoutUserInput, EmployeeUncheckedUpdateWithoutUserInput>;
		create: XOR<EmployeeCreateWithoutUserInput, EmployeeUncheckedCreateWithoutUserInput>;
		where?: EmployeeWhereInput;
	};

	export type EmployeeUpdateToOneWithWhereWithoutUserInput = {
		where?: EmployeeWhereInput;
		data: XOR<EmployeeUpdateWithoutUserInput, EmployeeUncheckedUpdateWithoutUserInput>;
	};

	export type EmployeeUpdateWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUpdateManyWithoutEmployeeNestedInput;
		defaultStation?: StationUpdateOneWithoutEmployeesWithDefaultNestedInput;
		lastStation?: StationUpdateOneWithoutEmployeesAtLastStationNestedInput;
	};

	export type EmployeeUncheckedUpdateWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		lastStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		defaultStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUncheckedUpdateManyWithoutEmployeeNestedInput;
	};

	export type ApiKeyUpsertWithWhereUniqueWithoutUserInput = {
		where: ApiKeyWhereUniqueInput;
		update: XOR<ApiKeyUpdateWithoutUserInput, ApiKeyUncheckedUpdateWithoutUserInput>;
		create: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>;
	};

	export type ApiKeyUpdateWithWhereUniqueWithoutUserInput = {
		where: ApiKeyWhereUniqueInput;
		data: XOR<ApiKeyUpdateWithoutUserInput, ApiKeyUncheckedUpdateWithoutUserInput>;
	};

	export type ApiKeyUpdateManyWithWhereWithoutUserInput = {
		where: ApiKeyScalarWhereInput;
		data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyWithoutUserInput>;
	};

	export type ApiKeyScalarWhereInput = {
		AND?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[];
		OR?: ApiKeyScalarWhereInput[];
		NOT?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[];
		id?: StringFilter<"ApiKey"> | string;
		name?: StringFilter<"ApiKey"> | string;
		key?: StringFilter<"ApiKey"> | string;
		userId?: StringFilter<"ApiKey"> | string;
		createdAt?: DateTimeFilter<"ApiKey"> | Date | string;
		expiresAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null;
		lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null;
	};

	export type UserCreateWithoutApiKeyInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		OAuthAccount?: OAuthAccountCreateNestedManyWithoutUserInput;
		Session?: SessionCreateNestedManyWithoutUserInput;
		Employee?: EmployeeCreateNestedOneWithoutUserInput;
	};

	export type UserUncheckedCreateWithoutApiKeyInput = {
		id?: string;
		email: string;
		name?: string | null;
		image?: string | null;
		role?: $Enums.User_role;
		createdAt?: Date | string;
		updatedAt: Date | string;
		employeeId?: string | null;
		OAuthAccount?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput;
		Session?: SessionUncheckedCreateNestedManyWithoutUserInput;
	};

	export type UserCreateOrConnectWithoutApiKeyInput = {
		where: UserWhereUniqueInput;
		create: XOR<UserCreateWithoutApiKeyInput, UserUncheckedCreateWithoutApiKeyInput>;
	};

	export type UserUpsertWithoutApiKeyInput = {
		update: XOR<UserUpdateWithoutApiKeyInput, UserUncheckedUpdateWithoutApiKeyInput>;
		create: XOR<UserCreateWithoutApiKeyInput, UserUncheckedCreateWithoutApiKeyInput>;
		where?: UserWhereInput;
	};

	export type UserUpdateToOneWithWhereWithoutApiKeyInput = {
		where?: UserWhereInput;
		data: XOR<UserUpdateWithoutApiKeyInput, UserUncheckedUpdateWithoutApiKeyInput>;
	};

	export type UserUpdateWithoutApiKeyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		OAuthAccount?: OAuthAccountUpdateManyWithoutUserNestedInput;
		Session?: SessionUpdateManyWithoutUserNestedInput;
		Employee?: EmployeeUpdateOneWithoutUserNestedInput;
	};

	export type UserUncheckedUpdateWithoutApiKeyInput = {
		id?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		name?: NullableStringFieldUpdateOperationsInput | string | null;
		image?: NullableStringFieldUpdateOperationsInput | string | null;
		role?: EnumUser_roleFieldUpdateOperationsInput | $Enums.User_role;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		employeeId?: NullableStringFieldUpdateOperationsInput | string | null;
		OAuthAccount?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput;
		Session?: SessionUncheckedUpdateManyWithoutUserNestedInput;
	};

	export type TimeLogCreateManyEmployeeInput = {
		id?: string;
		stationId?: string | null;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		taskId?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TaskAssignmentCreateManyEmployeeInput = {
		id?: string;
		taskTypeId: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type PerformanceMetricCreateManyEmployeeInput = {
		id?: string;
		date: Date | string;
		stationId?: string | null;
		hoursWorked: number;
		unitsProcessed?: number | null;
		efficiency?: number | null;
		qualityScore?: number | null;
		overtimeHours?: number | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type TimeLogUpdateWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Station?: StationUpdateOneWithoutTimeLogNestedInput;
		Task?: TaskAssignmentUpdateOneWithoutTimeLogsNestedInput;
	};

	export type TimeLogUncheckedUpdateWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		taskId?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogUncheckedUpdateManyWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		taskId?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TaskAssignmentUpdateWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TaskType?: TaskTypeUpdateOneRequiredWithoutTaskAssignmentNestedInput;
		TimeLogs?: TimeLogUpdateManyWithoutTaskNestedInput;
	};

	export type TaskAssignmentUncheckedUpdateWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		taskTypeId?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLogs?: TimeLogUncheckedUpdateManyWithoutTaskNestedInput;
	};

	export type TaskAssignmentUncheckedUpdateManyWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		taskTypeId?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type PerformanceMetricUpdateWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		date?: DateTimeFieldUpdateOperationsInput | Date | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		hoursWorked?: FloatFieldUpdateOperationsInput | number;
		unitsProcessed?: NullableIntFieldUpdateOperationsInput | number | null;
		efficiency?: NullableFloatFieldUpdateOperationsInput | number | null;
		qualityScore?: NullableFloatFieldUpdateOperationsInput | number | null;
		overtimeHours?: NullableFloatFieldUpdateOperationsInput | number | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type PerformanceMetricUncheckedUpdateWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		date?: DateTimeFieldUpdateOperationsInput | Date | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		hoursWorked?: FloatFieldUpdateOperationsInput | number;
		unitsProcessed?: NullableIntFieldUpdateOperationsInput | number | null;
		efficiency?: NullableFloatFieldUpdateOperationsInput | number | null;
		qualityScore?: NullableFloatFieldUpdateOperationsInput | number | null;
		overtimeHours?: NullableFloatFieldUpdateOperationsInput | number | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type PerformanceMetricUncheckedUpdateManyWithoutEmployeeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		date?: DateTimeFieldUpdateOperationsInput | Date | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		hoursWorked?: FloatFieldUpdateOperationsInput | number;
		unitsProcessed?: NullableIntFieldUpdateOperationsInput | number | null;
		efficiency?: NullableFloatFieldUpdateOperationsInput | number | null;
		qualityScore?: NullableFloatFieldUpdateOperationsInput | number | null;
		overtimeHours?: NullableFloatFieldUpdateOperationsInput | number | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogCreateManyStationInput = {
		id?: string;
		employeeId: string;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		taskId?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TaskTypeCreateManyStationInput = {
		id?: string;
		name: string;
		description?: string | null;
		estimatedMinutesPerUnit?: number | null;
		isActive?: boolean;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type EmployeeCreateManyLastStationInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		defaultStationId?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type EmployeeCreateManyDefaultStationInput = {
		id?: string;
		name: string;
		email: string;
		pinHash?: string | null;
		lastStationId?: string | null;
		dailyHoursLimit?: number | null;
		weeklyHoursLimit?: number | null;
		employeeCode?: string | null;
		phoneNumber?: string | null;
		hireDate?: Date | string | null;
		status?: $Enums.EmployeeStatus;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type TimeLogUpdateWithoutStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Employee?: EmployeeUpdateOneRequiredWithoutTimeLogNestedInput;
		Task?: TaskAssignmentUpdateOneWithoutTimeLogsNestedInput;
	};

	export type TimeLogUncheckedUpdateWithoutStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		taskId?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogUncheckedUpdateManyWithoutStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		taskId?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TaskTypeUpdateWithoutStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TaskAssignment?: TaskAssignmentUpdateManyWithoutTaskTypeNestedInput;
	};

	export type TaskTypeUncheckedUpdateWithoutStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TaskAssignment?: TaskAssignmentUncheckedUpdateManyWithoutTaskTypeNestedInput;
	};

	export type TaskTypeUncheckedUpdateManyWithoutStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		description?: NullableStringFieldUpdateOperationsInput | string | null;
		estimatedMinutesPerUnit?: NullableFloatFieldUpdateOperationsInput | number | null;
		isActive?: BoolFieldUpdateOperationsInput | boolean;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type EmployeeUpdateWithoutLastStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutEmployeeNestedInput;
		User?: UserUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUpdateManyWithoutEmployeeNestedInput;
		defaultStation?: StationUpdateOneWithoutEmployeesWithDefaultNestedInput;
	};

	export type EmployeeUncheckedUpdateWithoutLastStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		defaultStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutEmployeeNestedInput;
		User?: UserUncheckedUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUncheckedUpdateManyWithoutEmployeeNestedInput;
	};

	export type EmployeeUncheckedUpdateManyWithoutLastStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		defaultStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type EmployeeUpdateWithoutDefaultStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUpdateManyWithoutEmployeeNestedInput;
		User?: UserUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUpdateManyWithoutEmployeeNestedInput;
		lastStation?: StationUpdateOneWithoutEmployeesAtLastStationNestedInput;
	};

	export type EmployeeUncheckedUpdateWithoutDefaultStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		lastStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLog?: TimeLogUncheckedUpdateManyWithoutEmployeeNestedInput;
		User?: UserUncheckedUpdateOneWithoutEmployeeNestedInput;
		TaskAssignment?: TaskAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput;
		PerformanceMetric?: PerformanceMetricUncheckedUpdateManyWithoutEmployeeNestedInput;
	};

	export type EmployeeUncheckedUpdateManyWithoutDefaultStationInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		email?: StringFieldUpdateOperationsInput | string;
		pinHash?: NullableStringFieldUpdateOperationsInput | string | null;
		lastStationId?: NullableStringFieldUpdateOperationsInput | string | null;
		dailyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		weeklyHoursLimit?: NullableFloatFieldUpdateOperationsInput | number | null;
		employeeCode?: NullableStringFieldUpdateOperationsInput | string | null;
		phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
		hireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TaskAssignmentCreateManyTaskTypeInput = {
		id?: string;
		employeeId: string;
		startTime?: Date | string;
		endTime?: Date | string | null;
		unitsCompleted?: number | null;
		notes?: string | null;
		createdAt?: Date | string;
		updatedAt?: Date | string;
	};

	export type TaskAssignmentUpdateWithoutTaskTypeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Employee?: EmployeeUpdateOneRequiredWithoutTaskAssignmentNestedInput;
		TimeLogs?: TimeLogUpdateManyWithoutTaskNestedInput;
	};

	export type TaskAssignmentUncheckedUpdateWithoutTaskTypeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		TimeLogs?: TimeLogUncheckedUpdateManyWithoutTaskNestedInput;
	};

	export type TaskAssignmentUncheckedUpdateManyWithoutTaskTypeInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		unitsCompleted?: NullableIntFieldUpdateOperationsInput | number | null;
		notes?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogCreateManyTaskInput = {
		id?: string;
		employeeId: string;
		stationId?: string | null;
		type?: $Enums.TimeLog_type;
		startTime?: Date | string;
		endTime?: Date | string | null;
		note?: string | null;
		deletedAt?: Date | string | null;
		correctedBy?: string | null;
		clockMethod?: $Enums.ClockMethod;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type TimeLogUpdateWithoutTaskInput = {
		id?: StringFieldUpdateOperationsInput | string;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		Employee?: EmployeeUpdateOneRequiredWithoutTimeLogNestedInput;
		Station?: StationUpdateOneWithoutTimeLogNestedInput;
	};

	export type TimeLogUncheckedUpdateWithoutTaskInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type TimeLogUncheckedUpdateManyWithoutTaskInput = {
		id?: StringFieldUpdateOperationsInput | string;
		employeeId?: StringFieldUpdateOperationsInput | string;
		stationId?: NullableStringFieldUpdateOperationsInput | string | null;
		type?: EnumTimeLog_typeFieldUpdateOperationsInput | $Enums.TimeLog_type;
		startTime?: DateTimeFieldUpdateOperationsInput | Date | string;
		endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		note?: NullableStringFieldUpdateOperationsInput | string | null;
		deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		correctedBy?: NullableStringFieldUpdateOperationsInput | string | null;
		clockMethod?: EnumClockMethodFieldUpdateOperationsInput | $Enums.ClockMethod;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type OAuthAccountCreateManyUserInput = {
		provider: string;
		providerUserId: string;
		accessToken?: string | null;
		refreshToken?: string | null;
		expiresAt?: Date | string | null;
		scope?: string | null;
		tokenType?: string | null;
		createdAt?: Date | string;
		updatedAt: Date | string;
	};

	export type SessionCreateManyUserInput = {
		id?: string;
		expiresAt: Date | string;
		createdAt?: Date | string;
	};

	export type ApiKeyCreateManyUserInput = {
		id?: string;
		name: string;
		key: string;
		createdAt?: Date | string;
		expiresAt?: Date | string | null;
		lastUsedAt?: Date | string | null;
	};

	export type OAuthAccountUpdateWithoutUserInput = {
		provider?: StringFieldUpdateOperationsInput | string;
		providerUserId?: StringFieldUpdateOperationsInput | string;
		accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
		refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		scope?: NullableStringFieldUpdateOperationsInput | string | null;
		tokenType?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type OAuthAccountUncheckedUpdateWithoutUserInput = {
		provider?: StringFieldUpdateOperationsInput | string;
		providerUserId?: StringFieldUpdateOperationsInput | string;
		accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
		refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		scope?: NullableStringFieldUpdateOperationsInput | string | null;
		tokenType?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type OAuthAccountUncheckedUpdateManyWithoutUserInput = {
		provider?: StringFieldUpdateOperationsInput | string;
		providerUserId?: StringFieldUpdateOperationsInput | string;
		accessToken?: NullableStringFieldUpdateOperationsInput | string | null;
		refreshToken?: NullableStringFieldUpdateOperationsInput | string | null;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		scope?: NullableStringFieldUpdateOperationsInput | string | null;
		tokenType?: NullableStringFieldUpdateOperationsInput | string | null;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type SessionUpdateWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type SessionUncheckedUpdateWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type SessionUncheckedUpdateManyWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
	};

	export type ApiKeyUpdateWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		key?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
	};

	export type ApiKeyUncheckedUpdateWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		key?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
	};

	export type ApiKeyUncheckedUpdateManyWithoutUserInput = {
		id?: StringFieldUpdateOperationsInput | string;
		name?: StringFieldUpdateOperationsInput | string;
		key?: StringFieldUpdateOperationsInput | string;
		createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
		expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
		lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
	};

	/**
	 * Batch Payload for updateMany & deleteMany & createMany
	 */

	export type BatchPayload = {
		count: number;
	};

	/**
	 * DMMF
	 */
	export const dmmf: runtime.BaseDMMF;
}
