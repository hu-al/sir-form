import { useState, ChangeEvent } from "react";

export type MayArr<U> = U | U[];

export type FormMessage<T> = {
  test: (value: T) => boolean;
  message: string;
  type?: string;
};

export type FormField<T> = {
  initialValue: T;
  messages?: MayArr<FormMessage<T>>;
  constraints?: MayArr<(arg: T) => T>;
  props?: Record<string, any>;
};

export type FConfig<TFields extends Record<string, FormField<any>>> = {
  fields: TFields;
  globalMessages?: MayArr<GlobalMessage<{ fields: TFields }>>;
  globalConstraints?: MayArr<GlobalConstraint<{ fields: TFields }>>;
};

export type FieldValueType<T> = T extends FormField<infer U> ? U : never;

export type FormValues<TConf extends FConfig<any>> = {
  [K in keyof TConf["fields"]]: FieldValueType<TConf["fields"][K]>;
};

export type GlobalConstraint<TConf extends FConfig<any>> = (
  values: FormValues<TConf>
) => FormValues<TConf>;

export type GlobalMessage<TConf extends FConfig<any>> = {
  test: (values: FormValues<TConf>) => boolean;
  message: { [K in keyof TConf["fields"]]?: string };
  type?: string;
};

type hola<T> = {
  a: T;
  b: (a: T) => T;
};
