/**
 * Unfortunately we cannot simply iterate over all getter functions of a fivem-js class;
 * most fivem-js properties are getters which are potentially calling natives that silently throw some error.
 * For this reason we have to manually serialize a fivem-js object by inspecting and getting each property value.
 *
 * To simplify this process, here are some helper types that enable intellisense typing.
 *
 * Through a series of type modifications, a fivem-js class is converted into a custom JSON object.
 * All properties that are functions (excluding getters/setters) are stripped.
 * All other properties are mapped into the json with their original property name, but converted to an object
 * of type {value: originalPropertyValue, readonly: boolean}
 *
 * This way data sent to the ui can instantly be interpreted as editable or not, and all ui modifications
 * can be applied by setting the the changed value on the property path of the entity
 */

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

/* we have to remove all readonly modifiers, since otherwise we could not write the date into the JSON */
type Writable<T> = { -readonly [k in keyof T]: T[k] };

type JSONCompatible<T> = Writable<NonFunctionProperties<T>>;
type PartialJSONCompatible<T> = Partial<JSONCompatible<T>>;
type FivemJSONProperty<T> = {value: T, readonly: boolean};

export type FivemJSON<T> = {[k in keyof PartialJSONCompatible<T>]: FivemJSONProperty<JSONCompatible<T>[k]>}

/* to create toJSON functions for derived classes, it is helpful to exclude all types of the extended class */
export type OmitClass<T, O> = Omit<T, keyof O>;

export function toJsonProperty<T>(value: T, readonly = false): FivemJSONProperty<T> {
    return {
        value,
        readonly
    }
}
