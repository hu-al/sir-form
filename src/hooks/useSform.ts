import { useState, ChangeEvent } from "react";
import { MayArr } from "../types/types";

/**
 * Types for form messages
 * - test: function to check if message applies
 * - message: the text to display
 * - type: optional type (e.g., "error", "warning")
 */
export type FormMessage<T> = {
  test: (newValue: T) => boolean;
  message: string;
  type?: string;
};

/**
 * Types for each individual field
 * - initialValue: starting value of the field
 * - messages: individual validation messages
 * - constraints: function or array of functions to transform input
 * - props: extra props to pass to the UI component
 */
export type FormField<T> = {
  initialValue: T;
  messages?: FormMessage<T> | FormMessage<T>[];
  constraints?: ((arg: T) => T) | ((arg: T) => T)[];
  props?: Record<string, any>;
};

// Extract field types dynamically from config
export type FieldsField<T extends FConfig["fields"]> = {
  [E in keyof T]: FormField<T[E]["initialValue"]>;
};

// Base configuration type
type FConfig = {
  fields: { [x: string]: FormField<any> };
  globalMessages?: MayArr<any>;
  globalConstraints?: any;
};

// Final form configuration type
export type FormConfig<TConf extends FConfig> = {
  fields: FieldsField<TConf["fields"]>;
  globalConstraints?: MayArr<GlobalConstraint<TConf>>;
  globalMessages?: MayArr<GlobalMessage<TConf>>;
};

// Form values: object mapping field name → value
export type FormValues<TConf extends FConfig> = {
  [E in keyof TConf["fields"]]: any;
};

// Form messages: object mapping field name → string|null
export type FormMessages<TConf extends FConfig> = {
  [E in keyof TConf["fields"]]: string | null;
};

// Global message type
export type GlobalMessage<U extends FConfig> = {
  test: (newValues: FormValues<U>) => boolean;
  message: { [E in keyof U["fields"]]: string };
  type?: string;
};

// Global constraint type: receives all values, returns new values
export type GlobalConstraint<U extends FConfig> = (
  arg: FormValues<U>
) => FormValues<U>;

/**
 * Initializes values for all fields based on config
 */
const initialValues = <TConf extends FConfig>(config: TConf) =>
  Object.keys(config.fields).reduce(
    (acc: object, fieldId) => ({
      ...acc,
      [fieldId]: config.fields[fieldId].initialValue || "",
    }),
    {}
  ) as FormValues<TConf>;

/**
 * Initializes messages for all fields (empty)
 */
const initialMessages = <TConf extends FConfig>(config: TConf) =>
  Object.keys(config.fields).reduce(
    (acc: object, fieldId) => ({ ...acc, [fieldId]: "" }),
    {}
  ) as FormMessages<TConf>;

/**
 * Main hook
 * Returns:
 * - field: function to get props for each input
 * - values: current form values
 * - messages: current messages per field
 */
export const useSform = <TConf extends FConfig>(config: TConf) => {
  const [values, setValues] = useState<FormValues<TConf>>(
    initialValues(config)
  );
  const [messages, setMessages] = useState<FormMessages<TConf>>(
    initialMessages(config)
  );
  const [globalMessages, setGlobalMessages] = useState<FormMessages<TConf>>(
    initialMessages(config)
  );

  /**
   * Apply individual field constraints
   */
  const applyIndividualConstraints = <TValues>(
    ev: ChangeEvent<HTMLInputElement>,
    oldState: TValues
  ): TValues => {
    const id = ev.target.id;
    const value = ev.target.value;
    const indCons = config.fields[id].constraints;

    if (indCons) {
      const newValue = Array.isArray(indCons)
        ? indCons.reduce((acc, fn) => fn(acc), value)
        : indCons(value);
      return { ...oldState, [id]: newValue };
    }

    return oldState;
  };

  /**
   * Apply global constraints (whole form)
   */
  const applyGlobalConstraints = (
    ev: ChangeEvent<HTMLInputElement>,
    middleState: any
  ) => {
    const gCons = config.globalConstraints;
    if (!gCons) return middleState;

    return Array.isArray(gCons)
      ? gCons.reduce((acc, fn) => fn(acc), middleState)
      : gCons(middleState);
  };

  /**
   * Calculate global messages
   */
  const calculateGlobalMessages = (
    ev: ChangeEvent,
    newValues: FormValues<TConf>
  ) => {
    let newErrors = Object.keys(newValues).reduce(
      (acc, id) => ({ ...acc, [id]: "" }),
      {}
    );
    const gMessages = config.globalMessages;

    if (!gMessages) return newErrors;

    if (Array.isArray(gMessages)) {
      return gMessages.reduce(
        (acc, msg) => (msg.test(newValues) ? { ...acc, ...msg.message } : acc),
        newErrors
      );
    } else if (gMessages.test(newValues)) {
      return { ...newErrors, ...gMessages.message };
    }

    return newErrors;
  };

  /**
   * Calculate messages for individual fields
   */
  const calculateIndividualMessages = (
    ev: ChangeEvent<HTMLInputElement>,
    newValues: any
  ) => {
    const returnValue: any = {};

    for (const id of Object.keys(config.fields)) {
      const fieldMessages = config.fields[id]?.messages;
      if (!fieldMessages) continue;

      if (Array.isArray(fieldMessages)) {
        for (const validation of fieldMessages) {
          if (validation.test(newValues[id]))
            returnValue[id] = validation.message;
        }
      } else {
        if (fieldMessages.test(newValues[id]))
          returnValue[id] = fieldMessages.message;
      }
    }

    return returnValue;
  };

  /**
   * onChange handler for all inputs
   */
  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const id = ev.target.id;
    if (!id) return;

    const middleValues = applyIndividualConstraints(ev, values);
    const newValues = applyGlobalConstraints(ev, middleValues);

    const gMessages = calculateGlobalMessages(ev, newValues);
    const individualMessages = calculateIndividualMessages(ev, newValues);

    setValues(newValues);
    setMessages({ ...individualMessages });
    setGlobalMessages((oldGlobalMessages) => ({
      ...oldGlobalMessages,
      ...gMessages,
    }));
  };

  /**
   * Returns props for a given field
   * Usage: <MyInput {...field("name")} />
   */
  function field(id: keyof TConf["fields"] & string) {
    return {
      ...config.fields[id]?.props,
      id: String(id),
      value: values[id],
      onChange: onChange,
      error: messages[id] || globalMessages[id],
    };
  }

  return { field, values, messages };
};
